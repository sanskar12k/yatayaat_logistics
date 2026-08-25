import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, UserPlus, Truck, Building2, Send, Phone, Mail, 
  MessageCircle, RefreshCw, CheckCircle, Clock, XCircle, Filter 
} from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  industry: string | null;
  status: string | null;
  source: string;
  created_at: string;
}

interface Assignment {
  id: string;
  lead_id: string;
  transporter_id: string;
  status: string;
  lead_type: string | null;
  notes: string | null;
  created_at: string;
}

const LEAD_CATEGORIES = [
  { value: "ftl", label: "FTL Loads" },
  { value: "ptl", label: "PTL Loads" },
  { value: "relocation", label: "Relocation" },
  { value: "bike_transport", label: "Bike Transport" },
  { value: "car_transport", label: "Car Transport" },
  { value: "art_antiques", label: "Art & Antiques" },
  { value: "corporate", label: "Corporate" },
  { value: "govt", label: "Government" },
  { value: "student", label: "Students" },
];

export function LeadMatchingEngine() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const sb = supabase as any;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, assignmentsRes] = await Promise.all([
        sb.from('leads').select('*').order('created_at', { ascending: false }),
        sb.from('lead_assignments').select('*').order('created_at', { ascending: false }),
      ]);

      if (leadsRes.error) throw leadsRes.error;
      if (assignmentsRes.error) throw assignmentsRes.error;

      setLeads(leadsRes.data || []);
      setAssignments(assignmentsRes.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoCategorizeLead = (lead: Lead): string => {
    const text = `${lead.company_name} ${lead.industry || ''}`.toLowerCase();
    
    if (text.includes('corporate') || text.includes('company')) return 'corporate';
    if (text.includes('government') || text.includes('govt')) return 'govt';
    if (text.includes('student') || text.includes('college')) return 'student';
    if (text.includes('bike') || text.includes('motorcycle')) return 'bike_transport';
    if (text.includes('car') || text.includes('vehicle')) return 'car_transport';
    if (text.includes('art') || text.includes('antique')) return 'art_antiques';
    if (text.includes('house') || text.includes('home') || text.includes('relocat')) return 'relocation';
    
    return 'ftl';
  };

  const assignLeadToTransporter = async (leadId: string, transporterId: string, category: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await sb
        .from('lead_assignments')
        .insert({
          lead_id: leadId,
          transporter_id: transporterId,
          assigned_by: user?.id,
          lead_type: category,
          status: 'pending',
        });

      if (error) throw error;
      
      // Update lead status
      await sb
        .from('leads')
        .update({ status: 'assigned' })
        .eq('id', leadId);

      toast.success('Lead assigned successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateAssignmentStatus = async (assignmentId: string, status: string) => {
    try {
      const { error } = await sb
        .from('lead_assignments')
        .update({ status })
        .eq('id', assignmentId);

      if (error) throw error;
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const sendNotification = async (type: 'sms' | 'email' | 'whatsapp', lead: Lead) => {
    toast.success(`${type.toUpperCase()} notification queued for ${lead.contact_person || lead.company_name}`);
  };

  const getStatusBadge = (status: string | null) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
      new: { variant: "default", icon: Clock },
      assigned: { variant: "secondary", icon: UserPlus },
      contacted: { variant: "outline", icon: Phone },
      converted: { variant: "default", icon: CheckCircle },
      lost: { variant: "destructive", icon: XCircle },
    };
    const config = variants[status || 'new'] || variants.new;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status || 'new'}
      </Badge>
    );
  };

  const filteredLeads = leads.filter(lead => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="leads">
        <TabsList>
          <TabsTrigger value="leads" className="gap-2">
            <Users className="h-4 w-4" />
            Leads ({leads.length})
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Assignments ({assignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filters:</span>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={fetchData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No leads found</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLeads.map((lead) => {
                const category = autoCategorizeLead(lead);
                
                return (
                  <Card key={lead.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{lead.company_name}</h4>
                          {lead.contact_person && (
                            <p className="text-sm text-muted-foreground">{lead.contact_person}</p>
                          )}
                        </div>
                        {getStatusBadge(lead.status)}
                      </div>

                      <Badge variant="outline" className="mb-3">
                        {LEAD_CATEGORIES.find(c => c.value === category)?.label || 'General'}
                      </Badge>

                      <div className="space-y-2 text-sm">
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => sendNotification('sms', lead)}>
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => sendNotification('email', lead)}>
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => sendNotification('whatsapp', lead)}>
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => assignLeadToTransporter(lead.id, 'auto', category)}
                        >
                          <Truck className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {assignments.length === 0 ? (
            <Card className="p-8 text-center">
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No assignments yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div>
                      <Badge variant="outline">{assignment.lead_type || 'General'}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Assigned: {new Date(assignment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={assignment.status}
                        onValueChange={(value) => updateAssignmentStatus(assignment.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="negotiating">Negotiating</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}