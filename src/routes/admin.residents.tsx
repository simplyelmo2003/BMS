import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Sheet, File } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/residents")({
  component: ResidentsPage,
});

type Resident = {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  address: string;
  contact: string | null;
  birthday: string | null;
  civil_status: string | null;
  created_at: string;
};

function ResidentsPage() {
  const [items, setItems] = useState<Resident[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Resident | null>(null);
  const [form, setForm] = useState({ full_name: "", age: "", gender: "Male", address: "", contact: "", birthday: "", civil_status: "" });

  const load = async () => {
    const { data, error } = await supabase.from("residents").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data as Resident[]);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => {
    setEditing(null);
    setForm({ full_name: "", age: "", gender: "Male", address: "", contact: "", birthday: "", civil_status: "" });
    setOpen(true);
  };
  const startEdit = (r: Resident) => {
    setEditing(r);
    setForm({ 
      full_name: r.full_name, 
      age: String(r.age), 
      gender: r.gender, 
      address: r.address, 
      contact: r.contact ?? "", 
      birthday: r.birthday ?? "", 
      civil_status: r.civil_status ?? "" 
    });
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(form.age, 10);
    if (!form.full_name.trim() || isNaN(age) || !form.address.trim()) {
      toast.error("Please fill in name, age, and address.");
      return;
    }
    const payload = { 
      full_name: form.full_name.trim(), 
      age, 
      gender: form.gender, 
      address: form.address.trim(), 
      contact: form.contact.trim() || null,
      birthday: form.birthday.trim() || null,
      civil_status: form.civil_status.trim() || null
    };
    const { error } = editing
      ? await supabase.from("residents").update(payload).eq("id", editing.id)
      : await supabase.from("residents").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Resident updated" : "Resident added");
    setOpen(false);
    load();
  };

  const remove = async (r: Resident) => {
    if (!confirm(`Delete resident ${r.full_name}?`)) return;
    const { error } = await supabase.from("residents").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Resident deleted");
    load();
  };

  const filtered = items.filter((r) =>
    [r.full_name, r.address, r.gender, r.contact ?? ""].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const exportToExcel = async () => {
    try {
      // Dynamic import to avoid bundling xlsx in the main bundle
      const XLSX = await import('xlsx');
      
      const data = filtered.map(r => ({
        'Full Name': r.full_name,
        'Age': r.age,
        'Gender': r.gender,
        'Birthday': r.birthday || '',
        'Civil Status': r.civil_status || '',
        'Address': r.address,
        'Contact': r.contact || '',
        'Date Registered': new Date(r.created_at).toLocaleDateString()
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Residents');
      
      const fileName = `residents_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Excel file exported successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to export Excel file');
    }
  };

  const exportToPDF = async () => {
    try {
      // Dynamic import to avoid bundling jspdf in the main bundle
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Barangay Residents List', 14, 22);
      
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      doc.text(`Total Residents: ${filtered.length}`, 14, 38);
      
      // Prepare table data
      const tableData = filtered.map(r => [
        r.full_name,
        r.age.toString(),
        r.gender,
        r.birthday || '-',
        r.civil_status || '-',
        r.address,
        r.contact || '-',
        new Date(r.created_at).toLocaleDateString()
      ]);
      
      // Add table
      autoTable(doc, {
        head: [['Full Name', 'Age', 'Gender', 'Birthday', 'Civil Status', 'Address', 'Contact', 'Date Registered']],
        body: tableData,
        startY: 45,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
      
      const fileName = `residents_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('PDF file exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF file');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-semibold">Residents</h1>
          <p className="text-muted-foreground mt-1">{items.length} registered</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Add Resident</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} resident</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Full name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Age</Label><Input type="number" min="0" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required /></div>
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
              <div><Label>Contact (optional)</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
              <div><Label>Birthday (optional)</Label><Input type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} /></div>
              <div>
                <Label>Civil Status (optional)</Label>
                <Select value={form.civil_status} onValueChange={(v) => setForm({ ...form, civil_status: v })}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter><Button type="submit">{editing ? "Save" : "Add"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search residents…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button variant="outline" onClick={exportToExcel}>
          <Sheet className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
        <Button variant="outline" onClick={exportToPDF}>
          <File className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card className="border-0 shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Age</th>
                  <th className="p-3 font-medium">Gender</th>
                  <th className="p-3 font-medium">Birthday</th>
                  <th className="p-3 font-medium">Civil Status</th>
                  <th className="p-3 font-medium">Address</th>
                  <th className="p-3 font-medium">Contact</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3 font-medium">{r.full_name}</td>
                    <td className="p-3">{r.age}</td>
                    <td className="p-3">{r.gender}</td>
                    <td className="p-3">{r.birthday ?? "—"}</td>
                    <td className="p-3">{r.civil_status ?? "—"}</td>
                    <td className="p-3 max-w-xs truncate">{r.address}</td>
                    <td className="p-3">{r.contact ?? "—"}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(r)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No residents found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
