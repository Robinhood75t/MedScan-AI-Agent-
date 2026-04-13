import { Upload, Brain, FileCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Report",
    description: "Simply upload your medical report — PDF, image, or scan. It takes just seconds.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our AI reads and understands complex medical terminology, lab values, and findings.",
  },
  {
    icon: FileCheck,
    title: "Get Results",
    description: "Receive a clear, easy-to-understand summary in English or Hindi within moments.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
            Three simple steps to understand your health better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="hover-lift group bg-card rounded-2xl p-8 text-center"
              style={{ boxShadow: "var(--card-shadow)", animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <step.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
