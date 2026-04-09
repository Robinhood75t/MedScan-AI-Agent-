import { Button } from "@/components/ui/button";
import { ArrowRight, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTA = () => {
    navigate(user ? "/scan" : "/login");
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />

      <div className="container relative mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="opacity-0 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              AI-Powered Medical Report Analysis
            </span>
          </div>

          <h1 className="opacity-0 animate-[fade-up_0.6s_ease-out_0.15s_forwards] font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-foreground">
            Understand Your Medical Reports in{" "}
            <span className="text-gradient">Simple Language</span>
          </h1>

          <p className="opacity-0 animate-[fade-up_0.6s_ease-out_0.3s_forwards] mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Upload any medical report and get clear, AI-powered summaries in English & Hindi — instantly.
          </p>

          <div className="opacity-0 animate-[fade-up_0.6s_ease-out_0.45s_forwards] mt-10">
            <Button size="lg" className="rounded-2xl text-base px-8 gap-2 shadow-lg shadow-primary/20" onClick={handleCTA}>
              Start Scanning Free <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
