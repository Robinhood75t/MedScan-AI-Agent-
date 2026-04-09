import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto rounded-3xl p-10 md:p-16 text-center bg-card" style={{ boxShadow: "var(--card-shadow)" }}>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            Start Understanding Your Health Today
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Get 1 free scan. No credit card required.
          </p>
          <Button size="lg" className="mt-8 rounded-2xl text-base px-10 gap-2 shadow-lg shadow-primary/20" onClick={() => navigate("/signup")}>
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
