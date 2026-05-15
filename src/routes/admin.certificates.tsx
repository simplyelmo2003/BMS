import { createFileRoute } from "@tanstack/react-router";
import { Search, Printer, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import sanroquelogo from "@/assets/sanroquelogo.jpg";
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
  const [showEditPreview, setShowEditPreview] = useState(false);
  const [editableCertData, setEditableCertData] = useState<{
    full_name: string;
    address: string;
    purpose: string;
    token: string;
  } | null>(null);
  const [editableCertBody, setEditableCertBody] = useState<string>("");
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const [editableFullContent, setEditableFullContent] = useState<string>("");
  const [editableSignature, setEditableSignature] = useState<{
    certifiedLabel: string;
    signatoryName: string;
    signatoryPosition: string;
    authorityLabel: string;
    authorityName: string;
    authorityPosition: string;
    businessOwnerName: string;
  } | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from("certificate_requests").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data as Cert[]);
  };

  // Generate certificate body text based on type
  const generateCertificateBody = (cert: Cert, fullName: string, address: string, purpose: string): string => {
    const today = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    switch (cert.certificate_type.toLowerCase()) {
      case "certificate of residency":
        return `This is to certify ${fullName.toUpperCase()} of legal/minor age, single, Filipino citizen and law-abiding person is a bonafide resident of ${address}.

This is to certify further that the above-named person is residing in Barangay San Roque from 2012 up to the present.

This certification is issued on this ${today} at the office of the Punong Barangay, Barangay San Roque, Surigao City upon the request of the aforesaid person for ${purpose}.`;
      case "barangay certificate":
        return `TO WHOM IT MAY CONCERN:

NAME: 	_____________________________________________________

AGE: 		_____________________________________________________

ADDRESS: 	_____________________________________________________

DATE OF DEATH: ________________________________________________

PLACE OF DEATH:   ______________________________________________

CAUSE OF DEATH (OPTIONAL): ___________________________________

	THIS IS TO CERTIFY that the aforementioned has been reported and validated to be dead by persons whose signature appears below.

	This certification is issued on this _____ day of ______________, 2026 at Barangay San Roque, Surigao City.
  
   ____________________________ 	                      __________________________
           Next to kin informant	                      Barangay Health Worker

    __________________ /________            ________________/ _________
           Date and time validated               Date and time validated

   _____________________________                DINDO B. LIBRES
   Sanitation inspector/Nurse/Midwife             Punong Barangay	 
                                    
   __________/__________________                        _______________ / __________
Date and time validated                Date and time validated`;
      case "barangay clearance":
        return `This is to certify that ${fullName.toUpperCase()} of minor /legal age, single/married/widow/widower, Filipino citizen, a resident of ${address} Barangay San Roque Surigao City is cleared from all the obligations of this Barangay and that he/she has fully satisfied/ paid for whatever liabilities he/she may have incurred as resident of this Barangay in coordination with the purok/district where he/she belongs.

This clearance certificate is issued on this ${today} upon the request of any interested party to support his/her ${purpose} requirement purposes only.`;
      case "business clearance":
        return `The Barangay Government of San Roque has no objection to the application for a BUSINESS PERMIT for the business named ${fullName.toUpperCase()}, located at ${address}.

The issuance of this clearance is subject to the condition that the above business complies with all existing national and local government laws, rules, and Barangay ordinances for the operation of the establishment, and that its operation does not pose any environmental or public hazard.

This clearance is issued this ${today} at Barangay San Roque, Surigao City and is valid until December 31, 2026 or until revoked.`;
      case "barangay certificate of low income":


        return `This is to certify that ${fullName.toUpperCase()} of legal age, single, Filipino and law-abiding citizen is a bonafide resident of ${address}.

       This certification is issued upon the request of ${fullName.toUpperCase()} for in need assistance due to experiencing financial difficulties and due to high inflation rate with the Department of Social Welfare and Development (DSWD) office, Surigao City.

       Issued on this ${today} at Barangay San Roque, Surigao City, Surigao del Norte.`;
      case "certificate of low income (type 1)":
        return `This is to certify that ${fullName.toUpperCase()}, Filipino citizen and resident of ${address}, belongs to the low-income sector of Barangay San Roque.

Based on Barangay records, the above-named person is qualified for assistance programs and social services.

Issued this ${today} at Barangay San Roque, Surigao City upon the request of the above-named person for ${purpose}.`;
      case "certificate of low income (type 2)":
        return `This is to certify that ${fullName.toUpperCase()}, Filipino citizen and resident of ${address}, is a member of a low-income family in Barangay San Roque.

Based on Barangay records, the above-named person is qualified for government assistance and social welfare benefits.

Issued this ${today} at Barangay San Roque, Surigao City upon the request of the above-named person for ${purpose}.`;
      case "certificate of indigency":
      case "certificate of indigency (type 1)":
        return `This is to certify ${fullName.toUpperCase()} of legal/minor age, single/married/widow/widower, Filipino and law-abiding citizen is a bonafide resident of ${address}.

This is to certify further that the above-mentioned name is identified as an indigent person in the Barangay and his/her family has no enough income to support their family needs.

This certification is issued on this ${today} at the office of the Punong Barangay, Barangay San Roque, Surigao City upon the request of the aforesaid person to support his/her scholarship application requirement purpose only.`;
      case "certificate of indigency (type 2)":
        return `This is to certify that ${fullName.toUpperCase()}, Filipino citizen and resident of ${address}, belongs to an indigent family in Barangay San Roque.

The above-named person is eligible for medical, burial, and social welfare assistance from the Barangay.

Issued this ${today} at Barangay San Roque, Surigao City upon the request of the above-named person for ${purpose}.`;
      default:
        return `This is to certify that ${fullName.toUpperCase()}, Filipino citizen and resident of ${address}, is a bonafide resident of Barangay San Roque.

Issued this ${today} at Barangay San Roque, Surigao City upon the request of the above-named person for ${purpose}.`;
    }
  };

  const generateCertificateBodyHTML = (
    cert: Cert,
    fullName: string,
    address: string,
    purpose: string,
    today: string,
    customBody?: string,
  ) => {
    if (cert.certificate_type.toLowerCase() === "business clearance" && !customBody) {
      return `
        <p>The Barangay Government of San Roque has no objection to the application for a BUSINESS PERMIT for the business named</p>
        <div class="business-name">${fullName.toUpperCase()}</div>
        <div class="business-location">${address}</div>
        <p>The issuance of this clearance is subject to the condition that the above business complies with all existing national and local government laws, rules, and Barangay ordinances for the operation of the establishment, and that its operation does not pose any environmental or public hazard.</p>
        <p>This clearance is issued this ${today} at Barangay San Roque, Surigao City and is valid until December 31, 2026 or until revoked.</p>
      `;
    }

    const bodyText = customBody ?? generateCertificateBody(cert, fullName, address, purpose);
    return bodyText.split('\n\n').map(paragraph =>
      `<p class="indent">${paragraph.trim()}</p>`
    ).join('\n');
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

  // Open edit preview dialog
  const renderCertificateHTML = (
    cert: Cert,
    override?: { full_name: string; address: string; purpose: string; token: string },
    customBody?: string,
    signatureOverride?: SignatureOverride,
  ) => {
    const token = override?.token ?? cert.token;
    const fullName = override?.full_name ?? cert.full_name;
    const address = override?.address ?? cert.address;
    const purpose = override?.purpose ?? cert.purpose;

    const title = cert.certificate_type.toUpperCase();
    
    const signature = signatureOverride ?? {
      certifiedLabel: "Certified/ Attested by:",
      signatoryName: "DINDO B. LIBRES",
      signatoryPosition: "Punong Barangay",
      authorityLabel: "With the authority of the Punong Barangay:",
      authorityName: "ROBERT P. GEROSANO",
      authorityPosition: "SB member/ Officer of the day",
      businessOwnerName: "",
    };

    const showAuthority = false;
    const authorityColumn = "";
    const showConformedBy = cert.certificate_type.toLowerCase() === "business clearance";
    const isBusinessClearance = cert.certificate_type.toLowerCase() === "business clearance";
    const isLowIncomeCert = cert.certificate_type.toLowerCase() === "barangay certificate of low income";
    const conformedByColumn = showConformedBy ? `
              <div class="conformed-column">
                <div class="conformed-label">Conformed by:</div>
                <div class="conformed-owner">${signature.businessOwnerName ?? ""}</div>
                <div class="conformed-name">Business owner</div>
              </div>
    ` : "";

    const today = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const defaultBody = generateCertificateBody(cert, fullName, address, purpose);
    const bodyParagraphs = (() => {
      if (cert.certificate_type.toLowerCase() === "business clearance") {
        if (!customBody || customBody === defaultBody) {
          return generateCertificateBodyHTML(cert, fullName, address, purpose, today);
        }
      }

      const bodyText = customBody ?? defaultBody;
      return bodyText.split('\n\n').map(paragraph =>
        `<p class="indent">${paragraph.trim()}</p>`
      ).join('\n');
    })();
    const contentClass = cert.certificate_type.toLowerCase() === "business clearance" ? "content business-clearance" : "content";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - ${token}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html,
            body {
              width: 210mm;
              height: 297mm;
              overflow: hidden;
              font-family: Arial, sans-serif;
              background: white;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }
            .certificate-container {
              width: 210mm;
              height: 297mm;
              position: relative;
              background: white;
              overflow: hidden;
              padding: 14mm 10mm 20mm 10mm;
            }
            .top-gray {
              position: absolute;
              top: 0;
              left: 0;
              width: 145mm;
              height: 16mm;
              background: #dfe8d7;
              clip-path: polygon(0 0, 100% 0, 97% 100%, 0 100%);
            }
            .top-green {
              position: absolute;
              top: 5mm;
              left: 0;
              width: 60mm;
              height: 22mm;
              background: #8cc63f;
              clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
            }
            .top-left-triangle {
              position: absolute;
              top: 6mm;
              left: 0;
              width: 18mm;
              height: 34mm;
              background: #47e05f;
              clip-path: polygon(0 0, 100% 50%, 0 100%);
            }
            .bottom-light {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 145mm;
              height: 16mm;
              background: #dfe8d7;
              clip-path: polygon(3% 0, 100% 0, 100% 100%, 0 100%);
            }
            .bottom-green {
              position: absolute;
              bottom: 5mm;
              right: 0;
              width: 60mm;
              height: 22mm;
              background: #8cc63f;
              clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%);
            }
            .bottom-right-triangle {
  position: absolute;
  bottom: 6mm;
  right: 0;
  width: 18mm;
  height: 34mm;
  background: #47e05f;
  clip-path: polygon(100% 0, 100% 100%, 0 50%);
  z-index: 5; /* 👈 ADD THIS */
}
            .header {
              text-align: center;
              margin-top: 2mm;
              position: relative;
              z-index: 5;
            }
            .logo {
              width: 24mm;
              height: 24mm;
              object-fit: contain;
              margin-bottom: 1mm;
            }
            .header p {
              font-size: 12px;
              line-height: 1.25;
              color: #000;
            }
            .office-title {
              font-weight: bold;
              margin-top: 3mm;
              font-size: 17px;
            }
            .certificate-title {
              border: 1px solid #7cb342;
              margin: 10mm auto 0 auto;
              padding: 4mm;
              width: 100%;
              text-align: center;
              font-size: 16px;
              font-weight: 500;
              letter-spacing: 0.5px;
              background: transparent;
            }
            .content {
              margin-top: 12mm;
              padding: 0 12mm;
              color: #000;
              font-size: 14px;
              line-height: 1.75;
            }
            .content p {
              margin-bottom: 7mm;
              text-align: justify;
            }
            .content.business-clearance {
              line-height: 1.6;
            }
            .content.business-clearance p {
              margin-bottom: 5mm;
            }
            .business-name {
              text-align: center;
              font-weight: bold;
              text-transform: uppercase;
              margin: 6mm 0 2mm;
              font-size: 15px;
            }
            .business-location {
              text-align: center;
              font-weight: bold;
              margin-bottom: 6mm;
              font-size: 14px;
            }
            .conformed-owner-line {
              width: 85mm;
              border-bottom: 1px solid #000;
              margin-bottom: 2mm;
              padding-bottom: 2mm;
              font-size: 13px;
              letter-spacing: 0.1em;
            }
            .conformed-owner {
              font-size: 13px;
              font-weight: 600;
              min-height: 6mm;
              text-align: left;
              margin-bottom: 1mm;
            }
            .indent {
              text-indent: 12mm;
            }
            .signature-section {
              margin-top: 12mm;
              width: 100%;
              display: flex;
              justify-content: space-between;
              gap: 24mm;
              align-items: flex-end;
              padding: 0 8mm 0 0;
            }
            .signature-section.business-clearance {
              padding-right: 18mm;
            }
            .signature-section.business-clearance .signature-column {
              margin-right: 0;
            }
            .signature-column {
              display: flex;
              flex-direction: column;
              width: max-content;
              text-align: center;
              align-items: center;
              margin-left: 14mm;
              min-width: 60mm;
            }
            .signature-section.signature-right {
              justify-content: flex-end;
            }
            .conformed-column {
              display: flex;
              flex-direction: column;
              min-width: 90mm;
              max-width: 110mm;
              text-align: left;
              align-items: flex-start;
            }
            .conformed-label {
              font-size: 13px;
              margin-bottom: 4mm;
              line-height: 1.3;
              white-space: nowrap;
            }
            .conformed-name {
              font-weight: bold;
              font-size: 14px;
              line-height: 1.3;
            }
            .signature-column {
              display: flex;
              flex-direction: column;
              width: max-content;
              text-align: center;
              align-items: center;
              margin-left: 16mm;
            }
            .certified {
              margin-bottom: 6mm;
              font-size: 14px;
              text-align: center;
              width: 100%;
            }
            .signatory {
              text-align: center;
              margin-bottom: 12mm;
              width: 120mm;
            }
            .signatory .name {
              font-weight: bold;
              font-size: 15px;
            }
            .signatory .position {
              font-size: 13px;
            }
            .authority {
              margin-bottom: 6mm;
              font-size: 13px;
              text-align: center;
              width: 100%;
            }
            .footer-note {
              position: absolute;
              left: 12mm;
              bottom: 36mm;
              font-size: 10px;
              line-height: 1.5;
              color: #000;
            }
           .footer-bar {
  position: absolute;
  bottom: 6mm;
  left: 0;
  width: 100%;
  height: 16mm;
  background: #dfe8d7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14mm;
  font-size: 10px;
  font-weight: 600;
  color: #2563eb;
  overflow: hidden;
  z-index: 2; /* 👈 ADD THIS (lower than triangle) */
}

.footer-bar::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 22mm;
  height: 100%;
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 4mm;
  z-index: 2;
}

.footer-center {
  display: flex;
  align-items: center;
  gap: 3mm;
  z-index: 2;
  color: #2563eb;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 2mm;
  z-index: 2;
  margin-right: 10mm;
}

.footer-icon {
  font-size: 11px;
  color: #000;
  font-weight: bold;
}
            @media print {
              html,
              body {
                width: 210mm;
                height: 297mm;
                background: white;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .certificate-container {
                width: 210mm;
                height: 297mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="top-gray"></div>
            <div class="top-green"></div>
            <div class="top-left-triangle"></div>
            <div class="bottom-light"></div>
            <div class="bottom-green"></div>
            <div class="bottom-right-triangle"></div>
            <div class="header">
              <img
                class="logo"
                src="${sanroquelogo}"
                alt="Barangay Logo"
              />
              <p>Republic of the Philippines</p>
              <p>Province of Surigao del Norte</p>
              <p>City of Surigao</p>
              <p>BARANGAY SAN ROQUE</p>
              <div class="office-title">OFFICE OF THE PUNONG BARANGAY</div>
            </div>
            <div class="certificate-title">${title}</div>
            <div class="${contentClass}">
              <p>To whom it may concern:</p>
              ${bodyParagraphs}
            </div>
            <div class="signature-section${isBusinessClearance ? ' business-clearance' : ''}${isLowIncomeCert ? ' signature-right' : ''}">
              ${conformedByColumn}
              <div class="signature-column">
                <div class="certified">${signature.certifiedLabel}</div>
                <div class="signatory">
                  <div class="name">${signature.signatoryName}</div>
                  <div class="position">${signature.signatoryPosition}</div>
                </div>
              </div>
              ${authorityColumn}
            </div>
           <div class="footer-bar">
  <div class="footer-left">
    <span>ABANTE BARANGAY SAN ROQUE</span>
  </div>

  <div class="footer-center">
    <span class="footer-icon">✉</span>
    <span>sanroquesurigaoocity@gmail.com</span>

    <span class="footer-icon">f</span>
    <span>Barangay San Roque Surigao City</span>
  </div>

  <div class="footer-right">
    <span class="footer-icon">☎</span>
    <span>09308630810</span>
  </div>
</div>
        </body>
      </html>
    `;
  };

  type SignatureOverride = {
    certifiedLabel: string;
    signatoryName: string;
    signatoryPosition: string;
    authorityLabel: string;
    authorityName: string;
    authorityPosition: string;
    businessOwnerName: string;
  };

  const printCertificate = (
    cert: Cert,
    override?: { full_name: string; address: string; purpose: string; token: string },
    customBody?: string,
    signatureOverride?: SignatureOverride,
  ) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const certificateHTML = renderCertificateHTML(cert, override, customBody, signatureOverride);
    printWindow.document.write(certificateHTML);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const printCertificateWithEdits = () => {
    if (!selected || !editableCertData) return;
    
    if (showAdvancedEdit && editableFullContent) {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      printWindow.document.write(editableFullContent);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    } else {
      printCertificate(selected, editableCertData, editableCertBody, editableSignature ?? undefined);
    }
    
    setShowEditPreview(false);
    setEditableCertData(null);
    setEditableCertBody("");
    setEditableFullContent("");
    setShowAdvancedEdit(false);
    setEditableSignature(null);
  };

  const openEditPreview = (cert: Cert) => {
    setSelected(cert);
    setEditableCertData({
      full_name: cert.full_name,
      address: cert.address,
      purpose: cert.purpose,
      token: cert.token,
    });
    // Generate the default body for editing
    const defaultBody = generateCertificateBody(cert, cert.full_name, cert.address, cert.purpose);
    setEditableCertBody(defaultBody);
    setEditableSignature({
      certifiedLabel: "Certified/ Attested by:",
      signatoryName: "DINDO B. LIBRES",
      signatoryPosition: "Punong Barangay",
      authorityLabel: "With the authority of the Punong Barangay:",
      authorityName: "ROBERT P. GEROSANO",
      authorityPosition: "SB member/ Officer of the day",
      businessOwnerName: "",
    });
    // Generate full certificate HTML for advanced editing
    const fullContent = renderCertificateHTML(cert, undefined, defaultBody, {
      certifiedLabel: "Certified/ Attested by:",
      signatoryName: "DINDO B. LIBRES",
      signatoryPosition: "Punong Barangay",
      authorityLabel: "With the authority of the Punong Barangay:",
      authorityName: "ROBERT P. GEROSANO",
      authorityPosition: "SB member/ Officer of the day",
      businessOwnerName: "",
    });
    setEditableFullContent(fullContent);
    setShowEditPreview(true);
  };


  const filtered = items.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    return [c.token, c.full_name, c.certificate_type, c.purpose].join(" ").toLowerCase().includes(q.toLowerCase());
  });

  const showAuthority = false;

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
                        Edit Status
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => { e.stopPropagation(); setSelected(c); openEditPreview(c); }}
                        className="mr-2"
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Edit & Print
                      </Button>
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
              <Button variant="outline" onClick={() => openEditPreview(selected)}>
                <Printer className="h-4 w-4 mr-2" />
                Edit & Print Certificate
              </Button>
            )}
            <Button onClick={save}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit & Print Preview Dialog */}
      <Dialog open={showEditPreview} onOpenChange={setShowEditPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Certificate Before Printing</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={!showAdvancedEdit ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAdvancedEdit(false)}
              >
                Simple Edit
              </Button>
              <Button
                variant={showAdvancedEdit ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAdvancedEdit(true)}
              >
                Advanced Edit
              </Button>
            </div>
          </DialogHeader>
          
          {showAdvancedEdit ? (
            // Advanced Full Content Editing
            <div className="space-y-4">
              <div className="border rounded-lg">
                <div className="p-3 bg-gray-50 border-b">
                  <Label className="text-sm font-semibold">Full Certificate HTML Content</Label>
                  <p className="text-xs text-muted-foreground">Edit the complete HTML content of the certificate</p>
                </div>
                <Textarea
                  value={editableFullContent}
                  onChange={(e) => setEditableFullContent(e.target.value)}
                  placeholder="Edit the full certificate HTML..."
                  rows={20}
                  className="font-mono text-xs border-0 rounded-none"
                />
              </div>
              <div className="bg-amber-50 p-3 rounded text-xs text-amber-800">
                ⚠️ Advanced editing allows full control over the certificate layout, styling, and content. Make sure to preserve the HTML structure.
              </div>
            </div>
          ) : (
            // Simple Field Editing
            editableCertData && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Full Name</Label>
                    <Input
                      value={editableCertData.full_name}
                      onChange={(e) =>
                        setEditableCertData({
                          ...editableCertData,
                          full_name: e.target.value,
                        })
                      }
                      placeholder="Enter full name"
                      size={10}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Address</Label>
                    <Input
                      value={editableCertData.address}
                      onChange={(e) =>
                        setEditableCertData({
                          ...editableCertData,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Purpose</Label>
                    <Input
                      value={editableCertData.purpose}
                      onChange={(e) =>
                        setEditableCertData({
                          ...editableCertData,
                          purpose: e.target.value,
                        })
                      }
                      placeholder="Enter purpose"
                    />
                  </div>
                </div>
                
<div className="border-t pt-4 space-y-4">
                <Label className="text-sm font-semibold">Certificate Letter Content</Label>
                <Textarea
                  value={editableCertBody}
                  onChange={(e) => setEditableCertBody(e.target.value)}
                  placeholder="Edit the certificate letter content..."
                  rows={6}
                  className="font-mono text-sm"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Signature Block</Label>
                    <Input
                      value={editableSignature?.certifiedLabel ?? ""}
                      onChange={(e) => editableSignature && setEditableSignature({ ...editableSignature, certifiedLabel: e.target.value })}
                      placeholder="Certified/ Attested by:"
                    />
                    <Input
                      value={editableSignature?.signatoryName ?? ""}
                      onChange={(e) => editableSignature && setEditableSignature({ ...editableSignature, signatoryName: e.target.value })}
                      placeholder="DINDO B. LIBRES"
                    />
                    <Input
                      value={editableSignature?.signatoryPosition ?? ""}
                      onChange={(e) => editableSignature && setEditableSignature({ ...editableSignature, signatoryPosition: e.target.value })}
                      placeholder="Punong Barangay"
                    />
                    {showAuthority && (
                      <>
                        <Input
                          value={editableSignature?.authorityLabel ?? ""}
                          onChange={(e) => editableSignature && setEditableSignature({ ...editableSignature, authorityLabel: e.target.value })}
                          placeholder="With the authority of the Punong Barangay:"
                        />
                        <Input
                          value={editableSignature?.authorityName ?? ""}
                          onChange={(e) => editableSignature && setEditableSignature({ ...editableSignature, authorityName: e.target.value })}
                          placeholder="ROBERT P. GEROSANO"
                        />
                        <Input
                          value={editableSignature?.authorityPosition ?? ""}
                          onChange={(e) => editableSignature && setEditableSignature({ ...editableSignature, authorityPosition: e.target.value })}
                          placeholder="SB member/ Officer of the day"
                        />
                      </>
                    )}
                    {selected?.certificate_type.toLowerCase() === "business clearance" && (
                      <Input
                        value={editableSignature?.businessOwnerName ?? ""}
                        onChange={(e) => editableSignature && setEditableSignature({ ...editableSignature, businessOwnerName: e.target.value })}
                        placeholder="Business owner name"
                      />
                    )}
                  </div>
                  <div className="p-4 border rounded bg-white text-sm leading-relaxed">
                    <Label className="text-xs font-semibold text-muted-foreground mb-2 block">Preview</Label>
                    <p className="font-semibold">{selected?.certificate_type.toUpperCase()}</p>
                    <p>To whom it may concern:</p>
                    <div className="whitespace-pre-line text-justify leading-relaxed" style={{ marginLeft: '32px', marginBottom: '12px' }}>
                      {editableCertBody}
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold">{editableSignature?.certifiedLabel}</p>
                      <p className="font-bold">{editableSignature?.signatoryName}</p>
                      <p>{editableSignature?.signatoryPosition}</p>
                      {selected?.certificate_type.toLowerCase() === "business clearance" && (
                        <>
                          <p className="mt-4 font-semibold">Conformed By:</p>
                          <p className="font-bold">{editableSignature?.businessOwnerName}</p>
                          <p>Business owner</p>
                        </>
                      )}
                      {showAuthority && (
                        <>
                          <p className="mt-4" style={{ marginLeft: '20px' }}>{editableSignature?.authorityLabel}</p>
                          <p className="font-bold" style={{ marginLeft: '20px' }}>{editableSignature?.authorityName}</p>
                          <p style={{ marginLeft: '20px' }}>{editableSignature?.authorityPosition}</p>
                        </>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded text-xs text-blue-800">
                  💡 Edit the fields above, then click "Print Certificate" when ready.
                </div>
              </div>
            )
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditPreview(false);
                setEditableCertData(null);
                setEditableCertBody("");
                setEditableFullContent("");
                setShowAdvancedEdit(false);
                setEditableSignature(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={printCertificateWithEdits}>
              <Printer className="h-4 w-4 mr-2" />
              Print Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

