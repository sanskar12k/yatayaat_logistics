import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Phone, Mail, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  source: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  industry: string;
  status: string;
  created_at: string;
}

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Lead status updated successfully");
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-500",
      contacted: "bg-yellow-500",
      qualified: "bg-green-500",
      converted: "bg-purple-500",
      rejected: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  if (loading) {
    return <div className="text-center py-8">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lead Management</h2>
          <p className="text-muted-foreground">Manage leads from data scraping and other sources</p>
        </div>
      </div>

      <div className="grid gap-4">
        {leads.map((lead) => (
          <Card key={lead.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <CardTitle className="text-lg">{lead.company_name}</CardTitle>
                    <CardDescription>
                      {lead.source} • {lead.industry}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {lead.contact_person && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.contact_person}</span>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.phone}</span>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.email}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLeadStatus(lead.id, "contacted")}
                >
                  Mark Contacted
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLeadStatus(lead.id, "qualified")}
                >
                  Mark Qualified
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLeadStatus(lead.id, "converted")}
                >
                  Mark Converted
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {leads.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No leads found. Start data scraping to generate leads.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
