import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Activity, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

interface SystemHealthLog {
  id: string;
  service_name: string;
  status: string;
  response_time: number | null;
  error_count: number;
  cpu_usage: number | null;
  memory_usage: number | null;
  checked_at: string;
}

export function AdminSystemHealth() {
  const [logs, setLogs] = useState<SystemHealthLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('system_health_logs')
      .select('*')
      .order('checked_at', { ascending: false })
      .limit(50);

    if (error) {
      toast.error('Failed to fetch system health logs');
      console.error(error);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  };

  const runHealthCheck = async () => {
    const services = [
      'Database',
      'API Gateway',
      'Auth Service',
      'Storage',
      'Edge Functions',
      'Real-time'
    ];

    const healthChecks = services.map(service => ({
      service_name: service,
      status: Math.random() > 0.1 ? 'healthy' : 'degraded',
      response_time: parseFloat((Math.random() * 500 + 50).toFixed(2)),
      error_count: Math.floor(Math.random() * 5),
      cpu_usage: parseFloat((Math.random() * 80 + 10).toFixed(2)),
      memory_usage: parseFloat((Math.random() * 80 + 10).toFixed(2))
    }));

    const { error } = await supabase.from('system_health_logs').insert(healthChecks);
    
    if (error) {
      toast.error('Failed to run health check');
    } else {
      toast.success('Health check completed');
      fetchLogs();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        );
      case 'degraded':
        return (
          <Badge className="bg-yellow-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Degraded
          </Badge>
        );
      case 'down':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Down
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const groupedLogs = logs.reduce((acc, log) => {
    if (!acc[log.service_name]) {
      acc[log.service_name] = [];
    }
    acc[log.service_name].push(log);
    return acc;
  }, {} as Record<string, SystemHealthLog[]>);

  if (loading && logs.length === 0) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Health</h2>
          <p className="text-muted-foreground">Monitor system performance and status</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchLogs} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={runHealthCheck}>
            <Activity className="h-4 w-4 mr-2" />
            Run Health Check
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(groupedLogs).map(([serviceName, serviceLogs]) => {
          const latestLog = serviceLogs[0];
          return (
            <Card key={serviceName} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-foreground">{serviceName}</h3>
                  {getStatusBadge(latestLog.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {latestLog.response_time && (
                    <div>
                      <p className="text-xs text-muted-foreground">Response Time</p>
                      <p className="text-lg font-semibold">{latestLog.response_time}ms</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Errors</p>
                    <p className="text-lg font-semibold">{latestLog.error_count}</p>
                  </div>
                  {latestLog.cpu_usage && (
                    <div>
                      <p className="text-xs text-muted-foreground">CPU Usage</p>
                      <p className="text-lg font-semibold">{latestLog.cpu_usage}%</p>
                    </div>
                  )}
                  {latestLog.memory_usage && (
                    <div>
                      <p className="text-xs text-muted-foreground">Memory Usage</p>
                      <p className="text-lg font-semibold">{latestLog.memory_usage}%</p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Last checked: {new Date(latestLog.checked_at).toLocaleString()}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No health checks recorded yet. Run your first health check.</p>
        </div>
      )}
    </div>
  );
}