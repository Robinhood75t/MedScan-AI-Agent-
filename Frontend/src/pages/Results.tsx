import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Printer, ScanLine, CheckCircle2, AlertTriangle, Heart } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const mockResult = {
  overview: "Your Complete Blood Count (CBC) report shows mostly normal values with a few areas that need attention. Overall, your health indicators are within acceptable ranges.",
  findings: [
    { label: "Hemoglobin", value: "13.2 g/dL", status: "normal" as const, note: "Within normal range (12–16 g/dL)" },
    { label: "White Blood Cells", value: "11,200 /μL", status: "warning" as const, note: "Slightly elevated (normal: 4,000–10,000)" },
    { label: "Platelets", value: "2,50,000 /μL", status: "normal" as const, note: "Normal range (1.5–4 lakh)" },
    { label: "Blood Sugar (Fasting)", value: "110 mg/dL", status: "warning" as const, note: "Borderline (normal: 70–100 mg/dL)" },
  ],
  recommendations: [
    "Follow up with your doctor regarding elevated WBC count.",
    "Monitor fasting blood sugar — consider dietary changes.",
    "Stay hydrated and maintain a balanced diet.",
    "Schedule a retest in 3 months.",
  ],
};

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 4;
      });
    }, 80);
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6 animate-pulse">
            <ScanLine className="w-8 h-8 text-accent-foreground" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Analyzing your report...</h2>
          <p className="text-muted-foreground mb-8">Our AI is reading your medical data</p>
          <div className="w-full max-w-sm">
            <Progress value={progress} className="h-2" />
          </div>
          <div className="w-full max-w-lg mt-12 space-y-4">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Report Analysis Complete</h1>
          </div>

          {/* Overview */}
          <div className="bg-card rounded-2xl p-6 md:p-8 mb-6" style={{ boxShadow: "var(--card-shadow)" }}>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" /> Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed">{mockResult.overview}</p>
          </div>

          {/* Key Findings */}
          <div className="bg-card rounded-2xl p-6 md:p-8 mb-6" style={{ boxShadow: "var(--card-shadow)" }}>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Key Findings</h2>
            <div className="space-y-3">
              {mockResult.findings.map((f) => (
                <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                  {f.status === "normal" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-foreground">{f.label}</span>
                      <span className="text-sm font-semibold text-foreground">{f.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{f.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-card rounded-2xl p-6 md:p-8 mb-8" style={{ boxShadow: "var(--card-shadow)" }}>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Recommendations</h2>
            <ul className="space-y-2">
              {mockResult.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" className="rounded-xl gap-2" onClick={() => toast("PDF download coming soon!")}>
              <Download className="w-4 h-4" /> Download PDF
            </Button>
            <Button variant="outline" className="rounded-xl gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print Report
            </Button>
            <Button className="rounded-xl gap-2" onClick={() => navigate("/scan")}>
              <ScanLine className="w-4 h-4" /> Scan Another
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
