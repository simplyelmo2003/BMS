import { createFileRoute, Link } from "@tanstack/react-router";
import sanroquehall from "@/assets/sanroquehall.png";
import sanroquelogo from "@/assets/sanroquelogo.jpg";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FileText, ShieldAlert, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import amatos from "@/assets/amatos.jpg";
import cabalan from "@/assets/cabalan.png";
import edradan from "@/assets/edradan.png";
import pasculado from "@/assets/pasculado.jpg";
import plaza from "@/assets/plaza.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Barangay Management System — Certificates, Blotter & Tracking" },
      { name: "description", content: "Request certificates, file blotter complaints, and track requests by token number — all online." },
      { property: "og:title", content: "Barangay Management System" },
      { property: "og:description", content: "Online certificate requests, blotter filing, and token-based status tracking." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [showTeam, setShowTeam] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/90 shadow-sm">
              <img src={sanroquelogo} alt="San Roque logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-display font-semibold leading-tight">Barangay</div>
              <div className="text-xs text-muted-foreground -mt-0.5">Management System</div>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/track" search={{} as never}>Track</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/login" search={{} as never}>Admin login</Link></Button>
          </nav>
        </div>
      </header>

      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${sanroquehall})`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 text-center text-white">
          <span className="inline-block text-xs font-medium tracking-wider uppercase text-white/90 px-3 py-1 rounded-full bg-slate-900/40">
            Serving the Community Online
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-display font-semibold tracking-tight max-w-3xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            Request, file, and track barangay services in minutes.
          </h1>
          <p className="mt-6 text-lg text-slate-100/90 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            Submit certificate requests, file blotter complaints, and follow your case using a simple token number.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="default" className="bg-white text-slate-950 hover:bg-slate-100"><Link to="/request-certificate">Request a Certificate</Link></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/file-blotter">File a Blotter</Link></Button>
            <Button asChild size="lg" variant="secondary" className="bg-slate-950 text-white hover:bg-slate-800"><Link to="/track" search={{} as never}>Track with Token</Link></Button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: FileText, title: "Certificate Requests", desc: "Barangay clearance, indigency, residency and more — submitted online with a tracking token (CERT-0001).", to: "/request-certificate", cta: "Request now" },
            { icon: ShieldAlert, title: "Blotter / Complaint", desc: "File complaints safely. Each case gets a private token (BLT-0001) so updates stay confidential.", to: "/file-blotter", cta: "File a complaint" },
            { icon: Search, title: "Token Tracking", desc: "Enter your token to see the current status — Pending, Approved, Ready to Pick Up, and more.", to: "/track", cta: "Track request" },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-card)] flex flex-col">
              <div className="h-11 w-11 rounded-lg bg-accent grid place-items-center text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-display font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{f.desc}</p>
              <Button asChild variant="ghost" className="mt-5 px-0 text-primary"><Link to={f.to}>{f.cta} →</Link></Button>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-xl font-semibold">Meet the Team</div>
            <TeamToggle />
          </div>

          <TeamDetails />
          <div className="text-center">© {new Date().getFullYear()} Barangay Management System</div>
        </div>
      </footer>
    </div>
  );
}

function TeamToggle() {
  // This component uses a shared state via closure in the file-level HomePage.
  // To keep things simple and local, we'll return a placeholder; the real toggle is below.
  return null;
}

function TeamDetails() {
  // Local state for demo toggle
  const [visible, setVisible] = useState(false);

  const team = [
    { name: "ELMO PLAZA", img: plaza, role: "Lead and System Developer", contribution: "System development & maintenance" },
    { name: "JAN DHANIEL EDRADAN", img: edradan, role: "UI/UX Designer", contribution: "Designing the interface and user experience" },
    { name: "REJEAN AMATOS", img: amatos, role: "Quality Assurance Director", contribution: "Testing, bug verification, and quality control" },
    { name: "LOREMIE CABALAN", img: cabalan, role: "Documentation Specialist", contribution: "Writing guides, workflows, and system documentation" },
    { name: "APRIL PASCULADO", img: pasculado, role: "Technical Support Director", contribution: "Providing support and troubleshooting assistance" },
  ];

  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center">
        <Button variant="outline" onClick={() => setVisible((v) => !v)} size="sm">
          {visible ? "Hide Team" : "Show Team"}
        </Button>
      </div>

      {visible && (
        <div className="max-w-4xl mx-auto mt-6 space-y-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-6 rounded-2xl p-4 bg-gradient-to-r from-white/5 to-white/2 backdrop-blur-md shadow-lg hover:scale-105 transform transition duration-300"
            >
              <div className="flex-shrink-0 rounded-full overflow-hidden ring-4 ring-white/10">
                <Avatar className="h-28 w-28">
                  {member.img ? (
                    <AvatarImage src={member.img} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback className="text-3xl">{member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}</AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="text-left flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold drop-shadow-sm">{member.name}</div>
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-accent text-accent-foreground">{member.role}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{member.contribution}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
