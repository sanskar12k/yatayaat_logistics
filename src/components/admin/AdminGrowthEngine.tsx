import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TrendingUp, Users, DollarSign, Package, RefreshCw } from "lucide-react";

interface GrowthMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  period: string | null;
  recorded_at: string;
}

export function AdminGrowthEngine() {
  const [metrics, setMetrics] = useState<GrowthMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('growth_metrics')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch growth metrics');
      console.error(error);
    } else {
      setMetrics(data || []);
    }
    setLoading(false);
  };

  const recordMetrics = async () => {
    const newMetrics = [
      {
        metric_name: 'Total Users',
        metric_value: Math.floor(Math.random() * 10000) + 1000,
        metric_type: 'users',
        period: 'monthly'
      },
      {
        metric_name: 'Revenue',
        metric_value: Math.floor(Math.random() * 1000000) + 100000,
        metric_type: 'revenue',
        period: 'monthly'
      },
      {
        metric_name: 'Active Shipments',
        metric_value: Math.floor(Math.random() * 500) + 50,
        metric_type: 'shipments',
        period: 'daily'
      },
      {
        metric_name: 'Customer Acquisition Cost',
        metric_value: Math.floor(Math.random() * 5000) + 500,
        metric_type: 'cac',
        period: 'monthly'
      },
      {
        metric_name: 'Lifetime Value',
        metric_value: Math.floor(Math.random() * 50000) + 10000,
        metric_type: 'ltv',
        period: 'monthly'
      }
    ];

    const { error } = await supabase.from('growth_metrics').insert(newMetrics);
    
    if (error) {
      toast.error('Failed to record metrics');
    } else {
      toast.success('Growth metrics recorded');
      fetchMetrics();
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'users':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'revenue':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'shipments':
        return <Package className="h-5 w-5 text-purple-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-orange-500" />;
    }
  };

  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.metric_name]) {
      acc[metric.metric_name] = [];
    }
    acc[metric.metric_name].push(metric);
    return acc;
  }, {} as Record<string, GrowthMetric[]>);

  const calculateGrowth = (metricHistory: GrowthMetric[]) => {
    if (metricHistory.length < 2) return null;
    const latest = metricHistory[0].metric_value;
    const previous = metricHistory[1].metric_value;
    const growth = ((latest - previous) / previous) * 100;
    return growth.toFixed(1);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Growth Engine</h2>
          <p className="text-muted-foreground">Track key business growth metrics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchMetrics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={recordMetrics}>Record Metrics</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedMetrics).map(([metricName, metricHistory]) => {
          const latestMetric = metricHistory[0];
          const growth = calculateGrowth(metricHistory);
          
          return (
            <Card key={metricName} className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  {getMetricIcon(latestMetric.metric_type)}
                  {growth && (
                    <span className={`text-sm font-medium ${parseFloat(growth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">{metricName}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {latestMetric.metric_type === 'revenue' || latestMetric.metric_type === 'cac' || latestMetric.metric_type === 'ltv'
                      ? `₹${latestMetric.metric_value.toLocaleString()}`
                      : latestMetric.metric_value.toLocaleString()}
                  </p>
                </div>

                {latestMetric.period && (
                  <p className="text-xs text-muted-foreground capitalize">
                    Period: {latestMetric.period}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(latestMetric.recorded_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No growth metrics recorded yet. Click "Record Metrics" to start tracking.</p>
        </div>
      )}
    </div>
  );
}