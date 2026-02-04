import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Code2, Cpu, FileText, Globe, Shield, Zap } from "lucide-react";
import type React from "react";

const features = [
  {
    title: "Universal Input",
    description:
      "Process documents from direct file uploads or URLs. Support for PDF, DOCX, and more.",
    icon: FileText,
  },
  {
    title: "Global Infrastructure",
    description:
      "Multi-region deployment on AWS (Global) and Aliyun (China) ensures low latency worldwide.",
    icon: Globe,
  },
  {
    title: "Intelligent Parsing",
    description:
      "Advanced OCR and layout analysis to extract structured data from complex documents.",
    icon: Brain,
  },
  {
    title: "Developer First",
    description: "Simple REST API, webhooks, and async processing designed for easy integration.",
    icon: Code2,
  },
  {
    title: "Enterprise Secure",
    description: "Bank-grade security with API key authentication and encrypted data transmission.",
    icon: Shield,
  },
  {
    title: "High Performance",
    description: "Optimized for speed with 60 RPM rate limits and scalable processing queues.",
    icon: Zap,
  },
];

function Brain(props: React.ComponentProps<typeof Cpu>) {
  return <Cpu {...props} />; // Using Cpu as Brain proxy if needed, or just import Brain from lucide-react if available.
}

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Everything you need to build document AI
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            A complete toolkit for transforming unstructured documents into machine-readable data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-background border-muted hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
