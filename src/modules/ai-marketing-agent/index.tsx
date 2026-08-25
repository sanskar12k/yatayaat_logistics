import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiMarketingDashboard } from "./AiMarketingDashboard";
import { Sparkles } from "lucide-react";

export default function AiMarketingModule() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-primary" />
            AI Marketing Agent
          </h1>
          <p className="text-lg text-muted-foreground">
            Automated content generation for YouTube, Instagram, Email, WhatsApp & more
          </p>
        </div>

        <AiMarketingDashboard />
      </main>

      <Footer />
    </div>
  );
}

export { AiMarketingDashboard } from "./AiMarketingDashboard";