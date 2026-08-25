import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Truck, 
  Plane, 
  Train, 
  Gavel, 
  FileText, 
  Handshake,
  PackageCheck
} from "lucide-react";
import { ServiceDetailsDialog } from "./ServiceDetailsDialog";
import { QuoteRequestForm } from "./QuoteRequestForm";

const services = [
  {
    icon: PackageCheck,
    title: "Small LTL - All Pin Codes",
    description: "Less Than Truckload service covering every pin code in India. Efficient, economical shipping for smaller consignments.",
    features: ["Door-to-door delivery", "Real-time tracking", "Insurance coverage", "Pan-India coverage"],
    color: "text-primary"
  },
  {
    icon: Package,
    title: "Packers & Movers",
    description: "Professional packing and moving services for household, office, and commercial relocations of all sizes.",
    features: ["Expert packing", "Safe handling", "Full insurance", "Bike & car transport"],
    color: "text-secondary"
  },
  {
    icon: Truck,
    title: "Full Truck Load (FTL)",
    description: "Dedicated truck services across India with strong lanes from Kolkata to major cities.",
    features: ["Kolkata-Mumbai", "Kolkata-Delhi", "Kolkata-Bangalore", "Kolkata-Guwahati"],
    color: "text-success",
    highlight: true
  },
  // {
  //   icon: Plane,
  //   title: "Air Freight Services",
  //   description: "Express air cargo from Kolkata to pan-India with guaranteed delivery timelines.",
  //   features: ["Tier-1: 24 hours", "Tier-2: 48 hours", "Tier-3: 72 hours", "Priority handling"],
  //   color: "text-primary"
  // },
  {
    icon: Train,
    title: "Railway Services",
    description: "Cost-effective railway transportation from Kolkata with station-to-station and door-to-door options.",
    features: ["Pan-India network", "Bulk shipments", "Economic rates", "Reliable delivery"],
    color: "text-secondary"
  },
  // {
  //   icon: Gavel,
  //   title: "Daily Part Load Bidding",
  //   description: "Competitive bidding platform for part load in bulk quantities. Get the best rates daily.",
  //   features: ["Live bidding", "Best rates", "Verified vendors", "Instant quotes"],
  //   color: "text-success"
  // },
  {
    icon: FileText,
    title: "Tenders & Projects",
    description: "Comprehensive logistics solutions for large-scale projects and government tenders.",
    features: ["Custom solutions", "Project management", "End-to-end service", "Compliance support"],
    color: "text-primary"
  }
  // {
  //   icon: Handshake,
  //   title: "Contractual Services",
  //   description: "Monthly and weekly contracts for all transportation needs with specialized solutions.",
  //   features: ["First Mile", "Last Mile", "Middle Mile", "Milk Run", "Custom contracts"],
  //   color: "text-secondary",
  //   highlight: true
  // }
];

export const Services = () => {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<string>("");

  const openServiceDetails = (service: typeof services[0]) => {
    setSelectedService(service);
    setDetailsOpen(true);
  };

  const openQuoteForm = (serviceName?: string) => {
    setDefaultService(serviceName || "");
    setQuoteFormOpen(true);
    setDetailsOpen(false);
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Comprehensive <span className="text-primary">Logistics Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From small parcels to full truckloads, we handle all your transportation needs with excellence
          </p>
        </div>

        {/* Services Grid */}
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className={`group w-full max-w-[330px] md:max-w-none md:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1.5rem)] hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 ${
                  service.highlight ? 'border-primary/50 bg-gradient-to-br from-card to-primary/5' : ''
                }`}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                    service.color === 'text-primary' ? 'from-primary/10 to-primary/20' :
                    service.color === 'text-secondary' ? 'from-secondary/10 to-secondary/20' :
                    'from-success/10 to-success/20'
                  } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
<Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    onClick={() => openServiceDetails(service)}
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-10"
            onClick={() => openQuoteForm()}
          >
            Request Custom Quote
          </Button>
        </div>
      </div>

      <ServiceDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        service={selectedService}
        onRequestQuote={() => selectedService && openQuoteForm(selectedService.title)}
      />

      <QuoteRequestForm
        open={quoteFormOpen}
        onOpenChange={setQuoteFormOpen}
        defaultService={defaultService}
      />
    </section>
  );
};
