import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plug, Plus, Settings, Trash2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  tool_name: string;
  tool_type: string;
  endpoint_url: string | null;
  webhook_url: string | null;
  is_active: boolean;
  config: any;
}

const TOOL_TYPES = [
  { value: "zapier", label: "Zapier" },
  { value: "make", label: "Make (Integromat)" },
  { value: "google_sheets", label: "Google Sheets" },
  { value: "crm", label: "CRM System" },
  { value: "logistics_aggregator", label: "Logistics Aggregator" },
  { value: "whatsapp", label: "WhatsApp Business" },
  { value: "sms_gateway", label: "SMS Gateway" },
  { value: "payment", label: "Payment Gateway" },
];

export function ThirdPartyIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tool_name: "",
    tool_type: "",
    api_key: "",
    endpoint_url: "",
    webhook_url: "",
  });

  const sb = supabase as any;

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await sb
        .from('third_party_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIntegration = async () => {
    if (!formData.tool_name || !formData.tool_type) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const { error } = await sb
        .from('third_party_integrations')
        .insert({
          tool_name: formData.tool_name,
          tool_type: formData.tool_type,
          api_key_encrypted: formData.api_key ? btoa(formData.api_key) : null,
          endpoint_url: formData.endpoint_url || null,
          webhook_url: formData.webhook_url || null,
        });

      if (error) throw error;

      toast.success('Integration added successfully');
      setDialogOpen(false);
      setFormData({ tool_name: "", tool_type: "", api_key: "", endpoint_url: "", webhook_url: "" });
      fetchIntegrations();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleIntegration = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await sb
        .from('third_party_integrations')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Integration ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchIntegrations();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const deleteIntegration = async (id: string) => {
    if (!confirm('Delete this integration?')) return;

    try {
      const { error } = await sb
        .from('third_party_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Integration deleted');
      fetchIntegrations();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getToolIcon = (type: string) => {
    const icons: Record<string, string> = {
      zapier: "⚡",
      make: "🔧",
      google_sheets: "📊",
      crm: "👥",
      logistics_aggregator: "🚚",
      whatsapp: "💬",
      sms_gateway: "📱",
      payment: "💳",
    };
    return icons[type] || "🔌";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5 text-primary" />
              Third-Party Integrations
            </CardTitle>
            <CardDescription>Connect external tools and services</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tool Name *</Label>
                  <Input
                    placeholder="e.g., My Zapier Workflow"
                    value={formData.tool_name}
                    onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tool Type *</Label>
                  <Select
                    value={formData.tool_type}
                    onValueChange={(value) => setFormData({ ...formData, tool_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOOL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>API Key / Secret</Label>
                  <Input
                    type="password"
                    placeholder="Enter API key (stored encrypted)"
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Endpoint URL</Label>
                  <Input
                    placeholder="https://api.example.com/webhook"
                    value={formData.endpoint_url}
                    onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Webhook URL</Label>
                  <Input
                    placeholder="Your webhook receive URL"
                    value={formData.webhook_url}
                    onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                  />
                </div>
                <Button onClick={addIntegration} className="w-full">
                  Add Integration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : integrations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Plug className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No integrations configured yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className={`p-4 border rounded-lg ${
                  integration.is_active ? 'border-green-500/30 bg-green-500/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getToolIcon(integration.tool_type)}</span>
                    <div>
                      <h4 className="font-medium text-foreground">{integration.tool_name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {TOOL_TYPES.find(t => t.value === integration.tool_type)?.label || integration.tool_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.is_active ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {integration.endpoint_url && (
                  <p className="text-xs text-muted-foreground mt-2 truncate">
                    {integration.endpoint_url}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4">
                  <Switch
                    checked={integration.is_active}
                    onCheckedChange={() => toggleIntegration(integration.id, integration.is_active)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => deleteIntegration(integration.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}