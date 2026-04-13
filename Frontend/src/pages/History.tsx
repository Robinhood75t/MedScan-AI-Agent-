import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Clock, ArrowRight, ScanLine } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const History = () => {
  const { user, scanHistory } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">Scan History</h1>
          <p className="text-muted-foreground mb-10">Your previously scanned medical reports</p>

          {!user ? (
            <div className="bg-card rounded-2xl p-10 text-center" style={{ boxShadow: "var(--card-shadow)" }}>
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-heading font-semibold text-xl text-foreground mb-2">Login to view history</h2>
              <p className="text-muted-foreground mb-6">Sign in to access your scan history</p>
              <Button className="rounded-xl gap-2" onClick={() => navigate("/login")}>
                Login <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : scanHistory.length === 0 ? (
            <div className="bg-card rounded-2xl p-10 text-center" style={{ boxShadow: "var(--card-shadow)" }}>
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-heading font-semibold text-xl text-foreground mb-2">No scans yet</h2>
              <p className="text-muted-foreground mb-6">Start by scanning your first medical report</p>
              <Button className="rounded-xl gap-2" onClick={() => navigate("/scan")}>
                <ScanLine className="w-4 h-4" /> Scan Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {scanHistory.map((record) => (
                <div
                  key={record.id}
                  className="hover-lift bg-card rounded-2xl p-5 flex items-center gap-4 cursor-pointer"
                  style={{ boxShadow: "var(--card-shadow)" }}
                  onClick={() => navigate("/results")}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{record.fileName}</h3>
                    <p className="text-sm text-muted-foreground truncate">{record.overview}</p>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">{record.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
