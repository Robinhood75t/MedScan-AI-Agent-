import { useState, useEffect ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Printer, ScanLine, CheckCircle2, AlertTriangle, Heart } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import html2pdf from "html2pdf.js";

// ✅ matches backend response shape exactly
interface Finding {
  label: string;
  value: string;
  status: "normal" | "warning";
  note: string;
}

interface SummaryResult {
  overview: string;
  findings: Finding[];
  recommendations: string[];
}

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SummaryResult | null>(null); // ✅ real data
  const [error, setError, ] = useState<string | null>(null);
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ✅ progress bar animation
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return 90; } // stop at 90 until data loads
        return p + 4;
      });
    }, 80);

    // ✅ fetch real data from backend
    const fetchSummary = async () => {
      try {
        const stored = sessionStorage.getItem("summaryResult"); // get result passed from scan page
        if (stored) {
          setResult(JSON.parse(stored));
        } else {
          setError("No report data found. Please scan a document first.");
        }
      } catch (err) {
        setError("Failed to load report. Please try again.");
      } finally {
        setProgress(100);
        setTimeout(() => setLoading(false), 400);
        clearInterval(interval);
      }
    };

    fetchSummary();
    return () => clearInterval(interval);
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

      // function to download the results page as a PDF
    const downloadPDF = async () => {

        const element = reportRef.current;

        if (!element) {
            toast.error("Unable to generate PDF.");
            return;
        }

        toast.loading("Generating PDF...", {
            id: "pdf"
        });

        try {

            await html2pdf()
                .set({
                    margin: 10,
                    filename: "MedScan_Report.pdf",

                    image: {
                        type: "jpeg",
                        quality: 1
                    },

                    html2canvas: {
                        scale: 3
                    },

                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait"
                    },
                  })
                  .from(element)
                  .save();

            toast.success("PDF downloaded.", {
                id: "pdf"
            });

        } catch {

            toast.error("Failed to generate PDF.", {
                id: "pdf"
            });

        }

    };

  // ✅ error state
  if (error || !result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 flex flex-col items-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate("/scan")} className="rounded-xl gap-2">
            <ScanLine className="w-4 h-4" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-16" id = "results-page" ref={reportRef}>
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
            <p className="text-muted-foreground leading-relaxed">{result.overview}</p>
          </div>

          {/* Key Findings */}
          <div className="bg-card rounded-2xl p-6 md:p-8 mb-6" style={{ boxShadow: "var(--card-shadow)" }}>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Key Findings</h2>
            <div className="space-y-3">
              {result.findings.map((f) => (
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
              {result.recommendations.map((r, i) => (
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
          {/* <div className="flex flex-wrap gap-3 justify-center">


            <Button variant="outline" className="rounded-xl gap-2" onClick={downloadPDF}>
              <Download className="w-4 h-4" /> Download PDF 
            </Button>


            <Button variant="outline" className="rounded-xl gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print Report
            </Button>
            <Button className="rounded-xl gap-2" onClick={() => navigate("/scan")}>
              <ScanLine className="w-4 h-4" /> Scan Another
            </Button>
          </div> */}
        </div>
      </div>
      {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">


            <Button variant="outline" className="rounded-xl gap-2" onClick={downloadPDF}>
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
  );
};

export default Results;