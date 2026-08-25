import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadMatchingEngine } from "./LeadMatchingEngine";
import { Users } from "lucide-react";

export default function LeadEngineModule() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Users className="h-10 w-10 text-primary" />
            Lead Matching Engine
          </h1>
          <p className="text-lg text-muted-foreground">
            Auto-categorize, assign, and manage leads across all service types
          </p>
        </div>

        <LeadMatchingEngine />
      </main>

      <Footer />
    </div>
  );
}

export { LeadMatchingEngine } from "./LeadMatchingEngine";