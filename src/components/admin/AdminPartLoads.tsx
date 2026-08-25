import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Package, MapPin, TrendingUp, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminPartLoads() {
  const [posts, setPosts] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const sb = supabase as any;

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let postsQuery = sb.from('part_load_posts').select('*').order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        postsQuery = postsQuery.eq('status', filter);
      }

      const [postsResult, bidsResult] = await Promise.all([
        postsQuery,
        sb.from('part_load_bids').select('*, part_load_posts(load_title)').order('created_at', { ascending: false })
      ]);

      if (postsResult.error) throw postsResult.error;
      if (bidsResult.error) throw bidsResult.error;

      setPosts(postsResult.data || []);
      setBids(bidsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch part load data');
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (id: string, status: string) => {
    try {
      const { error } = await sb
        .from('part_load_posts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const updateBidStatus = async (id: string, status: string) => {
    try {
      const { error } = await sb
        .from('part_load_bids')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.success('Bid status updated');
      fetchData();
    } catch (error) {
      console.error('Error updating bid status:', error);
      toast.error('Failed to update bid status');
    }
  };

  const stats = {
    totalPosts: posts.length,
    activePosts: posts.filter(p => p.status === 'active').length,
    totalBids: bids.length,
    pendingBids: bids.filter(b => b.status === 'pending').length,
    acceptedBids: bids.filter(b => b.status === 'accepted').length
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Part Load Management</h2>
          <p className="text-muted-foreground">Manage customer posts and transporter bids</p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalPosts}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Posts</p>
          <p className="text-2xl font-bold text-primary">{stats.activePosts}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Bids</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalBids}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending Bids</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingBids}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Accepted Bids</p>
          <p className="text-2xl font-bold text-green-600">{stats.acceptedBids}</p>
        </Card>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Load Posts</TabsTrigger>
          <TabsTrigger value="bids">Bids</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{post.load_title}</h3>
                      <p className="text-sm text-muted-foreground">{post.goods_type}</p>
                    </div>
                    <Select
                      value={post.status}
                      onValueChange={(value) => updatePostStatus(post.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
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

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Rate</p>
                      <p className="text-lg font-semibold text-primary">
                        {post.expected_rate ? `₹${post.expected_rate.toLocaleString()}` : 'Open'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="text-sm font-medium text-foreground">{post.contact_person}</p>
                      <p className="text-sm text-muted-foreground">{post.contact_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Posted: {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <Card className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No posts found</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bids" className="space-y-4">
          <div className="grid gap-4">
            {bids.map((bid) => (
              <Card key={bid.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{bid.truck_type}</h3>
                      <p className="text-sm text-muted-foreground">
                        For: {bid.part_load_posts?.load_title || 'Unknown Post'}
                      </p>
                    </div>
                    <Select
                      value={bid.status}
                      onValueChange={(value) => updateBidStatus(bid.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Quoted Rate</p>
                      <p className="text-xl font-bold text-primary">₹{bid.quoted_rate.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Space</p>
                      <p className="text-lg font-semibold text-foreground">{bid.available_space_cft} ft³</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Compatibility</p>
                      <Badge variant={bid.compatibility_score >= 90 ? 'default' : 'secondary'}>
                        {bid.compatibility_score ? `${bid.compatibility_score.toFixed(0)}%` : 'N/A'}
                      </Badge>
                    </div>
                  </div>

                  {bid.remarks && (
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                      {bid.remarks}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Bid placed: {new Date(bid.created_at).toLocaleString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {bids.length === 0 && (
            <Card className="p-8 text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No bids found</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}