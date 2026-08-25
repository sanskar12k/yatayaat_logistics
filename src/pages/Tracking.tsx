import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package, MapPin, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrackingResult {
  docket_number: string;
  status: string;
  customer_name: string;
  origin: string;
  destination: string;
  created_at: string;
  updated_at: string;
}

export default function Tracking() {
  const [docketNumber, setDocketNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const { toast } = useToast();

  const handleTrack = async () => {
    if (!docketNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a docket number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("dockets")
      .select("*")
      .eq("docket_number", docketNumber.trim())
      .single();

    if (error || !data) {
      toast({
        title: "Not Found",
        description: "No shipment found with this docket number",
        variant: "destructive",
      });
      setResult(null);
    } else {
      setResult(data as TrackingResult);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      in_transit: "bg-blue-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Track Your Shipment</h1>
            <p className="text-muted-foreground">
              Enter your docket number to track your shipment in real-time
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Docket Number (e.g., DKT2025001)"
                  value={docketNumber}
                  onChange={(e) => setDocketNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                />
                <Button onClick={handleTrack} disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Tracking..." : "Track"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Shipment Details</CardTitle>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Docket Number</p>
                    <p className="font-semibold">{result.docket_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="font-semibold">{result.status.replace("_", " ")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Package className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-semibold">{result.customer_name}</p>
                        <p className="text-sm">{result.origin}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Destination</p>
                        <p className="font-semibold">{result.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Booked on:</span>
                      <span>{new Date(result.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Last updated:</span>
                      <span>{new Date(result.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
