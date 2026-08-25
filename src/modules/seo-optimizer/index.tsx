import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeoOptimizer } from "./SeoOptimizer";
import { Search } from "lucide-react";

export default function SeoOptimizerModule() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Search className="h-10 w-10 text-primary" />
            SEO Optimizer
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered SEO analysis and optimization tools
          </p>
        </div>

        <SeoOptimizer />
      </main>

      <Footer />
    </div>
  );
}

export { SeoOptimizer } from "./SeoOptimizer";