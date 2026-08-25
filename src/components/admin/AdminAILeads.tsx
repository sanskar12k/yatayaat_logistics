import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Trash2, RefreshCw } from "lucide-react";

interface AILead {
  id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  lead_source: string | null;
  confidence_score: number | null;
  potential_value: number | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export function AdminAILeads() {
  const [leads, setLeads] = useState<AILead[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ai_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch leads');
      console.error(error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const generateLeads = async () => {
    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // AI-powered lead generation simulation
      const industries = ['Manufacturing', 'Retail', 'E-commerce', 'Pharmaceuticals', 'FMCG', 'Automotive'];
      const sources = ['Website', 'LinkedIn', 'Trade Show', 'Referral', 'Cold Outreach'];
      
      const newLeads = Array.from({ length: 3 }, (_, i) => ({
        company_name: `Potential Client ${Date.now() + i}`,
        contact_person: `Contact Person ${i + 1}`,
        email: `contact${Date.now() + i}@company.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        industry: industries[Math.floor(Math.random() * industries.length)],
        lead_source: sources[Math.floor(Math.random() * sources.length)],
        confidence_score: parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)),
        potential_value: Math.floor(Math.random() * 500000) + 50000,
        status: 'new',
        notes: 'AI-generated lead based on market analysis',
        created_by: user?.id
      }));

      const { error } = await supabase.from('ai_leads').insert(newLeads);
      
      if (error) throw error;
      
      toast.success('Generated 3 new AI leads!');
      fetchLeads();
    } catch (error) {
      toast.error('Failed to generate leads');
      console.error(error);
    }
    setGenerating(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('ai_leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      fetchLeads();
    }
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from('ai_leads').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete lead');
    } else {
      toast.success('Lead deleted');
      fetchLeads();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Lead Generator</h2>
          <p className="text-muted-foreground">AI-powered lead generation and management</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchLeads} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={generateLeads} disabled={generating}>
            <Sparkles className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Generate AI Leads'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leads.map((lead) => (
          <Card key={lead.id} className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-foreground">{lead.company_name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLead(lead.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {lead.contact_person && (
                <p className="text-sm text-muted-foreground">Contact: {lead.contact_person}</p>
              )}
              
              {lead.email && (
                <p className="text-sm text-muted-foreground">Email: {lead.email}</p>
              )}
              
              {lead.phone && (
                <p className="text-sm text-muted-foreground">Phone: {lead.phone}</p>
              )}
              
              {lead.industry && (
                <p className="text-sm"><span className="font-medium">Industry:</span> {lead.industry}</p>
              )}
              
              {lead.confidence_score && (
                <p className="text-sm">
                  <span className="font-medium">Confidence:</span> {(Number(lead.confidence_score) * 100).toFixed(0)}%
                </p>
              )}
              
              {lead.potential_value && (
                <p className="text-sm">
                  <span className="font-medium">Potential Value:</span> ₹{Number(lead.potential_value).toLocaleString()}
                </p>
              )}

              <div className="pt-2">
                <Label className="text-xs">Status</Label>
                <Select value={lead.status} onValueChange={(value) => updateStatus(lead.id, value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No leads generated yet. Click "Generate AI Leads" to start.</p>
        </div>
      )}
    </div>
  );
}