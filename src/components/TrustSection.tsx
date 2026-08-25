import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Award, 
  Users, 
  TrendingUp,
  CheckCircle2,
  Heart,
  Star
} from "lucide-react";

const trustMetrics = [
  {
    icon: Shield,
    value: "99.8%",
    label: "Safe Delivery Rate",
    description: "Industry-leading safety record with comprehensive insurance coverage"
  },
  {
    icon: Users,
    value: "2,500+",
    label: "Happy Clients",
    description: "Trusted by businesses and individuals across India"
  },
  {
    icon: Award,
    value: "15+",
    label: "Years Experience",
    description: "Decade and a half of logistics excellence"
  },
  {
    icon: TrendingUp,
    value: "50K+",
    label: "Successful Deliveries",
    description: "Proven track record of reliable transportation"
  }
];

const trustPillars = [
  {
    title: "Professional Packing",
    description: "Industry-standard packing materials and techniques ensure your goods are protected throughout transit",
    icon: CheckCircle2
  },
  {
    title: "Real-time Tracking",
    description: "GPS-enabled tracking lets you monitor your shipment 24/7 from pickup to delivery",
    icon: CheckCircle2
  },
  {
    title: "Insurance Coverage",
    description: "Comprehensive transit insurance on eligible shipments for complete peace of mind",
    icon: CheckCircle2
  },
  {
    title: "Verified Transporters",
    description: "All our partners are thoroughly vetted and regularly audited for quality assurance",
    icon: CheckCircle2
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer support and AI assistant for instant query resolution",
    icon: CheckCircle2
  },
  {
    title: "On-time Delivery",
    description: "Strict adherence to delivery schedules with proactive communication on any delays",
    icon: CheckCircle2
  }
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "TechCorp Solutions",
    text: "We've been using Yatayaat for our pan-India shipments for 3 years. Their reliability and professionalism are unmatched. The AI support is a game-changer!",
    rating: 5
  },
  {
    name: "Priya Sharma",
    company: "Homeowner, Bangalore",
    text: "Moved from Kolkata to Bangalore with Yatayaat. Everything arrived safely and on time. The packing was professional, and the team was very helpful throughout.",
    rating: 5
  },
  {
    name: "Amit Patel",
    company: "Global Exports Ltd",
    text: "Their FTL service from Kolkata to Mumbai is exceptional. Competitive rates, reliable delivery, and excellent customer service. Highly recommended!",
    rating: 5
  }
];

export const TrustSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Trust Metrics */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-primary">Samaan Appka,</span> Zimmedaari Hamari
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Your goods are our responsibility. We take this commitment seriously with proven reliability and trust.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {trustMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2">{metric.value}</div>
                    <div className="text-lg font-semibold text-foreground mb-2">{metric.label}</div>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button variant="accent" size="lg" className="shadow-glow">
            <Heart className="w-5 h-5 mr-2" />
            Discover Our Trust Stories
          </Button>
        </div>

        {/* Trust Pillars */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Customers <span className="text-primary">Trust Us</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={index}
                  className="flex gap-4 p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{pillar.title}</h4>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            What Our <span className="text-primary">Customers Say</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
