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
import { Search, Printer } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/certificates")({
  component: CertificatesPage,
});

type Cert = {
  id: string;
  token: string;
  full_name: string;
  address: string;
  contact: string | null;
  certificate_type: string;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "ready";
  admin_notes: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-warning/15 text-warning-foreground border border-warning/30",
  approved: "bg-success/15 text-success border border-success/30",
  rejected: "bg-destructive/15 text-destructive border border-destructive/30",
  ready: "bg-primary/15 text-primary border border-primary/30",
};

function CertificatesPage() {
  const [items, setItems] = useState<Cert[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Cert | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Cert["status"]>("pending");

  const load = async () => {
    const { data, error } = await supabase.from("certificate_requests").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data as Cert[]);
  };
  useEffect(() => { load(); }, []);

  const open = (c: Cert) => {
    setSelected(c);
    setStatus(c.status);
    setNotes(c.admin_notes ?? "");
  };

  const save = async () => {
    if (!selected) return;
    const { error } = await supabase.from("certificate_requests").update({ status, admin_notes: notes || null }).eq("id", selected.id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setSelected(null);
    load();
  };

  const printCertificate = (cert: Cert) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const certificateHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${cert.token}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              margin: 0;
              padding: 40px;
              background: white;
              color: #333;
            }
            .certificate {
              border: 3px solid #2563eb;
              padding: 60px;
              text-align: center;
              max-width: 800px;
              margin: 0 auto;
              position: relative;
            }
            .header {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #1e40af;
            }
            .title {
              font-size: 36px;
              font-weight: bold;
              margin: 30px 0;
              text-transform: uppercase;
              color: #1e40af;
            }
            .content {
              font-size: 18px;
              line-height: 1.6;
              margin: 30px 0;
            }
            .details {
              text-align: left;
              margin: 40px 0;
              font-size: 16px;
            }
            .details div {
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 60px;
              font-size: 14px;
              color: #666;
            }
            .signature {
              margin-top: 80px;
              text-align: center;
            }
            .signature-line {
              border-bottom: 1px solid #333;
              width: 200px;
              margin: 0 auto;
              margin-top: 20px;
            }
            .token {
              position: absolute;
              top: 20px;
              right: 20px;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { padding: 20px; }
              .certificate { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="token">Token: ${cert.token}</div>
            <div class="header">Republic of the Philippines</div>
            <div class="header">Province of [Province]</div>
            <div class="header">Municipality of [Municipality]</div>
            <div class="header">Barangay [Barangay Name]</div>
            
            <div class="title">${cert.certificate_type}</div>
            
            <div class="content">
              This is to certify that <strong>${cert.full_name}</strong>, 
              of legal age, ${cert.certificate_type === 'Barangay Clearance' ? 'a resident of' : 'residing at'} 
              ${cert.address}, has applied for and is hereby granted this certificate.
            </div>
            
            <div class="content">
              <strong>Purpose:</strong> ${cert.purpose}
            </div>
            
            <div class="details">
              <div><strong>Certificate Type:</strong> ${cert.certificate_type}</div>
              <div><strong>Full Name:</strong> ${cert.full_name}</div>
              <div><strong>Address:</strong> ${cert.address}</div>
              ${cert.contact ? `<div><strong>Contact:</strong> ${cert.contact}</div>` : ''}
              <div><strong>Date Issued:</strong> ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
            
            <div class="signature">
              <div>Barangay Captain</div>
              <div class="signature-line"></div>
            </div>
            
            <div class="footer">
              This certificate is valid for six (6) months from the date of issuance.
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(certificateHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const filtered = items.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    return [c.token, c.full_name, c.certificate_type, c.purpose].join(" ").toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold">Certificate Requests</h1>
        <p className="text-muted-foreground mt-1">Manage and update request status</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by token or name…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="ready">Ready to Pick Up</SelectItem>
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
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Purpose</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-mono font-medium">{c.token}</td>
                    <td className="p-3">{c.full_name}</td>
                    <td className="p-3">{c.certificate_type}</td>
                    <td className="p-3 max-w-xs truncate">{c.purpose}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[c.status]}`}>{c.status === "ready" ? "Ready to pick up" : c.status}</span></td>
                    <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => { e.stopPropagation(); open(c); }}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      {c.status === "ready" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => { e.stopPropagation(); printCertificate(c); }}
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No requests.</td></tr>
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
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Name: </span>{selected.full_name}</div>
              <div><span className="text-muted-foreground">Type: </span>{selected.certificate_type}</div>
              <div><span className="text-muted-foreground">Purpose: </span>{selected.purpose}</div>
              <div><span className="text-muted-foreground">Address: </span>{selected.address}</div>
              <div><span className="text-muted-foreground">Contact: </span>{selected.contact ?? "—"}</div>
              <div className="pt-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Cert["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="ready">Ready to Pick Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Admin notes (visible to resident)</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            {selected?.status === "ready" && (
              <Button variant="outline" onClick={() => printCertificate(selected)}>
                <Printer className="h-4 w-4 mr-2" />
                Print Certificate
              </Button>
            )}
            <Button onClick={save}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
