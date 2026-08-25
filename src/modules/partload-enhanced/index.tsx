import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedTruckVisualizer } from "./EnhancedTruckVisualizer";
import { RealTimeBiddingPanel } from "./RealTimeBiddingPanel";
import { Package, Truck, Zap, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function EnhancedPartLoadModule() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sb = supabase as any;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await sb
        .from('part_load_posts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      if (data && data.length > 0) {
        setSelectedPost(data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Zap className="h-10 w-10 text-orange-500" />
            Enhanced Part Load Platform
          </h1>
          <p className="text-lg text-muted-foreground">
            Visual bidding with real-time truck space matching
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Posts List */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Active Loads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  </div>
                ) : posts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No active loads</p>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedPost?.id === post.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <h4 className="font-semibold text-foreground">{post.load_title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <MapPin className="h-3 w-3" />
                        {post.pickup_location} → {post.drop_location}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary">{post.volume_cft || 0} ft³</Badge>
                        {post.expected_rate && (
                          <span className="text-sm font-medium text-primary">
                            ₹{post.expected_rate.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Visual Bidding */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPost ? (
              <>
                {/* Truck Space Visualizer */}
                <EnhancedTruckVisualizer
                  totalCapacity={500}
                  usedCapacity={selectedPost.volume_cft || 100}
                  truckType="24ft Container"
                  materialPhotos={selectedPost.material_photos || []}
                  editable={false}
                />

                {/* Real-Time Bidding */}
                <RealTimeBiddingPanel
                  postId={selectedPost.id}
                  expectedRate={selectedPost.expected_rate}
                  onBidAccepted={(bidId) => {
                    toast.success('Bid accepted! Transporter will be notified.');
                  }}
                />
              </>
            ) : (
              <Card className="p-8 text-center">
                <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Select a Load</h3>
                <p className="text-muted-foreground">Choose a load from the list to view bidding details</p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}