import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingDown, TrendingUp, Users, Zap } from "lucide-react";
import { toast } from "sonner";

interface Bid {
  id: string;
  quoted_rate: number;
  truck_type: string;
  transporter_id: string;
  created_at: string;
  status: string;
}

interface RealTimeBiddingPanelProps {
  postId: string;
  expectedRate?: number;
  onBidAccepted?: (bidId: string) => void;
}

export function RealTimeBiddingPanel({ postId, expectedRate, onBidAccepted }: RealTimeBiddingPanelProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour default

  const sb = supabase as any;

  useEffect(() => {
    fetchBids();
    
    // Real-time subscription
    const channel = supabase
      .channel(`realtime-bids-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'part_load_bids',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBids(prev => [payload.new as Bid, ...prev]);
            toast.success('New bid received!');
          } else if (payload.eventType === 'UPDATE') {
            setBids(prev => prev.map(b => b.id === payload.new.id ? payload.new as Bid : b));
          }
        }
      )
      .subscribe();

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, [postId]);

  const fetchBids = async () => {
    try {
      const { data, error } = await sb
        .from('part_load_bids')
        .select('*')
        .eq('post_id', postId)
        .order('quoted_rate', { ascending: true });

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const lowestBid = bids.length > 0 ? Math.min(...bids.map(b => b.quoted_rate)) : 0;
  const highestBid = bids.length > 0 ? Math.max(...bids.map(b => b.quoted_rate)) : 0;
  const avgBid = bids.length > 0 ? bids.reduce((sum, b) => sum + b.quoted_rate, 0) / bids.length : 0;

  const handleAcceptBid = async (bidId: string) => {
    try {
      const { error } = await sb
        .from('part_load_bids')
        .update({ status: 'accepted' })
        .eq('id', bidId);

      if (error) throw error;
      
      toast.success('Bid accepted!');
      if (onBidAccepted) onBidAccepted(bidId);
    } catch (error) {
      toast.error('Failed to accept bid');
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Real-Time Bidding
          </CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-lg font-bold text-foreground">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{bids.length}</p>
            <p className="text-xs text-muted-foreground">Total Bids</p>
          </div>
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <TrendingDown className="h-5 w-5 mx-auto text-green-500 mb-1" />
            <p className="text-2xl font-bold text-green-600">₹{lowestBid.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Lowest Bid</p>
          </div>
          <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
            <span className="text-2xl font-bold text-yellow-600">₹{avgBid.toLocaleString()}</span>
            <p className="text-xs text-muted-foreground">Average</p>
          </div>
          <div className="text-center p-3 bg-red-500/10 rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto text-red-500 mb-1" />
            <p className="text-2xl font-bold text-red-600">₹{highestBid.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Highest Bid</p>
          </div>
        </div>

        {/* Price Comparison Bar */}
        {expectedRate && bids.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bid Range</span>
              <span className="text-muted-foreground">Expected: ₹{expectedRate.toLocaleString()}</span>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-gradient-to-r from-green-500 to-red-500"
                style={{ width: '100%' }}
              />
              {expectedRate && (
                <div 
                  className="absolute h-full w-1 bg-primary"
                  style={{ 
                    left: `${Math.min(100, Math.max(0, ((expectedRate - lowestBid) / (highestBid - lowestBid)) * 100))}%` 
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Live Bids List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </div>
          ) : bids.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Waiting for bids...</p>
            </div>
          ) : (
            bids.map((bid, index) => (
              <div 
                key={bid.id}
                className={`p-4 rounded-lg border transition-all ${
                  index === 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-foreground">
                        ₹{bid.quoted_rate.toLocaleString()}
                      </span>
                      {index === 0 && (
                        <Badge className="bg-green-500 text-white">Lowest</Badge>
                      )}
                      {bid.status === 'accepted' && (
                        <Badge className="bg-primary text-primary-foreground">Accepted</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{bid.truck_type}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(bid.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  {bid.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleAcceptBid(bid.id)}
                      variant={index === 0 ? "default" : "outline"}
                    >
                      Accept
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}