import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, TrendingUp, Eye, MousePointer } from "lucide-react";

interface AdCampaign {
  id: string;
  campaign_name: string;
  platform: string;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  impressions: number;
  clicks: number;
  conversions: number;
  created_at: string;
}

export function AdminAdManagement() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    campaign_name: '',
    platform: 'google',
    budget: '',
    start_date: '',
    end_date: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ad_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch campaigns');
      console.error(error);
    } else {
      setCampaigns(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('ad_campaigns').insert([{
      campaign_name: formData.campaign_name,
      platform: formData.platform,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      status: formData.status
    }]);

    if (error) {
      toast.error('Failed to create campaign');
    } else {
      toast.success('Campaign created successfully');
      setShowForm(false);
      setFormData({
        campaign_name: '',
        platform: 'google',
        budget: '',
        start_date: '',
        end_date: '',
        status: 'draft'
      });
      fetchCampaigns();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('ad_campaigns')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      fetchCampaigns();
    }
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return '0.00';
    return ((clicks / impressions) * 100).toFixed(2);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ad Management</h2>
          <p className="text-muted-foreground">Manage advertising campaigns across platforms</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Ad Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Campaign Name</Label>
                <Input
                  value={formData.campaign_name}
                  onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Platform</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="facebook">Facebook Ads</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    <SelectItem value="instagram">Instagram Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Budget (₹)</Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Campaign</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{campaign.campaign_name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{campaign.platform}</p>
                </div>
                <Select value={campaign.status} onValueChange={(value) => updateStatus(campaign.id, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Impressions</p>
                    <p className="text-lg font-semibold">{campaign.impressions.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                    <p className="text-lg font-semibold">{campaign.clicks.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">CTR</p>
                    <p className="text-lg font-semibold">{calculateCTR(campaign.clicks, campaign.impressions)}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conversions</p>
                  <p className="text-lg font-semibold">{campaign.conversions}</p>
                </div>
              </div>

              {campaign.budget && (
                <p className="text-sm text-muted-foreground">Budget: ₹{Number(campaign.budget).toLocaleString()}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No campaigns yet. Create your first campaign.</p>
        </div>
      )}
    </div>
  );
}