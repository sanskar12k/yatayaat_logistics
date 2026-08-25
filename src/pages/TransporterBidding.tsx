import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Package, MapPin, Search, TrendingUp, RefreshCw, Send } from "lucide-react";
import { BidSubmissionForm } from "@/components/partload/BidSubmissionForm";
import { BidCard } from "@/components/partload/BidCard";

export default function TransporterBidding() {
  const [availablePosts, setAvailablePosts] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const sb = supabase as any;

  useEffect(() => {
    fetchAvailablePosts();
    fetchMyBids();
    subscribeToNewPosts();
  }, []);

  const fetchAvailablePosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await sb
        .from('part_load_posts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailablePosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch available loads');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBids = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await sb
        .from('part_load_bids')
        .select('*, part_load_posts(*)')
        .eq('transporter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyBids(data || []);
    } catch (error) {
      console.error('Error fetching my bids:', error);
      toast.error('Failed to fetch your bids');
    }
  };

  const subscribeToNewPosts = () => {
    const channel = supabase
      .channel('new-posts-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'part_load_posts'
        },
        () => {
          toast.success('New load posted! Check available loads.');
          fetchAvailablePosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleBidClick = (post: any) => {
    setSelectedPost(post);
    setShowBidForm(true);
  };

  const handleBidSuccess = () => {
    setShowBidForm(false);
    setSelectedPost(null);
    fetchMyBids();
    fetchAvailablePosts();
  };

  const filteredPosts = availablePosts.filter(post =>
    post.load_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.drop_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.goods_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    activeBids: myBids.filter(b => b.status === 'pending').length,
    acceptedBids: myBids.filter(b => b.status === 'accepted').length,
    totalEarnings: myBids.filter(b => b.status === 'accepted').reduce((sum, b) => sum + b.quoted_rate, 0)
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Transporter Bidding Console</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse available part-load requirements and submit competitive bids to maximize your truck utilization
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Active Bids</p>
            <p className="text-2xl font-bold text-primary">{stats.activeBids}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Accepted Bids</p>
            <p className="text-2xl font-bold text-green-600">{stats.acceptedBids}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <p className="text-2xl font-bold text-foreground">₹{stats.totalEarnings.toLocaleString()}</p>
          </Card>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Loads ({filteredPosts.length})</TabsTrigger>
            <TabsTrigger value="mybids">My Bids ({myBids.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, location, or goods type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={fetchAvailablePosts} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Bid Submission Form */}
            {showBidForm && selectedPost && (
              <BidSubmissionForm
                post={selectedPost}
                onSuccess={handleBidSuccess}
                onCancel={() => {
                  setShowBidForm(false);
                  setSelectedPost(null);
                }}
              />
            )}

            {/* Available Posts Grid */}
            {loading ? (
              <Card className="p-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Loading available loads...</p>
              </Card>
            ) : filteredPosts.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Loads Available</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'No loads match your search' : 'Check back soon for new loads'}
                </p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredPosts.map((post) => {
                  const hasMyBid = myBids.some(bid => bid.post_id === post.id);
                  
                  return (
                    <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">{post.load_title}</h3>
                          <Badge variant="default">{post.goods_type}</Badge>
                          {hasMyBid && <Badge variant="secondary" className="ml-2">Bid Placed</Badge>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Expected Rate</p>
                          <p className="text-2xl font-bold text-primary">
                            {post.expected_rate ? `₹${post.expected_rate.toLocaleString()}` : 'Open'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">From</p>
                            <p className="font-medium text-foreground">{post.pickup_location}</p>
                            <p className="text-xs text-muted-foreground">{post.pickup_pincode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">To</p>
                            <p className="font-medium text-foreground">{post.drop_location}</p>
                            <p className="text-xs text-muted-foreground">{post.drop_pincode}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Weight</p>
                          <p className="font-medium text-foreground">{post.weight_kg} kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Volume</p>
                          <p className="font-medium text-foreground">{post.volume_cft} ft³</p>
                        </div>
                      </div>

                      {post.load_description && (
                        <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted rounded-lg">
                          {post.load_description}
                        </p>
                      )}

                      {post.photos && post.photos.length > 0 && (
                        <div className="mb-4 flex gap-2">
                          {post.photos.slice(0, 3).map((photo: string, idx: number) => (
                            <img
                              key={idx}
                              src={photo}
                              alt={`Load ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Posted {new Date(post.created_at).toLocaleDateString()}
                        </p>
                        <Button 
                          onClick={() => handleBidClick(post)}
                          disabled={hasMyBid}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {hasMyBid ? 'Bid Placed' : 'Place Bid'}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mybids" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-foreground">My Submitted Bids</h2>
              <Button onClick={fetchMyBids} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {myBids.length === 0 ? (
              <Card className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Bids Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start bidding on available loads to grow your business
                </p>
                <Button onClick={() => {
                  const availableTab = document.querySelector('[value="available"]') as HTMLElement;
                  availableTab?.click();
                }}>
                  View Available Loads
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {myBids.map((bid) => (
                  <div key={bid.id} className="space-y-3">
                    <Card className="p-4 bg-muted">
                      <p className="text-sm font-semibold text-foreground">
                        Load: {bid.part_load_posts?.load_title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bid.part_load_posts?.pickup_location} → {bid.part_load_posts?.drop_location}
                      </p>
                    </Card>
                    <BidCard bid={bid} isCustomer={false} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
