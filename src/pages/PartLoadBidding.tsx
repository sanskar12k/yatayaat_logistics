import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, MapPin, Calendar, TrendingUp, RefreshCw } from "lucide-react";
import { PartLoadPostForm } from "@/components/partload/PartLoadPostForm";
import { BidCard } from "@/components/partload/BidCard";
import { BidComparisonPanel } from "@/components/partload/BidComparisonPanel";
import { TruckMatchPanel } from "@/components/partload/TruckMatchPanel";
import { Badge } from "@/components/ui/badge";

export default function PartLoadBidding() {
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [postBids, setPostBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const sb = supabase as any;

  useEffect(() => {
    if (selectedPost) {
      fetchPostBids(selectedPost.id);
      
      // Real-time subscription for new bids
      const channel = supabase
        .channel('part-load-bids')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'part_load_bids',
            filter: `post_id=eq.${selectedPost.id}`
          },
          (payload) => {
            toast.success('New bid received!');
            fetchPostBids(selectedPost.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedPost]);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await sb
        .from('part_load_posts')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyPosts(data || []);
      
      if (data && data.length > 0 && !selectedPost) {
        setSelectedPost(data[0]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPostBids = async (postId: string) => {
    try {
      const { data, error } = await sb
        .from('part_load_bids')
        .select('*')
        .eq('post_id', postId)
        .order('compatibility_score', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setPostBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to fetch bids');
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      const { error } = await sb
        .from('part_load_bids')
        .update({ status: 'accepted' })
        .eq('id', bidId);

      if (error) throw error;

      // Update post status
      if (selectedPost) {
        await sb
          .from('part_load_posts')
          .update({ status: 'closed' })
          .eq('id', selectedPost.id);
      }

      toast.success('Bid accepted successfully!');
      fetchPostBids(selectedPost.id);
      fetchMyPosts();
    } catch (error) {
      console.error('Error accepting bid:', error);
      toast.error('Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      const { error } = await sb
        .from('part_load_bids')
        .update({ status: 'rejected' })
        .eq('id', bidId);

      if (error) throw error;

      toast.success('Bid rejected');
      fetchPostBids(selectedPost.id);
    } catch (error) {
      console.error('Error rejecting bid:', error);
      toast.error('Failed to reject bid');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Part Load Bidding Platform</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Post your part-load requirements and get competitive bids from transporters with available truck space
          </p>
        </div>

        {/* Premium Corridors Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Premium Corridors from Kolkata</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Regular FTL movements with guaranteed delivery times and priority handling
              </p>
              <div className="flex flex-wrap gap-2">
                {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Guwahati'].map((city) => (
                  <Badge key={city} variant="secondary" className="bg-primary/20">
                    Kolkata → {city}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="post" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="post">Post Load</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests ({myPosts.length})</TabsTrigger>
            <TabsTrigger value="bids">View Bids</TabsTrigger>
            <TabsTrigger value="match">Smart Match</TabsTrigger>
          </TabsList>

          <TabsContent value="post" className="space-y-4">
            <PartLoadPostForm onSuccess={fetchMyPosts} />
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-foreground">My Part Load Requests</h2>
              <Button onClick={fetchMyPosts} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {loading ? (
              <Card className="p-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Loading your requests...</p>
              </Card>
            ) : myPosts.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Requests Yet</h3>
                <p className="text-muted-foreground mb-4">Post your first part-load to get started</p>
                <Button onClick={() => {
                  const postTab = document.querySelector('[value="post"]') as HTMLElement;
                  postTab?.click();
                }}>
                  Post Load Now
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                      selectedPost?.id === post.id ? 'border-2 border-primary' : ''
                    }`}
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{post.load_title}</h3>
                        <Badge variant={post.status === 'active' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Expected Rate</p>
                        <p className="text-2xl font-bold text-primary">
                          {post.expected_rate ? `₹${post.expected_rate.toLocaleString()}` : 'Open'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">From</p>
                          <p className="font-medium text-foreground">{post.pickup_location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">To</p>
                          <p className="font-medium text-foreground">{post.drop_location}</p>
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

                    {post.pickup_date && (
                      <div className="flex items-center gap-2 mt-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Pickup: {new Date(post.pickup_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {post.photos && post.photos.length > 0 && (
                      <div className="mt-3 flex gap-2">
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
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bids" className="space-y-4">
            {!selectedPost ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Select a request from "My Requests" tab to view bids</p>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="p-6 bg-muted">
                  <h3 className="font-semibold text-foreground mb-2">Viewing bids for:</h3>
                  <p className="text-lg text-foreground">{selectedPost.load_title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {postBids.length} {postBids.length === 1 ? 'bid' : 'bids'} received
                  </p>
                </Card>

                {postBids.length > 1 && (
                  <BidComparisonPanel
                    bids={postBids}
                    loadVolume={selectedPost.volume_cft}
                    onSelectBid={handleAcceptBid}
                  />
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  {postBids.map((bid) => (
                    <BidCard
                      key={bid.id}
                      bid={bid}
                      loadVolume={selectedPost.volume_cft}
                      onAccept={handleAcceptBid}
                      onReject={handleRejectBid}
                      isCustomer={true}
                    />
                  ))}
                </div>

                {postBids.length === 0 && (
                  <Card className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Bids Yet</h3>
                    <p className="text-muted-foreground">
                      Transporters will start bidding soon. You'll be notified when a new bid arrives.
                    </p>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="match" className="space-y-4">
            {!selectedPost ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Select a request from "My Requests" tab to find matching trucks</p>
              </Card>
            ) : (
              <TruckMatchPanel
                loadVolume={selectedPost.volume_cft}
                pickupLocation={selectedPost.pickup_location}
                dropLocation={selectedPost.drop_location}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}