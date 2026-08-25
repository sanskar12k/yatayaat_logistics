import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, DollarSign, Clock } from "lucide-react";

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalShipments: 0,
    activeShipments: 0,
    totalRevenue: 0,
    pendingQuotes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [shipments, activeShipments, payments, quotes] = await Promise.all([
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("user_id", user.id).in("status", ["pending", "picked_up", "in_transit"]),
        supabase.from("payments").select("amount").eq("user_id", user.id).eq("status", "completed"),
        supabase.from("quotes").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending"),
      ]);

      const revenue = payments.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        totalShipments: shipments.count || 0,
        activeShipments: activeShipments.count || 0,
        totalRevenue: revenue,
        pendingQuotes: quotes.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalShipments}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeShipments}</div>
          <p className="text-xs text-muted-foreground">In transit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
          <p className="text-xs text-muted-foreground">Awaiting response</p>
        </CardContent>
      </Card>
    </div>
  );
}
