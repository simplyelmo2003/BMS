
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "first admin claim" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (
    role = 'admin'
    AND user_id = auth.uid()
    AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
  );
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Residents
CREATE TABLE public.residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  age INT NOT NULL CHECK (age >= 0 AND age < 150),
  gender TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage residents" ON public.residents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Sequences for tokens
CREATE SEQUENCE public.cert_token_seq START 1;
CREATE SEQUENCE public.blt_token_seq START 1;

-- Certificate requests
CREATE TYPE public.cert_status AS ENUM ('pending', 'approved', 'rejected', 'ready');

CREATE TABLE public.certificate_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT,
  certificate_type TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status cert_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.certificate_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (public) can submit
CREATE POLICY "anyone can submit certificate" ON public.certificate_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Admins can do everything
CREATE POLICY "admins manage certificates" ON public.certificate_requests
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Blotter cases
CREATE TYPE public.blotter_status AS ENUM ('pending', 'accepted', 'rejected', 'resolved');

CREATE TABLE public.blotter_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  complainant_name TEXT NOT NULL,
  complainant_contact TEXT,
  respondent_name TEXT NOT NULL,
  incident_date DATE,
  incident_location TEXT,
  description TEXT NOT NULL,
  status blotter_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blotter_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit blotter" ON public.blotter_cases
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage blotters" ON public.blotter_cases
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Token generation triggers
CREATE OR REPLACE FUNCTION public.set_cert_token()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.token IS NULL OR NEW.token = '' THEN
    NEW.token := 'CERT-' || LPAD(nextval('public.cert_token_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_blt_token()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.token IS NULL OR NEW.token = '' THEN
    NEW.token := 'BLT-' || LPAD(nextval('public.blt_token_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_cert_token BEFORE INSERT ON public.certificate_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_cert_token();
CREATE TRIGGER trg_blt_token BEFORE INSERT ON public.blotter_cases
  FOR EACH ROW EXECUTE FUNCTION public.set_blt_token();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_residents_updated BEFORE UPDATE ON public.residents
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_cert_updated BEFORE UPDATE ON public.certificate_requests
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_blt_updated BEFORE UPDATE ON public.blotter_cases
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Public token-lookup RPCs (return only safe fields)
CREATE OR REPLACE FUNCTION public.lookup_certificate(_token text)
RETURNS TABLE (token text, full_name text, certificate_type text, status cert_status, admin_notes text, created_at timestamptz, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT token, full_name, certificate_type, status, admin_notes, created_at, updated_at
  FROM public.certificate_requests WHERE token = _token;
$$;

CREATE OR REPLACE FUNCTION public.lookup_blotter(_token text)
RETURNS TABLE (token text, complainant_name text, status blotter_status, admin_notes text, created_at timestamptz, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT token, complainant_name, status, admin_notes, created_at, updated_at
  FROM public.blotter_cases WHERE token = _token;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_certificate(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lookup_blotter(text) TO anon, authenticated;
