import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import sanroquelogo from "@/assets/sanroquelogo.jpg";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ error: typeof s.error === "string" ? s.error : undefined }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (search.error === "not_admin") toast.error("That account is not an admin.");
  }, [search.error]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/login" },
        });
        if (error) throw error;
        toast.success("Account created. Please check your email to confirm, then sign in.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // If no admin exists yet, make this user the first admin
        const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
        if ((count ?? 0) === 0) {
          await supabase.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
        }
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
        if (!roles?.some((r) => r.role === "admin")) {
          await supabase.auth.signOut();
          throw new Error("This account is not an admin.");
        }
        router.navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[image:var(--gradient-hero)]">
      <Card className="w-full max-w-md border-0 shadow-[var(--shadow-soft)]">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 overflow-hidden rounded-xl bg-white shadow-sm">
              <img src={sanroquelogo} alt="San Roque logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-2xl font-display font-semibold">Admin Sign In</h1>
            <p className="text-sm text-muted-foreground">Barangay Management System</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label>Password</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create admin account"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>No admin yet? <button className="text-primary underline" onClick={() => setMode("signup")}>Create the first admin</button></>
            ) : (
              <button className="text-primary underline" onClick={() => setMode("login")}>Back to sign in</button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
