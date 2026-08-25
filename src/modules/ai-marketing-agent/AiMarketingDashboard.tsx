import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Sparkles, Video, Image, FileText, Mail, MessageCircle, 
  TrendingUp, Play, Pause, RefreshCw, Zap, Target, BarChart3 
} from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  campaign_name: string;
  campaign_type: string;
  content_type: string;
  target_audience: string[];
  status: string;
  generated_content: any;
  performance_metrics: any;
  created_at: string;
}

const CAMPAIGN_TYPES = [
  { value: "youtube", label: "YouTube Video", icon: Video },
  { value: "instagram", label: "Instagram Reel/Post", icon: Image },
  { value: "blog", label: "SEO Blog Post", icon: FileText },
  { value: "email", label: "Email Campaign", icon: Mail },
  { value: "whatsapp", label: "WhatsApp Broadcast", icon: MessageCircle },
];

const TARGET_AUDIENCES = [
  "Packers & Movers",
  "FTL Clients",
  "PTL Clients",
  "Corporate Relocation",
  "Government Employees",
  "Army Personnel",
  "Nurses & Healthcare",
  "Students",
  "Transferrable Jobs",
];

export function AiMarketingDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "",
    audiences: [] as string[],
  });

  const sb = supabase as any;

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await sb
        .from('ai_marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.type) {
      toast.error('Please fill in campaign details');
      return;
    }

    setGenerating(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const contentTemplates: Record<string, any> = {
        youtube: {
          title: `Top 10 Reasons to Choose Yatayaat Logistics | ${new Date().getFullYear()}`,
          script: `Hook: Are you looking for reliable logistics in India?\n\nMain Content:\n1. Pan-India network\n2. Real-time tracking\n3. Competitive rates\n...\n\nCTA: Visit yatayaat.com today!`,
          thumbnail_prompt: "Professional logistics truck with Yatayaat branding, modern design, blue and orange colors",
        },
        instagram: {
          caption: "🚚 Moving made easy with Yatayaat Logistics! ✨\n\n✅ Pan-India Coverage\n✅ Real-time Tracking\n✅ Best Rates Guaranteed\n\nDM us for instant quotes! 📦\n\n#logistics #packers #movers #india",
          image_prompt: "Colorful infographic about logistics services",
          hashtags: ["logistics", "transport", "india", "moving", "packers"],
        },
        blog: {
          title: "Complete Guide to Part Load Transport in India 2024",
          outline: "1. Introduction to PTL\n2. Benefits of Part Load\n3. How to Choose Provider\n4. Cost Factors\n5. Yatayaat Advantage",
          keywords: ["part load transport", "ptl india", "logistics", "freight"],
        },
        email: {
          subject: "🚚 Exclusive Offer: 20% Off Your First Shipment!",
          body: "Dear Valued Customer,\n\nWe're excited to offer you an exclusive discount...",
          cta: "Get Quote Now",
        },
        whatsapp: {
          message: "🚛 *Yatayaat Logistics*\n\nSpecial offer this month!\n\n✅ Free pickup\n✅ Live tracking\n✅ Insurance included\n\nReply 'QUOTE' for instant pricing!",
        },
      };

      const { error } = await sb
        .from('ai_marketing_campaigns')
        .insert({
          campaign_name: newCampaign.name,
          campaign_type: newCampaign.type,
          content_type: newCampaign.type,
          target_audience: newCampaign.audiences,
          generated_content: contentTemplates[newCampaign.type] || {},
          status: 'draft',
        });

      if (error) throw error;

      toast.success('Campaign content generated!');
      setNewCampaign({ name: "", type: "", audiences: [] });
      fetchCampaigns();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const publishCampaign = async (campaign: Campaign) => {
    try {
      const { error } = await sb
        .from('ai_marketing_campaigns')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', campaign.id);

      if (error) throw error;
      toast.success('Campaign published!');
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to publish');
    }
  };

  const getCampaignIcon = (type: string) => {
    const config = CAMPAIGN_TYPES.find(t => t.value === type);
    return config?.icon || FileText;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{campaigns.length}</p>
                <p className="text-sm text-muted-foreground">Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Play className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'published').length}
                </p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Target className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{TARGET_AUDIENCES.length}</p>
                <p className="text-sm text-muted-foreground">Target Segments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">--</p>
                <p className="text-sm text-muted-foreground">Avg. CTR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">
            <Sparkles className="h-4 w-4 mr-2" />
            Create Campaign
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            All Campaigns ({campaigns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Content Generator
              </CardTitle>
              <CardDescription>
                Generate marketing content automatically using AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Campaign Name</Label>
                <Input
                  placeholder="e.g., Q1 2024 Lead Gen Campaign"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Content Type</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {CAMPAIGN_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={newCampaign.type === type.value ? "default" : "outline"}
                        className="flex flex-col h-auto py-4"
                        onClick={() => setNewCampaign({ ...newCampaign, type: type.value })}
                      >
                        <Icon className="h-6 w-6 mb-2" />
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>Target Audience</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {TARGET_AUDIENCES.map((audience) => (
                    <Badge
                      key={audience}
                      variant={newCampaign.audiences.includes(audience) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const audiences = newCampaign.audiences.includes(audience)
                          ? newCampaign.audiences.filter(a => a !== audience)
                          : [...newCampaign.audiences, audience];
                        setNewCampaign({ ...newCampaign, audiences });
                      }}
                    >
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={generateCampaign} 
                className="w-full"
                disabled={generating}
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Campaign Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : campaigns.length === 0 ? (
            <Card className="p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No campaigns created yet</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {campaigns.map((campaign) => {
                const Icon = getCampaignIcon(campaign.campaign_type);
                
                return (
                  <Card key={campaign.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{campaign.campaign_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {CAMPAIGN_TYPES.find(t => t.value === campaign.campaign_type)?.label}
                            </p>
                          </div>
                        </div>
                        <Badge variant={campaign.status === 'published' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>

                      {campaign.target_audience && campaign.target_audience.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {campaign.target_audience.slice(0, 3).map((audience, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {audience}
                            </Badge>
                          ))}
                          {campaign.target_audience.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{campaign.target_audience.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => publishCampaign(campaign)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View Content
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}