import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingDown, 
  Warehouse, 
  AlertTriangle,
  Smartphone,
  Globe,
  Zap,
  MessageSquare,
  Calculator,
  Route,
  Shield,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const expertCapabilities = [
  {
    icon: TrendingDown,
    title: "Cost Reduction Strategies",
    description: "Route optimization, fuel management, warehouse efficiency"
  },
  {
    icon: Warehouse,
    title: "Warehouse Management",
    description: "Layout optimization, inventory systems, safety protocols"
  },
  {
    icon: AlertTriangle,
    title: "Supply Chain Disruptions",
    description: "Risk assessment, supplier diversification, emergency response"
  },
  {
    icon: Smartphone,
    title: "Technology Trends",
    description: "AI, IoT, Blockchain, Autonomous vehicles"
  },
  {
    icon: Globe,
    title: "International Shipping",
    description: "Documentation, customs, Incoterms, regulations"
  },
  {
    icon: Zap,
    title: "Speed Optimization",
    description: "Network optimization, process improvements, delivery benchmarks"
  }
];

const aiTools = [
  {
    icon: Calculator,
    title: "Smart Cost Calculator",
    description: "Multi-variable cost analysis with optimization recommendations"
  },
  {
    icon: Route,
    title: "Route Optimizer",
    description: "AI-powered path finding with traffic & weather integration"
  },
  {
    icon: Shield,
    title: "Risk Assessment Engine",
    description: "Comprehensive risk scoring and mitigation strategies"
  },
  {
    icon: CheckCircle2,
    title: "Compliance Checker",
    description: "Real-time regulatory updates and verification"
  }
];

export const AIExpert = () => {
  const navigate = useNavigate();
  const toSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return (
    <section className="py-24 bg-gradient-to-br from-primary-dark via-primary to-primary-light relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-secondary text-secondary-foreground px-6 py-2 text-base">
            <Brain className="w-5 h-5 mr-2" />
            AI-Powered Excellence
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet Your 24/7 <span className="text-secondary">Logistics AI Expert</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            The world's most advanced logistics AI consultant, available instantly to solve your supply chain challenges. 
            Get Harvard MBA-level expertise at your fingertips, completely free.
          </p>
        </div>

        {/* AI Chat Preview */}
        <Card className="max-w-4xl mx-auto mb-16 shadow-elegant border-white/20 bg-white/95 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">LogiMaster AI</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    Always Online
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                AI Expert
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Sample AI Interaction */}
              <div className="flex gap-3">
                <div className="flex-1 bg-muted rounded-2xl p-4">
                  <p className="text-sm text-foreground">
                    "How can I reduce my transportation costs by 20-30%?"
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-accent flex-shrink-0 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-primary/10 rounded-2xl p-4 border border-primary/20">
                  <p className="text-sm font-medium text-primary mb-2">💰 Cost Reduction Strategies:</p>
                  <ol className="text-sm text-foreground space-y-2 list-decimal list-inside">
                    <li><strong>Route Optimization</strong> (20-30% savings) - Use AI-powered route planning tools</li>
                    <li><strong>Fuel Management</strong> (15-25% savings) - Driver training & maintenance schedules</li>
                    <li><strong>Load Consolidation</strong> (25-35% savings) - Reduce empty miles through smart planning</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Case Study:</strong> DHL reduced costs by 18% using AI route optimization across Indian operations.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button variant="accent" size="lg" className="shadow-glow" onClick={() => navigate('/ai-assistant')}>
                Start Conversation with AI Expert
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
{expertCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Card 
                key={index}
                onClick={() => navigate(`/ai-knowledge/${toSlug(capability.title)}`)}
                className="cursor-pointer bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <Icon className="w-10 h-10 text-secondary mb-3" />
                  <CardTitle className="text-white text-lg">{capability.title}</CardTitle>
                  <CardDescription className="text-white/80">{capability.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* AI Tools */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Powerful AI Tools & Calculators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{aiTools.map((tool, index) => {
              const Icon = tool.icon;
              const tabMap: Record<string, string> = {
                "Smart Cost Calculator": "cost-calculator",
                "Route Optimizer": "route-optimizer",
                "Risk Assessment Engine": "risk-assessment",
                "Compliance Checker": "compliance",
              };
              const tab = tabMap[tool.title] || 'cost-calculator';
              return (
                <Card 
                  key={index}
                  onClick={() => navigate(`/ai-tools?tab=${tab}`)}
                  className="cursor-pointer bg-white/95 border-white/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-2"
                >
                  <CardHeader>
                    <Icon className="w-10 h-10 text-primary mb-3" />
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Value Proposition */}
        <Card className="bg-gradient-accent border-none text-white shadow-glow">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Why Our AI is Revolutionary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-5xl font-bold mb-2">24/7</div>
                <p className="text-white/90">Always available for instant expert consultation</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">FREE</div>
                <p className="text-white/90">Worth ₹50,000+ consulting fees, absolutely free</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">100%</div>
                <p className="text-white/90">Industry-specific expertise, unmatched accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
