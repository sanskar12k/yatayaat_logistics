import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Agent {
  id: string;
  agent_code: string;
  contact_person: string;
  phone: string;
  email: string;
  commission_percentage: number;
  total_earnings: number;
  is_active: boolean;
  verified: boolean;
  created_at: string;
}

export function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("agents")
        .update({ verified: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Agent ${!currentStatus ? "verified" : "unverified"} successfully`);
      fetchAgents();
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent status");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("agents")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Agent ${!currentStatus ? "activated" : "deactivated"} successfully`);
      fetchAgents();
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent status");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading agents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agent/Commission Management</h2>
          <p className="text-muted-foreground">Manage commission agents and partners</p>
        </div>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <UserCheck className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <CardTitle className="text-lg">{agent.contact_person}</CardTitle>
                    <CardDescription>
                      Code: {agent.agent_code} • {agent.phone} • {agent.email}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={agent.verified ? "default" : "secondary"}>
                    {agent.verified ? "Verified" : "Unverified"}
                  </Badge>
                  <Badge variant={agent.is_active ? "default" : "secondary"}>
                    {agent.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                  <p className="font-medium">{agent.commission_percentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="font-medium flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ₹{agent.total_earnings.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVerification(agent.id, agent.verified)}
                >
                  {agent.verified ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Unverify
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(agent.id, agent.is_active)}
                >
                  {agent.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {agents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No agents registered yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
