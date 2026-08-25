import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Building2, Save } from "lucide-react";

export function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    company_name: "Yatayaat Logistics",
    address: "B/31/H/4 Gobra Gorasthan Road, Ground Floor, Kolkata-700046",
    phone_primary: "7044711417",
    phone_secondary: "6289984889",
    phone_tertiary: "6290992707",
    email: "yatayaatlogistics@gmail.com",
    gst_number: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          company_name: data.company_name,
          address: data.address,
          phone_primary: data.phone_primary,
          phone_secondary: data.phone_secondary || "",
          phone_tertiary: data.phone_tertiary || "",
          email: data.email,
          gst_number: data.gst_number || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("company_settings")
        .update({
          ...settings,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq("id", (await supabase.from("company_settings").select("id").single()).data?.id);

      if (error) throw error;
      toast.success("Company settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Company Settings</h2>
        <p className="text-muted-foreground">Manage your company information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Company Information</CardTitle>
          </div>
          <CardDescription>Update your company details that appear on dockets and website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_primary">Primary Phone *</Label>
                <Input
                  id="phone_primary"
                  value={settings.phone_primary}
                  onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_secondary">Secondary Phone</Label>
                <Input
                  id="phone_secondary"
                  value={settings.phone_secondary}
                  onChange={(e) => setSettings({ ...settings, phone_secondary: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_tertiary">Tertiary Phone</Label>
                <Input
                  id="phone_tertiary"
                  value={settings.phone_tertiary}
                  onChange={(e) => setSettings({ ...settings, phone_tertiary: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gst_number">GST Number</Label>
                <Input
                  id="gst_number"
                  value={settings.gst_number}
                  onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })}
                  placeholder="Enter GST number when available"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
