import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blotter")({
  component: BlotterPage,
});

type Blt = {
  id: string;
  token: string;
  complainant_name: string;
  complainant_contact: string | null;
  respondent_name: string;
  incident_date: string | null;
  incident_location: string | null;
  description: string;
  status: "pending" | "accepted" | "rejected" | "resolved";
  admin_notes: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-warning/15 text-warning-foreground border border-warning/30",
  accepted: "bg-primary/15 text-primary border border-primary/30",
  rejected: "bg-destructive/15 text-destructive border border-destructive/30",
  resolved: "bg-success/15 text-success border border-success/30",
};

function BlotterPage() {
  const [items, setItems] = useState<Blt[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Blt | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Blt["status"]>("pending");

  const load = async () => {
    const { data, error } = await supabase.from("blotter_cases").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data as Blt[]);
  };
  useEffect(() => { load(); }, []);

  const open = (b: Blt) => {
    setSelected(b);
    setStatus(b.status);
    setNotes(b.admin_notes ?? "");
  };

  const save = async () => {
    if (!selected) return;
    const { error } = await supabase.from("blotter_cases").update({ status, admin_notes: notes || null }).eq("id", selected.id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setSelected(null);
    load();
  };

  const filtered = items.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    return [b.token, b.complainant_name, b.respondent_name].join(" ").toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold">Blotter Cases</h1>
        <p className="text-muted-foreground mt-1">Complaints filed by residents</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by token or names…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="p-3 font-medium">Token</th>
                  <th className="p-3 font-medium">Complainant</th>
                  <th className="p-3 font-medium">Respondent</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Filed</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => open(b)}>
                    <td className="p-3 font-mono font-medium">{b.token}</td>
                    <td className="p-3">{b.complainant_name}</td>
                    <td className="p-3">{b.respondent_name}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[b.status]}`}>{b.status}</span></td>
                    <td className="p-3 text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No cases.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-mono">{selected?.token}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Complainant: </span>{selected.complainant_name} {selected.complainant_contact && `(${selected.complainant_contact})`}</div>
              <div><span className="text-muted-foreground">Respondent: </span>{selected.respondent_name}</div>
              <div><span className="text-muted-foreground">Date: </span>{selected.incident_date ?? "—"}</div>
              <div><span className="text-muted-foreground">Location: </span>{selected.incident_location ?? "—"}</div>
              <div><span className="text-muted-foreground">Details: </span><div className="mt-1 p-2 bg-muted rounded">{selected.description}</div></div>
              <div className="pt-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Blt["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Admin notes (visible to resident)</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={save}>Save changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
