import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, RefreshCw, Settings, Eye, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminUIBuilder() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);

  const sb = supabase as any;

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const { data, error } = await sb
        .from('site_config')
        .select('*')
        .order('config_key');

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast.error('Failed to fetch site configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (configKey: string, newValue: any) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await sb
        .from('site_config')
        .update({
          config_value: newValue,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('config_key', configKey);

      if (error) throw error;

      toast.success('Configuration updated successfully');
      fetchConfigs();
      setEditingConfig(null);
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewConfig = async () => {
    const configKey = prompt('Enter configuration key (e.g., footer_text):');
    if (!configKey) return;

    const defaultValue = { enabled: true, content: '' };

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await sb
        .from('site_config')
        .insert([{
          config_key: configKey,
          config_value: defaultValue,
          description: 'Custom configuration',
          updated_by: user.id
        }]);

      if (error) throw error;

      toast.success('New configuration added');
      fetchConfigs();
    } catch (error) {
      console.error('Error adding config:', error);
      toast.error('Failed to add configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6" />
            UI Builder & Configuration
          </h2>
          <p className="text-muted-foreground">
            Manage site-wide configurations and editable UI elements
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNewConfig} variant="outline">
            <Code className="h-4 w-4 mr-2" />
            Add Config
          </Button>
          <Button onClick={fetchConfigs} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visual">
        <TabsList>
          <TabsTrigger value="visual">
            <Eye className="h-4 w-4 mr-2" />
            Visual Editor
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="h-4 w-4 mr-2" />
            JSON Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          {configs.map((config) => (
            <Card key={config.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{config.config_key}</h3>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingConfig(editingConfig?.id === config.id ? null : config)}
                  >
                    {editingConfig?.id === config.id ? 'Cancel' : 'Edit'}
                  </Button>
                </div>

                {editingConfig?.id === config.id ? (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    {/* Enabled Toggle */}
                    {typeof config.config_value === 'object' && 'enabled' in config.config_value && (
                      <div className="flex items-center justify-between">
                        <Label>Enabled</Label>
                        <Switch
                          checked={config.config_value.enabled}
                          onCheckedChange={(checked) => {
                            const updated = { ...config.config_value, enabled: checked };
                            setEditingConfig({ ...editingConfig, config_value: updated });
                          }}
                        />
                      </div>
                    )}

                    {/* Title Field */}
                    {config.config_value.title !== undefined && (
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={editingConfig.config_value.title}
                          onChange={(e) => {
                            const updated = { ...editingConfig.config_value, title: e.target.value };
                            setEditingConfig({ ...editingConfig, config_value: updated });
                          }}
                        />
                      </div>
                    )}

                    {/* Subtitle Field */}
                    {config.config_value.subtitle !== undefined && (
                      <div>
                        <Label>Subtitle</Label>
                        <Input
                          value={editingConfig.config_value.subtitle}
                          onChange={(e) => {
                            const updated = { ...editingConfig.config_value, subtitle: e.target.value };
                            setEditingConfig({ ...editingConfig, config_value: updated });
                          }}
                        />
                      </div>
                    )}

                    {/* Content Field */}
                    {config.config_value.content !== undefined && (
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={editingConfig.config_value.content}
                          onChange={(e) => {
                            const updated = { ...editingConfig.config_value, content: e.target.value };
                            setEditingConfig({ ...editingConfig, config_value: updated });
                          }}
                          rows={4}
                        />
                      </div>
                    )}

                    <Button
                      onClick={() => handleSaveConfig(config.config_key, editingConfig.config_value)}
                      disabled={saving}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-xs text-muted-foreground overflow-auto">
                      {JSON.stringify(config.config_value, null, 2)}
                    </pre>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated: {new Date(config.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          {configs.map((config) => (
            <Card key={config.id} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{config.config_key}</h3>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>

                <div>
                  <Label>JSON Configuration</Label>
                  <Textarea
                    value={JSON.stringify(config.config_value, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        handleSaveConfig(config.config_key, parsed);
                      } catch (err) {
                        toast.error('Invalid JSON format');
                      }
                    }}
                    className="font-mono text-sm"
                    rows={10}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(config.updated_at).toLocaleString()}
                </p>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card className="p-6 bg-primary/10 border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">💡 Quick Guide</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Edit configuration values using the Visual Editor for easy updates</li>
          <li>• Use JSON Editor for advanced configuration with custom fields</li>
          <li>• Changes take effect immediately across the entire application</li>
          <li>• Add new configs for custom sections using "Add Config"</li>
          <li>• Toggle enabled/disabled to show/hide sections without deleting data</li>
        </ul>
      </Card>
    </div>
  );
}
