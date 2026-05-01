import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Search } from "lucide-react";

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s.token === "string" ? s.token : undefined }),
  head: () => ({ meta: [{ title: "Track Your Request — Barangay" }] }),
  component: TrackPage,
});

type Result =
  | { kind: "cert"; token: string; full_name: string; certificate_type: string; status: string; admin_notes: string | null; created_at: string; updated_at: string }
  | { kind: "blt"; token: string; complainant_name: string; status: string; admin_notes: string | null; created_at: string; updated_at: string };

const CERT_LABELS: Record<string, string> = { pending: "Pending", approved: "Approved", rejected: "Rejected", ready: "Ready to Pick Up" };
const BLT_LABELS: Record<string, string> = { pending: "Pending", accepted: "Accepted", rejected: "Rejected", resolved: "Resolved" };
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  approved: "bg-success/15 text-success border-success/30",
  ready: "bg-primary/15 text-primary border-primary/30",
  accepted: "bg-primary/15 text-primary border-primary/30",
  resolved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

function TrackPage() {
  const search = Route.useSearch();
  const [token, setToken] = useState(search.token ?? "");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  const lookup = async (t: string) => {
    const trimmed = t.trim().toUpperCase();
    if (!trimmed) return;
    setBusy(true);
    setResult(null);
    try {
      if (trimmed.startsWith("CERT-")) {
        const { data, error } = await supabase.rpc("lookup_certificate", { _token: trimmed });
        if (error) throw error;
        if (!data || data.length === 0) toast.error("No certificate request found.");
        else setResult({ kind: "cert", ...data[0] });
      } else if (trimmed.startsWith("BLT-")) {
        const { data, error } = await supabase.rpc("lookup_blotter", { _token: trimmed });
        if (error) throw error;
        if (!data || data.length === 0) toast.error("No blotter case found.");
        else setResult({ kind: "blt", ...data[0] });
      } else {
        toast.error("Token must start with CERT- or BLT-");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (search.token) lookup(search.token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[image:var(--gradient-hero)]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
        <Card className="mt-6 border-0 shadow-[var(--shadow-soft)]">
          <CardContent className="p-8 space-y-5">
            <div className="space-y-1">
              <h1 className="text-2xl font-display font-semibold">Track your request</h1>
              <p className="text-sm text-muted-foreground">Enter your token (e.g. CERT-0001 or BLT-0001).</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); lookup(token); }} className="flex gap-2">
              <Input className="font-mono" placeholder="CERT-0001" value={token} onChange={(e) => setToken(e.target.value)} />
              <Button type="submit" disabled={busy}><Search className="h-4 w-4 mr-2" />{busy ? "..." : "Track"}</Button>
            </form>

            {result && (
              <div className="rounded-xl border p-5 space-y-3 bg-background">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{result.kind === "cert" ? "Certificate Request" : "Blotter Case"}</div>
                    <div className="font-mono text-lg font-semibold">{result.token}</div>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full border ${STATUS_COLORS[result.status] ?? ""}`}>
                    {result.kind === "cert" ? CERT_LABELS[result.status] : BLT_LABELS[result.status]}
                  </span>
                </div>
                <div className="text-sm space-y-1 pt-2 border-t">
                  {result.kind === "cert" ? (
                    <>
                      <div><span className="text-muted-foreground">Name: </span>{result.full_name}</div>
                      <div><span className="text-muted-foreground">Type: </span>{result.certificate_type}</div>
                    </>
                  ) : (
                    <div><span className="text-muted-foreground">Filed by: </span>{result.complainant_name}</div>
                  )}
                  <div><span className="text-muted-foreground">Filed: </span>{new Date(result.created_at).toLocaleString()}</div>
                  <div><span className="text-muted-foreground">Last updated: </span>{new Date(result.updated_at).toLocaleString()}</div>
                </div>
                {result.admin_notes && (
                  <div className="text-sm p-3 rounded bg-accent text-accent-foreground">
                    <div className="text-xs font-medium uppercase tracking-wider mb-1">Note from admin</div>
                    {result.admin_notes}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
