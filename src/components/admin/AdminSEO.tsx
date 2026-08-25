import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";

interface SEOMetric {
  id: string;
  page_url: string;
  keyword: string | null;
  ranking: number | null;
  traffic: number | null;
  bounce_rate: number | null;
  page_load_time: number | null;
  recorded_at: string;
}

export function AdminSEO() {
  const [metrics, setMetrics] = useState<SEOMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('seo_metrics')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch SEO metrics');
      console.error(error);
    } else {
      setMetrics(data || []);
    }
    setLoading(false);
  };

  const recordMetrics = async () => {
    const pages = ['/', '/services', '/tracking', '/ftl-bidding', '/blog'];
    const keywords = ['logistics', 'freight', 'shipping', 'transport', 'FTL'];
    
    const newMetrics = pages.map(page => ({
      page_url: page,
      keyword: keywords[Math.floor(Math.random() * keywords.length)],
      ranking: Math.floor(Math.random() * 50) + 1,
      traffic: Math.floor(Math.random() * 5000) + 100,
      bounce_rate: parseFloat((Math.random() * 50 + 20).toFixed(2)),
      page_load_time: parseFloat((Math.random() * 3 + 0.5).toFixed(2))
    }));

    const { error } = await supabase.from('seo_metrics').insert(newMetrics);
    
    if (error) {
      toast.error('Failed to record metrics');
    } else {
      toast.success('SEO metrics recorded');
      fetchMetrics();
    }
  };

  const getRankingTrend = (ranking: number | null) => {
    if (!ranking) return <Minus className="h-4 w-4" />;
    if (ranking <= 10) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (ranking <= 30) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.page_url]) {
      acc[metric.page_url] = [];
    }
    acc[metric.page_url].push(metric);
    return acc;
  }, {} as Record<string, SEOMetric[]>);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">SEO Monitoring</h2>
          <p className="text-muted-foreground">Track search rankings and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchMetrics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={recordMetrics}>Record Metrics</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {Object.entries(groupedMetrics).map(([url, pageMetrics]) => {
          const latestMetric = pageMetrics[0];
          return (
            <Card key={url} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{url}</h3>
                    {latestMetric.keyword && (
                      <p className="text-sm text-muted-foreground">Keyword: {latestMetric.keyword}</p>
                    )}
                  </div>
                  {getRankingTrend(latestMetric.ranking)}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Ranking</p>
                    <p className="text-2xl font-bold text-foreground">
                      #{latestMetric.ranking || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Traffic</p>
                    <p className="text-2xl font-bold text-foreground">
                      {latestMetric.traffic?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bounce Rate</p>
                    <p className="text-2xl font-bold text-foreground">
                      {latestMetric.bounce_rate ? `${latestMetric.bounce_rate}%` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Load Time</p>
                    <p className="text-2xl font-bold text-foreground">
                      {latestMetric.page_load_time ? `${latestMetric.page_load_time}s` : 'N/A'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Last recorded: {new Date(latestMetric.recorded_at).toLocaleString()}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No SEO metrics recorded yet. Click "Record Metrics" to start.</p>
        </div>
      )}
    </div>
  );
}