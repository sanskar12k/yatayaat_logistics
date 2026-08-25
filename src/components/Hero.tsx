import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-logistics.jpg";
import { useState } from "react";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";

export function Hero() {
    const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  return (
    <section className="relative min-h-[600px] flex items-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl text-white">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-8 w-8" />
            <span className="text-lg font-semibold">Yatayaat Logistics</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Reliable logistics support for India
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            From household moves and parcel delivery to full truckload and contract transport, we help businesses and families move goods safely, on time, and with clear communication.
          </p>
          <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group" onClick={() => setQuoteFormOpen(true)}>
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            <Link to="/#services">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur text-white border-white/30 hover:bg-white/20">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <QuoteRequestForm open={quoteFormOpen} onOpenChange={setQuoteFormOpen} />
    </section>
  );
}
