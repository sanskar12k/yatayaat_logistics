import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Bid { id: string; pickup_pincode: string; drop_pincode: string; created_at: string; }

export default function ActiveBidsTicker() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [index, setIndex] = useState(0);

  const load = async () => {
    const { data } = await supabase
      .from('bids')
      .select('id,pickup_pincode,drop_pincode,created_at')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(10);
    setBids(data || []);
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % Math.max(1, (bids?.length || 1)));
    }, 3000);
    const channel = supabase
      .channel('bids')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bids' }, () => load())
      .subscribe();
    return () => { clearInterval(interval); supabase.removeChannel(channel); };
  }, [bids?.length]);

  const current = bids[index];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Bids</CardTitle>
      </CardHeader>
      <CardContent>
        {current ? (
          <div className='text-sm'>
            <div className='font-medium'>Bid #{current.id.slice(0, 8)}</div>
            <div>From {current.pickup_pincode} → {current.drop_pincode}</div>
            <div className='text-muted-foreground'>Posted {new Date(current.created_at).toLocaleString()}</div>
          </div>
        ) : (
          <div className='text-sm text-muted-foreground'>No active bids yet. Be the first to post!</div>
        )}
      </CardContent>
    </Card>
  );
}
