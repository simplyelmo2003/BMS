-- Fix RLS policies to allow authenticated non-admin users to insert certificate requests and blotter cases

-- Drop the existing admin policies that include INSERT
DROP POLICY IF EXISTS "admins manage certificates" ON public.certificate_requests;
DROP POLICY IF EXISTS "admins manage blotters" ON public.blotter_cases;

-- Recreate admin policies as separate policies for SELECT, UPDATE, DELETE (excluding INSERT)
DROP POLICY IF EXISTS "admins select certificates" ON public.certificate_requests;
DROP POLICY IF EXISTS "admins update certificates" ON public.certificate_requests;
DROP POLICY IF EXISTS "admins delete certificates" ON public.certificate_requests;
DROP POLICY IF EXISTS "admins select blotters" ON public.blotter_cases;
DROP POLICY IF EXISTS "admins update blotters" ON public.blotter_cases;
DROP POLICY IF EXISTS "admins delete blotters" ON public.blotter_cases;

CREATE POLICY "admins select certificates" ON public.certificate_requests
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update certificates" ON public.certificate_requests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete certificates" ON public.certificate_requests
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins select blotters" ON public.blotter_cases
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update blotters" ON public.blotter_cases
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete blotters" ON public.blotter_cases
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RPC functions to insert records and return tokens without requiring client-side INSERT+RETURNING under RLS.
CREATE OR REPLACE FUNCTION public.create_certificate_request(
  _full_name text,
  _address text,
  _contact text,
  _certificate_type text,
  _purpose text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_token text;
BEGIN
  INSERT INTO public.certificate_requests (full_name, address, contact, certificate_type, purpose, token)
  VALUES (_full_name, _address, _contact, _certificate_type, _purpose, '')
  RETURNING token INTO new_token;
  RETURN new_token;
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_certificate_request(text, text, text, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_blotter_case(
  _complainant_name text,
  _complainant_contact text,
  _respondent_name text,
  _incident_date text,
  _incident_location text,
  _description text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_token text;
BEGIN
  INSERT INTO public.blotter_cases (complainant_name, complainant_contact, respondent_name, incident_date, incident_location, description, token)
  VALUES (_complainant_name, _complainant_contact, _respondent_name, nullif(_incident_date, '')::date, _incident_location, _description, '')
  RETURNING token INTO new_token;
  RETURN new_token;
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_blotter_case(text, text, text, text, text, text) TO anon, authenticated;
