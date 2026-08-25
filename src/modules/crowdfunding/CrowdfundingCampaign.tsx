import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Share2, QrCode, DollarSign, Users, Target, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  currency: string;
  campaign_image: string | null;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
}

export default function CrowdfundingModule() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [donateDialogOpen, setDonateDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [donationData, setDonationData] = useState({
    amount: "",
    name: "",
    email: "",
    message: "",
    isAnonymous: false,
  });

  const sb = supabase as any;

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await sb
        .from('crowdfunding_campaigns')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!selectedCampaign || !donationData.amount) {
      toast.error('Please enter donation amount');
      return;
    }

    try {
      const { error } = await sb
        .from('donations')
        .insert({
          campaign_id: selectedCampaign.id,
          amount: parseFloat(donationData.amount),
          donor_name: donationData.isAnonymous ? 'Anonymous' : donationData.name,
          donor_email: donationData.email,
          message: donationData.message,
          is_anonymous: donationData.isAnonymous,
        });

      if (error) throw error;

      // Update campaign amount
      await sb
        .from('crowdfunding_campaigns')
        .update({ 
          current_amount: selectedCampaign.current_amount + parseFloat(donationData.amount) 
        })
        .eq('id', selectedCampaign.id);

      toast.success('Thank you for your donation! 🙏');
      setDonateDialogOpen(false);
      setDonationData({ amount: "", name: "", email: "", message: "", isAnonymous: false });
      fetchCampaigns();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyShareLink = (campaign: Campaign) => {
    const url = `${window.location.origin}/crowdfunding?campaign=${campaign.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Support Yatayaat Logistics
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us revolutionize logistics in India. Your contribution helps us provide better services,
            expand our network, and create more jobs.
          </p>
        </div>

        {/* Campaigns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Active Campaigns</h3>
                <p className="text-muted-foreground">Check back soon for upcoming crowdfunding opportunities.</p>
              </Card>
            </div>
          ) : (
            campaigns.map((campaign) => {
              const progress = (campaign.current_amount / campaign.goal_amount) * 100;
              
              return (
                <Card key={campaign.id} className="overflow-hidden">
                  {campaign.campaign_image && (
                    <div className="h-48 bg-muted">
                      <img 
                        src={campaign.campaign_image} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-foreground">
                          {campaign.currency} {campaign.current_amount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          of {campaign.currency} {campaign.goal_amount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {progress.toFixed(1)}% funded
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setDonateDialogOpen(true);
                        }}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Donate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyShareLink(campaign)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Donation Dialog */}
        <Dialog open={donateDialogOpen} onOpenChange={setDonateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Make a Donation</DialogTitle>
            </DialogHeader>
            {selectedCampaign && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground">{selectedCampaign.title}</p>
                </div>

                <div>
                  <Label>Amount ({selectedCampaign.currency}) *</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={donationData.amount}
                    onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
                  />
                  <div className="flex gap-2 mt-2">
                    {[500, 1000, 5000, 10000].map((amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        size="sm"
                        onClick={() => setDonationData({ ...donationData, amount: amt.toString() })}
                      >
                        ₹{amt}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Your Name</Label>
                  <Input
                    placeholder="Enter your name"
                    value={donationData.name}
                    onChange={(e) => setDonationData({ ...donationData, name: e.target.value })}
                    disabled={donationData.isAnonymous}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={donationData.email}
                    onChange={(e) => setDonationData({ ...donationData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Message (Optional)</Label>
                  <Textarea
                    placeholder="Leave a message of support..."
                    value={donationData.message}
                    onChange={(e) => setDonationData({ ...donationData, message: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={donationData.isAnonymous}
                    onChange={(e) => setDonationData({ ...donationData, isAnonymous: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm text-muted-foreground">
                    Donate anonymously
                  </label>
                </div>

                <Button onClick={handleDonate} className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Complete Donation
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Razorpay/Stripe
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}