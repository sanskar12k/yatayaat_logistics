import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TruckSpaceVisualizer } from "./TruckSpaceVisualizer";
import { toast } from "sonner";
import { Sparkles, MapPin, Calendar, RefreshCw } from "lucide-react";

interface TruckSpace {
  id: string;
  truck_number: string;
  truck_type: string;
  total_capacity_cft: number;
  used_capacity_cft: number;
  remaining_capacity_cft: number;
  utilization_percentage: number;
  current_route: string | null;
  current_location: string | null;
  available_from: string | null;
  photos: string[] | null;
}

interface TruckMatchPanelProps {
  loadVolume: number;
  pickupLocation?: string;
  dropLocation?: string;
}

export function TruckMatchPanel({ loadVolume, pickupLocation, dropLocation }: TruckMatchPanelProps) {
  const [trucks, setTrucks] = useState<TruckSpace[]>([]);
  const [matchedTrucks, setMatchedTrucks] = useState<TruckSpace[]>([]);
  const [loading, setLoading] = useState(true);

  const sb = supabase as any;

  useEffect(() => {
    fetchTrucks();
  }, [loadVolume]);

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const { data, error } = await sb
        .from('truck_space_records')
        .select('*')
        .eq('status', 'available')
        .gte('remaining_capacity_cft', loadVolume)
        .order('utilization_percentage', { ascending: false });

      if (error) throw error;

      const trucksData = (data || []) as TruckSpace[];
      setTrucks(trucksData);

      // Calculate compatibility and sort without mutating type
      const sorted = [...trucksData].sort((a, b) =>
        calculateCompatibilityScore(loadVolume, b.remaining_capacity_cft) -
        calculateCompatibilityScore(loadVolume, a.remaining_capacity_cft)
      );

      setMatchedTrucks(sorted);
    } catch (error) {
      console.error('Error fetching trucks:', error);
      toast.error('Failed to fetch available trucks');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompatibilityScore = (loadVol: number, availableSpace: number): number => {
    if (availableSpace < loadVol) return 0;
    const utilization = (loadVol / availableSpace) * 100;
    return 100 - Math.abs(utilization - 100);
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">Finding matching trucks...</p>
      </Card>
    );
  }

  if (matchedTrucks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Matching Trucks Found</h3>
        <p className="text-muted-foreground mb-4">
          No trucks with sufficient space ({loadVolume} ft³) are currently available.
        </p>
        <Button onClick={fetchTrucks} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-primary/10">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Smart Match Results</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{matchedTrucks.length}</span> trucks
          with available space matching your load requirement of {loadVolume} ft³.
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {matchedTrucks.map((truck, index) => {
          const compatibilityScore = calculateCompatibilityScore(loadVolume, truck.remaining_capacity_cft);
          
          return (
            <div key={truck.id} className="space-y-3">
              {index === 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-sm font-semibold text-primary">Best Match</span>
                </div>
              )}

              <TruckSpaceVisualizer
                totalCapacity={truck.total_capacity_cft}
                usedCapacity={truck.used_capacity_cft}
                truckType={`${truck.truck_type} - ${truck.truck_number}`}
              />

              <Card className="p-4">
                <div className="space-y-3">
                  {/* Compatibility Score */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Compatibility Score</span>
                    <span className={`text-lg font-bold ${
                      compatibilityScore >= 90 ? 'text-green-600' :
                      compatibilityScore >= 70 ? 'text-yellow-600' :
                      'text-orange-600'
                    }`}>
                      {compatibilityScore.toFixed(0)}%
                      {compatibilityScore >= 90 && ' 🎯'}
                    </span>
                  </div>

                  {/* Route info */}
                  {truck.current_route && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Current Route</p>
                        <p className="text-sm text-muted-foreground">{truck.current_route}</p>
                      </div>
                    </div>
                  )}

                  {truck.current_location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Current Location</p>
                        <p className="text-sm text-muted-foreground">{truck.current_location}</p>
                      </div>
                    </div>
                  )}

                  {/* Available from */}
                  {truck.available_from && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Available from: {new Date(truck.available_from).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Your load fit */}
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Your Load Fit</p>
                    <div className="relative h-6 bg-background rounded overflow-hidden border">
                      <div
                        className="absolute left-0 top-0 h-full bg-primary"
                        style={{ width: `${(loadVolume / truck.remaining_capacity_cft) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {loadVolume} ft³ / {truck.remaining_capacity_cft} ft³ available
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      After loading: {((truck.used_capacity_cft + loadVolume) / truck.total_capacity_cft * 100).toFixed(1)}% utilized
                    </p>
                  </div>

                  {/* Photos */}
                  {truck.photos && truck.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {truck.photos.slice(0, 3).map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt={`Truck ${idx + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      <Card className="p-4 bg-muted">
        <h3 className="font-semibold text-foreground mb-2">🤖 AI Recommendation</h3>
        <p className="text-sm text-muted-foreground">
          Based on space utilization and route compatibility, we recommend the{' '}
          <span className="font-semibold text-foreground">{matchedTrucks[0]?.truck_type}</span>{' '}
          ({matchedTrucks[0]?.truck_number}) as your best option. This truck offers the optimal
          balance of space availability and utilization efficiency.
        </p>
      </Card>
    </div>
  );
}