import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Copy } from "lucide-react";

export const Route = createFileRoute("/file-blotter")({
  head: () => ({ meta: [{ title: "File a Blotter Complaint — Barangay" }] }),
  component: FileBlotterPage,
});

function FileBlotterPage() {
  const [form, setForm] = useState({ complainant_name: "", complainant_contact: "", respondent_name: "", incident_date: "", incident_location: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.complainant_name.trim() || !form.respondent_name.trim() || !form.description.trim()) {
      return toast.error("Please fill all required fields.");
    }
    setBusy(true);
    const { data, error } = await supabase
      .from("blotter_cases")
      .insert({
        complainant_name: form.complainant_name.trim(),
        complainant_contact: form.complainant_contact.trim() || null,
        respondent_name: form.respondent_name.trim(),
        incident_date: form.incident_date || null,
        incident_location: form.incident_location.trim() || null,
        description: form.description.trim(),
        token: "",
      })
      .select("token")
      .single();
    setBusy(false);
    if (error || !data) return toast.error(error?.message ?? "Submission failed");
    setToken(data.token);
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-hero)]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
        <Card className="mt-6 border-0 shadow-[var(--shadow-soft)]">
          <CardContent className="p-8">
            {token ? (
              <div className="text-center space-y-5 py-6">
                <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
                <h1 className="text-2xl font-display font-semibold">Complaint filed</h1>
                <p className="text-muted-foreground">Keep this token private — use it to check your case status.</p>
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-primary/10 border border-primary/30">
                  <span className="font-mono text-2xl font-semibold text-primary">{token}</span>
                  <button className="text-muted-foreground hover:text-foreground" onClick={() => { navigator.clipboard.writeText(token); toast.success("Copied"); }}>
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <Button asChild><Link to="/track" search={{ token } as never}>Track this case</Link></Button>
                  <Button asChild variant="outline"><Link to="/">Done</Link></Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-display font-semibold">File a Blotter Complaint</h1>
                  <p className="text-sm text-muted-foreground">A token (BLT-0001) will be issued so you can follow up privately.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Your name *</Label><Input value={form.complainant_name} onChange={(e) => setForm({ ...form, complainant_name: e.target.value })} required /></div>
                  <div><Label>Your contact</Label><Input value={form.complainant_contact} onChange={(e) => setForm({ ...form, complainant_contact: e.target.value })} /></div>
                </div>
                <div><Label>Respondent name *</Label><Input value={form.respondent_name} onChange={(e) => setForm({ ...form, respondent_name: e.target.value })} required /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Incident date</Label><Input type="date" value={form.incident_date} onChange={(e) => setForm({ ...form, incident_date: e.target.value })} /></div>
                  <div><Label>Location</Label><Input value={form.incident_location} onChange={(e) => setForm({ ...form, incident_location: e.target.value })} /></div>
                </div>
                <div><Label>What happened? *</Label><Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Submitting…" : "File complaint"}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
