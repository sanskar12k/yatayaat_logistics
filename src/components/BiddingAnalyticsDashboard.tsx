import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Award, Target, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BiddingStats {
  totalBids: number;
  acceptedBids: number;
  rejectedBids: number;
  pendingBids: number;
  totalRevenue: number;
  acceptanceRate: number;
  averageBidAmount: number;
  thisMonthBids: number;
  lastMonthBids: number;
}

export function BiddingAnalyticsDashboard() {
  const [stats, setStats] = useState<BiddingStats>({
    totalBids: 0,
    acceptedBids: 0,
    rejectedBids: 0,
    pendingBids: 0,
    totalRevenue: 0,
    acceptanceRate: 0,
    averageBidAmount: 0,
    thisMonthBids: 0,
    lastMonthBids: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sb = supabase as any;
      
      // Fetch all bids for the user
      const { data: bids, error } = await sb
        .from("part_load_bids")
        .select("*")
        .eq("transporter_id", user.id);

      if (error) throw error;

      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const totalBids = bids?.length || 0;
      const acceptedBids = bids?.filter(b => b.status === "accepted").length || 0;
      const rejectedBids = bids?.filter(b => b.status === "rejected").length || 0;
      const pendingBids = bids?.filter(b => b.status === "pending").length || 0;
      
      const totalRevenue = bids
        ?.filter(b => b.status === "accepted")
        .reduce((sum, b) => sum + (b.quoted_rate || 0), 0) || 0;

      const acceptanceRate = totalBids > 0 ? (acceptedBids / totalBids) * 100 : 0;
      const averageBidAmount = totalBids > 0 
        ? bids.reduce((sum, b) => sum + (b.quoted_rate || 0), 0) / totalBids 
        : 0;

      const thisMonthBids = bids?.filter(b => 
        new Date(b.created_at) >= firstDayThisMonth
      ).length || 0;

      const lastMonthBids = bids?.filter(b => {
        const bidDate = new Date(b.created_at);
        return bidDate >= firstDayLastMonth && bidDate <= lastDayLastMonth;
      }).length || 0;

      setStats({
        totalBids,
        acceptedBids,
        rejectedBids,
        pendingBids,
        totalRevenue,
        acceptanceRate,
        averageBidAmount,
        thisMonthBids,
        lastMonthBids,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const growthRate = stats.lastMonthBids > 0 
    ? ((stats.thisMonthBids - stats.lastMonthBids) / stats.lastMonthBids) * 100 
    : 0;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Bidding Analytics</h2>
        <p className="text-muted-foreground">Track your bidding performance and revenue</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Bids
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBids}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.pendingBids} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Acceptance Rate
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.acceptanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.acceptedBids} accepted of {stats.totalBids}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Revenue
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-2">
              From {stats.acceptedBids} accepted bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Monthly Growth
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{stats.thisMonthBids}</div>
              {growthRate !== 0 && (
                <Badge variant={growthRate > 0 ? "default" : "secondary"} className="gap-1">
                  {growthRate > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(growthRate).toFixed(0)}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              vs {stats.lastMonthBids} last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bid Status Breakdown</CardTitle>
            <CardDescription>Current status of all your bids</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Accepted</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(stats.acceptedBids / stats.totalBids) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{stats.acceptedBids}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500" 
                    style={{ width: `${(stats.pendingBids / stats.totalBids) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{stats.pendingBids}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Rejected</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500" 
                    style={{ width: `${(stats.rejectedBids / stats.totalBids) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{stats.rejectedBids}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Bid Amount</CardTitle>
            <CardDescription>Mean value of your quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              ₹{stats.averageBidAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {stats.totalBids} total bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Score</CardTitle>
            <CardDescription>Your bidding effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Win Rate</span>
                <Badge variant={stats.acceptanceRate > 40 ? "default" : "secondary"}>
                  {stats.acceptanceRate > 40 ? "Excellent" : "Good"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Activity</span>
                <Badge variant={stats.thisMonthBids > 5 ? "default" : "secondary"}>
                  {stats.thisMonthBids > 5 ? "High" : "Moderate"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Growth</span>
                <Badge variant={growthRate > 0 ? "default" : "secondary"}>
                  {growthRate > 0 ? "Rising" : "Stable"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}