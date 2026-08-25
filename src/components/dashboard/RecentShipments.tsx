import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package2, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Shipment {
  id: string;
  tracking_number: string;
  origin_address: string;
  destination_address: string;
  status: string;
  created_at: string;
}

export function RecentShipments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const fetchShipments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("shipments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) setShipments(data);
    };

    fetchShipments();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "secondary",
      picked_up: "default",
      in_transit: "default",
      out_for_delivery: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    return colors[status] || "secondary";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Shipments</CardTitle>
      </CardHeader>
      <CardContent>
        {shipments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No shipments yet</p>
        ) : (
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Package2 className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{shipment.tracking_number}</p>
                    <Badge variant={getStatusColor(shipment.status) as any}>
                      {shipment.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{shipment.origin_address} → {shipment.destination_address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(shipment.created_at), "MMM dd, yyyy")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
