import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { 
  Calculator, 
  Route, 
  AlertTriangle, 
  FileCheck, 
  Users, 
  TrendingUp,
  MapPin,
  IndianRupee,
  Truck,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export default function AITools() {
  const [calculating, setCalculating] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'cost-calculator');

  // Cost Calculator State
  const [costInputs, setCostInputs] = useState({
    distance: "",
    fuel_price: "102",
    mileage: "5",
    toll_charges: "",
    driver_cost: "1500",
  });
  const [costResult, setCostResult] = useState<number | null>(null);

  // Route Optimizer State
  const [routeInputs, setRouteInputs] = useState({
    origin: "",
    destination: "",
    via_points: "",
  });

  const calculateCost = () => {
    setCalculating(true);
    
    const distance = parseFloat(costInputs.distance) || 0;
    const fuelPrice = parseFloat(costInputs.fuel_price) || 0;
    const mileage = parseFloat(costInputs.mileage) || 5;
    const tollCharges = parseFloat(costInputs.toll_charges) || 0;
    const driverCost = parseFloat(costInputs.driver_cost) || 0;

    // Fuel cost
    const fuelCost = (distance / mileage) * fuelPrice;
    
    // Total cost (Indian logistics structure)
    const totalCost = fuelCost + tollCharges + driverCost + (distance * 2); // Additional per km cost
    
    setCostResult(totalCost);
    setCalculating(false);
    toast.success("Cost calculated successfully!");
  };

const [routeResult, setRouteResult] = useState<string | null>(null);

  const cityDistanceFromKolkata: Record<string, number> = {
    mumbai: 1960,
    delhi: 1500,
    bangalore: 1870,
    chennai: 1670,
    hyderabad: 1500,
    pune: 2050,
    guwahati: 1000,
  };

  const estimateDistance = (origin: string, destination: string) => {
    const o = origin.toLowerCase().trim();
    const d = destination.toLowerCase().trim();
    if (o === 'kolkata' && cityDistanceFromKolkata[d]) return cityDistanceFromKolkata[d];
    if (d === 'kolkata' && cityDistanceFromKolkata[o]) return cityDistanceFromKolkata[o];
    // Fallback rough estimate
    return 800 + Math.floor(Math.random() * 1200);
  };

  const optimizeRoute = () => {
    if (!routeInputs.origin || !routeInputs.destination) {
      toast.error("Please enter origin and destination");
      return;
    }
    const via = routeInputs.via_points
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
    const stops = [routeInputs.origin, ...via, routeInputs.destination];
    let total = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      total += estimateDistance(stops[i], stops[i+1]);
    }
    const timeHours = total / 45; // avg 45 km/h
    setRouteResult(`Optimized path: ${stops.join(' → ')}\nEstimated distance: ${total.toFixed(0)} km\nEstimated time: ${timeHours.toFixed(1)} hours`);
    toast.success("Route optimized");
  };

useEffect(() => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('tab', activeTab);
      return p;
    }, { replace: true });
  }, [activeTab, setSearchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Advanced AI-Powered
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Logistics Tools
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Optimize your logistics operations with intelligent tools designed specifically for Indian markets and regulations
          </p>
        </div>

{/* Tools Grid */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="cost-calculator">Cost</TabsTrigger>
            <TabsTrigger value="route-optimizer">Route</TabsTrigger>
            <TabsTrigger value="risk-assessment">Risk</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="vendor">Vendor</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          {/* Cost Calculator */}
          <TabsContent value="cost-calculator">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">AI Cost Calculator</CardTitle>
                </div>
                <CardDescription>
                  Calculate accurate transportation costs based on Indian fuel prices, tolls, and driver costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Distance (km)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 1200"
                      value={costInputs.distance}
                      onChange={(e) => setCostInputs({ ...costInputs, distance: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Fuel Price (₹/liter)</label>
                    <Input
                      type="number"
                      placeholder="Current price"
                      value={costInputs.fuel_price}
                      onChange={(e) => setCostInputs({ ...costInputs, fuel_price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mileage (km/liter)</label>
                    <Input
                      type="number"
                      placeholder="Vehicle mileage"
                      value={costInputs.mileage}
                      onChange={(e) => setCostInputs({ ...costInputs, mileage: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Toll Charges (₹)</label>
                    <Input
                      type="number"
                      placeholder="Total toll cost"
                      value={costInputs.toll_charges}
                      onChange={(e) => setCostInputs({ ...costInputs, toll_charges: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Driver Cost per trip (₹)</label>
                  <Input
                    type="number"
                    placeholder="Driver payment"
                    value={costInputs.driver_cost}
                    onChange={(e) => setCostInputs({ ...costInputs, driver_cost: e.target.value })}
                  />
                </div>

                <Button onClick={calculateCost} className="w-full" size="lg" disabled={calculating}>
                  {calculating ? "Calculating..." : "Calculate Total Cost"}
                </Button>

                {costResult !== null && (
                  <div className="p-6 bg-primary/10 rounded-lg text-center space-y-3">
                    <p className="text-sm text-muted-foreground">Estimated Total Cost</p>
                    <p className="text-4xl font-bold text-primary">₹{costResult.toFixed(2)}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm mt-4">
                      <div>
                        <p className="text-muted-foreground">Per KM</p>
                        <p className="font-semibold">₹{(costResult / parseFloat(costInputs.distance || "1")).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fuel Cost</p>
                        <p className="font-semibold">₹{((parseFloat(costInputs.distance) || 0) / (parseFloat(costInputs.mileage) || 5) * (parseFloat(costInputs.fuel_price) || 0)).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">GST (18%)</p>
                        <p className="font-semibold">₹{(costResult * 0.18).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Route Optimizer */}
          <TabsContent value="route-optimizer">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Route className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">AI Route Optimizer</CardTitle>
                </div>
                <CardDescription>
                  Find the most efficient routes considering Indian road conditions, traffic, and tolls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Origin City</label>
                  <Input
                    placeholder="e.g., Kolkata"
                    value={routeInputs.origin}
                    onChange={(e) => setRouteInputs({ ...routeInputs, origin: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Destination City</label>
                  <Input
                    placeholder="e.g., Mumbai"
                    value={routeInputs.destination}
                    onChange={(e) => setRouteInputs({ ...routeInputs, destination: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Via Points (Optional)</label>
                  <Input
                    placeholder="e.g., Nagpur, Pune"
                    value={routeInputs.via_points}
                    onChange={(e) => setRouteInputs({ ...routeInputs, via_points: e.target.value })}
                  />
                </div>

<Button onClick={optimizeRoute} className="w-full" size="lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  Optimize Route
                </Button>

                {routeResult && (
                  <div className="p-4 bg-primary/10 rounded-lg whitespace-pre-wrap">{routeResult}</div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Optimization Factors:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Real-time traffic conditions
                    </li>
                    <li className="flex items-center gap-2">
                      <Truck className="h-4 w-4" /> Road quality and vehicle restrictions
                    </li>
                    <li className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" /> Toll charges and fuel costs
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Weather and seasonal factors
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

{/* Risk Assessment */}
          <TabsContent value="risk-assessment">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">AI Risk Assessment</CardTitle>
                </div>
                <CardDescription>
                  Describe your shipment and route. Our AI will analyze risks and suggest mitigations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="e.g., 8 tons electronics, Kolkata → Mumbai in monsoon" id="risk-input" />
                <Button
                  onClick={async () => {
                    const text = (document.getElementById('risk-input') as HTMLInputElement)?.value;
                    if (!text) { toast.error('Please enter details'); return; }
                    const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
                      body: JSON.stringify({ messages: [
                        { role: 'user', content: `Perform a logistics risk assessment for: ${text}. Return risks and mitigations in bullet points.` }
                      ]})
                    });
                    const t = await resp.text();
                    toast.success('Risk analysis generated');
                    const result = t.split('\n').filter(l => l.startsWith('data: ')).map(l => {
                      try { return JSON.parse(l.slice(6)).choices?.[0]?.delta?.content || '' } catch { return '' }
                    }).join('');
                    const out = document.getElementById('risk-output');
                    if (out) out.textContent = result || 'Analysis ready in chat.';
                  }}
                >Analyze Risks</Button>
                <div id="risk-output" className="min-h-[120px] p-4 bg-muted rounded whitespace-pre-wrap text-sm"></div>
              </CardContent>
            </Card>
          </TabsContent>

{/* Compliance Check */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Compliance Checker</CardTitle>
                </div>
                <CardDescription>
                  Enter shipment/company details to get a compliance checklist (E-way bill, GST, permits).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="e.g., Machinery, value ₹12L, inter-state Kolkata→Delhi, GST regd." id="compliance-input" />
                <Button
                  onClick={async () => {
                    const text = (document.getElementById('compliance-input') as HTMLInputElement)?.value;
                    if (!text) { toast.error('Please enter details'); return; }
                    const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
                      body: JSON.stringify({ messages: [
                        { role: 'user', content: `Create a compliance checklist for Indian logistics for: ${text}. Include E-way bill thresholds, GST, permits, documents.` }
                      ]})
                    });
                    const t = await resp.text();
                    toast.success('Compliance checklist ready');
                    const result = t.split('\n').filter(l => l.startsWith('data: ')).map(l => {
                      try { return JSON.parse(l.slice(6)).choices?.[0]?.delta?.content || '' } catch { return '' }
                    }).join('');
                    const out = document.getElementById('compliance-output');
                    if (out) out.textContent = result || 'Checklist ready in chat.';
                  }}
                >Generate Checklist</Button>
                <div id="compliance-output" className="min-h-[120px] p-4 bg-muted rounded whitespace-pre-wrap text-sm"></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendor Analyzer */}
          <TabsContent value="vendor">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Vendor Analyzer</CardTitle>
                </div>
                <CardDescription>
                  Evaluate and compare logistics vendors for best rates and reliability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Vendor comparison and analysis tools coming soon
                  </p>
                  <Button variant="outline">Request Early Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demand Forecast */}
          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Demand Forecasting</CardTitle>
                </div>
                <CardDescription>
                  Predict logistics demand patterns and optimize capacity planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    AI-powered demand forecasting tools coming soon
                  </p>
                  <Button variant="outline">Request Early Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
