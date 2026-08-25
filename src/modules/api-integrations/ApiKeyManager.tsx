import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Key, Plus, Copy, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key_preview: string;
  scopes: string[];
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

const AVAILABLE_SCOPES = [
  { value: "booking.read", label: "Read Bookings" },
  { value: "booking.write", label: "Create Bookings" },
  { value: "leads.read", label: "Read Leads" },
  { value: "leads.write", label: "Create Leads" },
  { value: "tracking.read", label: "Read Tracking" },
  { value: "quotes.read", label: "Read Quotes" },
  { value: "quotes.write", label: "Create Quotes" },
];

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const sb = supabase as any;

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await sb
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate a secure random key
      const randomBytes = new Uint8Array(32);
      crypto.getRandomValues(randomBytes);
      const key = 'yt_' + Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 40);

      // Hash the key for storage (in production, use proper bcrypt)
      const keyHash = btoa(key);
      const keyPreview = key.slice(0, 8) + '...' + key.slice(-4);

      const { error } = await sb
        .from('api_keys')
        .insert({
          name: newKeyName,
          key_hash: keyHash,
          key_preview: keyPreview,
          scopes: selectedScopes,
          created_by: user.id,
        });

      if (error) throw error;

      setGeneratedKey(key);
      toast.success('API key generated successfully');
      fetchApiKeys();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleKeyStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await sb
        .from('api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`API key ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to update key status');
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    try {
      const { error } = await sb
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('API key deleted');
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to delete key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const resetDialog = () => {
    setNewKeyName("");
    setSelectedScopes([]);
    setGeneratedKey(null);
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              API Key Management
            </CardTitle>
            <CardDescription>Generate and manage API keys for third-party integrations</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate API Key</DialogTitle>
              </DialogHeader>
              
              {!generatedKey ? (
                <div className="space-y-4">
                  <div>
                    <Label>Key Name</Label>
                    <Input
                      placeholder="e.g., Production API Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Scopes (Permissions)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {AVAILABLE_SCOPES.map((scope) => (
                        <div key={scope.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={scope.value}
                            checked={selectedScopes.includes(scope.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedScopes([...selectedScopes, scope.value]);
                              } else {
                                setSelectedScopes(selectedScopes.filter(s => s !== scope.value));
                              }
                            }}
                          />
                          <label htmlFor={scope.value} className="text-sm">
                            {scope.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={generateApiKey} className="w-full">
                    Generate Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-600 font-medium mb-2">
                      ⚠️ Copy this key now. You won't be able to see it again!
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-muted rounded text-xs break-all">
                        {generatedKey}
                      </code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={resetDialog} className="w-full">
                    Done
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Key className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No API keys generated yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{key.name}</h4>
                    <Badge variant={key.is_active ? "default" : "secondary"}>
                      {key.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <code className="text-sm text-muted-foreground">{key.key_preview}</code>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {key.scopes?.map((scope) => (
                      <Badge key={scope} variant="outline" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={key.is_active}
                    onCheckedChange={() => toggleKeyStatus(key.id, key.is_active)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => deleteKey(key.id)}
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