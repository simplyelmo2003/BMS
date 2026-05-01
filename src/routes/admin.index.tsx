import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ShieldAlert, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function StatCard({ label, value, icon: Icon, hint }: { label: string; value: number | string; icon: React.ComponentType<{ className?: string }>; hint?: string }) {
  return (
    <Card className="border-0 shadow-[var(--shadow-card)]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-3xl font-display font-semibold mt-2">{value}</div>
            {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
          </div>
          <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center text-accent-foreground">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState({
    residents: 0,
    certs: 0,
    certPending: 0,
    blotters: 0,
    blotterPending: 0,
  });
  const [recent, setRecent] = useState<Array<{ kind: string; token: string; name: string; status: string; created_at: string }>>([]);

  useEffect(() => {
    (async () => {
      const [r, c, cp, b, bp, recentCerts, recentBlt] = await Promise.all([
        supabase.from("residents").select("*", { count: "exact", head: true }),
        supabase.from("certificate_requests").select("*", { count: "exact", head: true }),
        supabase.from("certificate_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("blotter_cases").select("*", { count: "exact", head: true }),
        supabase.from("blotter_cases").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("certificate_requests").select("token, full_name, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("blotter_cases").select("token, complainant_name, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        residents: r.count ?? 0,
        certs: c.count ?? 0,
        certPending: cp.count ?? 0,
        blotters: b.count ?? 0,
        blotterPending: bp.count ?? 0,
      });
      const merged = [
        ...(recentCerts.data ?? []).map((x) => ({ kind: "Certificate", token: x.token, name: x.full_name, status: x.status, created_at: x.created_at })),
        ...(recentBlt.data ?? []).map((x) => ({ kind: "Blotter", token: x.token, name: x.complainant_name, status: x.status, created_at: x.created_at })),
      ].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 8);
      setRecent(merged);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of barangay activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Residents" value={stats.residents} icon={Users} />
        <StatCard label="Certificate Requests" value={stats.certs} icon={FileText} hint={`${stats.certPending} pending`} />
        <StatCard label="Blotter Cases" value={stats.blotters} icon={ShieldAlert} hint={`${stats.blotterPending} pending`} />
        <StatCard label="Pending Items" value={stats.certPending + stats.blotterPending} icon={Clock} />
      </div>

      <Card className="border-0 shadow-[var(--shadow-card)]">
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="divide-y">
              {recent.map((item) => (
                <div key={item.token} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-medium">{item.token}</div>
                    <div className="text-sm text-muted-foreground truncate">{item.kind} · {item.name}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground capitalize">{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
