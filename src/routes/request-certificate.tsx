import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Copy } from "lucide-react";

export const Route = createFileRoute("/request-certificate")({
  head: () => ({ meta: [{ title: "Request a Certificate — Barangay" }] }),
  component: RequestCertificatePage,
});

const TYPES = [
  "Barangay Clearance",
  "Certificate of Indigency",
  "Certificate of Residency",
  "Business Permit",
  "Business Clearance",
  "Barangay Certificate of Low Income",
  "Barangay Certificate",
  "Good Moral Character",
  "Other",
];

function RequestCertificatePage() {
  const [form, setForm] = useState({ full_name: "", address: "", contact: "", certificate_type: "Barangay Clearance", purpose: "" });
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.address.trim() || !form.purpose.trim()) {
      return toast.error("Please fill all required fields.");
    }
    setBusy(true);
    const { data, error } = await supabase.rpc("create_certificate_request", {
      _full_name: form.full_name.trim(),
      _address: form.address.trim(),
      _contact: form.contact.trim() || null,
      _certificate_type: form.certificate_type,
      _purpose: form.purpose.trim(),
    });
    setBusy(false);
    if (error || !data) return toast.error(error?.message ?? "Submission failed");
    setToken(data as string);
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
                <h1 className="text-2xl font-display font-semibold">Request submitted!</h1>
                <p className="text-muted-foreground">Save your token number to track your request.</p>
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-primary/10 border border-primary/30">
                  <span className="font-mono text-2xl font-semibold text-primary">{token}</span>
                  <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => { navigator.clipboard.writeText(token); toast.success("Copied"); }}>
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <Button asChild><Link to="/track" search={{ token } as never}>Track this request</Link></Button>
                  <Button asChild variant="outline"><Link to="/">Done</Link></Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-display font-semibold">Request a Certificate</h1>
                  <p className="text-sm text-muted-foreground">You'll receive a token (CERT-0001) to track your request.</p>
                </div>
                <div><Label>Full name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></div>
                <div>
                  <Label>Certificate type *</Label>
                  <Select value={form.certificate_type} onValueChange={(v) => setForm({ ...form, certificate_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Purpose *</Label><Textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required /></div>
                <div><Label>Address *</Label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
                <div><Label>Contact (optional)</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Submitting…" : "Submit request"}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
