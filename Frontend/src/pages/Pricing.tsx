import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const plans = [
  {
    name: "Monthly",
    price: "₹199",
    period: "/month",
    features: ["Unlimited scans", "English & Hindi", "Faster processing", "Scan history"],
    highlight: false,
  },
  {
    name: "6 Months",
    price: "₹899",
    period: "/6 months",
    save: "Save 25%",
    features: ["Unlimited scans", "English & Hindi", "Priority processing", "Scan history", "Email support"],
    highlight: true,
  },
  {
    name: "Yearly",
    price: "₹1,499",
    period: "/year",
    save: "Save 37%",
    features: ["Unlimited scans", "English & Hindi", "Fastest processing", "Scan history", "Priority support", "Family sharing"],
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Upgrade Your Plan
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            You've used your free scan. Upgrade to continue getting AI-powered health insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`hover-lift bg-card rounded-2xl p-8 flex flex-col relative ${
                plan.highlight ? "border-2 border-primary ring-4 ring-primary/10" : ""
              }`}
              style={{ boxShadow: plan.highlight ? "var(--card-shadow-hover)" : "var(--card-shadow)" }}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Best Value
                </div>
              )}
              <h3 className="font-heading font-semibold text-lg text-foreground">{plan.name}</h3>
              <div className="mt-3 mb-1">
                <span className="font-heading font-extrabold text-4xl text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              {plan.save && <span className="text-xs font-medium text-primary mb-4">{plan.save}</span>}
              {!plan.save && <div className="mb-4" />}

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-xl ${plan.highlight ? "" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
                onClick={() => toast.info("Payment integration coming soon!")}
              >
                Upgrade Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
