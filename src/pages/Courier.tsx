import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, IndianRupee, Clock, Shield, Truck, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Courier() {
  const [pincode, setPincode] = useState("");
  const [weight, setWeight] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const calculateCost = () => {
    if (!pincode || !weight) {
      toast.error("Please enter both pincode and weight");
      return;
    }

    // Basic cost calculation (can be enhanced with actual rate card)
    const baseRate = 50;
    const perKgRate = 30;
    const weightNum = parseFloat(weight);
    const cost = baseRate + (weightNum * perKgRate);
    
    setEstimatedCost(cost);
    toast.success("Rate calculated successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Fastest Delivery Network</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Courier & E-commerce
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              All India Coverage
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional courier services covering all pin codes in India. Perfect for e-commerce shipments, contractual partnerships, and one-time deliveries.
          </p>
        </div>

        {/* Rate Calculator */}
        <Card className="max-w-2xl mx-auto mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-6 w-6 text-primary" />
              Instant Rate Calculator
            </CardTitle>
            <CardDescription>Get estimated shipping costs for any Indian pin code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Destination Pin Code</label>
                <Input
                  placeholder="e.g., 110001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Weight (kg)</label>
                <Input
                  type="number"
                  placeholder="e.g., 2.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  step="0.1"
                  min="0"
                />
              </div>
            </div>
            
            <Button onClick={calculateCost} className="w-full" size="lg">
              Calculate Shipping Cost
            </Button>

            {estimatedCost !== null && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                <p className="text-3xl font-bold text-primary">₹{estimatedCost.toFixed(2)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">All India Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                28,000+ pin codes covered across India with reliable delivery network
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Express Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                24-72 hours delivery to major cities, 3-5 days for remote locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Secure Handling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Insurance coverage available, real-time tracking, and proof of delivery
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">COD Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cash on delivery option with quick remittance to your account
              </p>
            </CardContent>
          </Card>
        </div>

        {/* E-commerce Solutions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">E-commerce Partnership Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary/50">
              <CardHeader>
                <Badge className="w-fit mb-4">Contractual Partnership</Badge>
                <CardTitle className="text-2xl">Long-term E-commerce Contract</CardTitle>
                <CardDescription>
                  Dedicated support for your e-commerce business with volume-based pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Discounted rates for bulk shipments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">API integration for automated shipping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Priority customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Monthly invoicing and settlements</span>
                  </li>
                </ul>
                <Button className="w-full" size="lg">Request Partnership</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-4">One-time Shipping</Badge>
                <CardTitle className="text-2xl">Pay-per-shipment Model</CardTitle>
                <CardDescription>
                  Flexible shipping solution for occasional or one-time deliveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">No minimum commitment required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Transparent pricing per shipment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Online booking and payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Real-time tracking included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Same service quality guaranteed</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" size="lg">Book Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Standards */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Courier Standards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Metro Cities</h3>
                <p className="text-sm text-muted-foreground">24-48 hours delivery</p>
              </div>
              <div>
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Tier 2/3 Cities</h3>
                <p className="text-sm text-muted-foreground">48-72 hours delivery</p>
              </div>
              <div>
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Remote Areas</h3>
                <p className="text-sm text-muted-foreground">3-5 days delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
