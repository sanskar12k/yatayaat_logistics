import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Bid { id: string; load_type: string; pickup_pincode: string; drop_pincode: string; vehicle_type: string; expected_rate: number | null; status: string; created_at: string; contact_name: string; contact_number: string; }

export function AdminBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase.from('bids').select('*').order('created_at', { ascending: false });
    if (error) { toast.error('Failed to load bids'); return; }
    setBids(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bids').update({ status }).eq('id', id);
    if (error) { toast.error('Update failed'); return; }
    toast.success('Status updated');
    load();
  };

  if (loading) return <div>Loading bids...</div>;

  return (
    <div className='space-y-4'>
      <div>
        <h2 className='text-2xl font-bold'>FTL Bids</h2>
        <p className='text-muted-foreground'>Manage incoming full-truckload bidding requests</p>
      </div>
      {bids.map(b => (
        <Card key={b.id}>
          <CardHeader>
            <CardTitle>#{b.id.slice(0,8)} • {b.load_type} • {b.vehicle_type}</CardTitle>
            <CardDescription>{b.pickup_pincode} → {b.drop_pincode} • Contact: {b.contact_name} ({b.contact_number})</CardDescription>
          </CardHeader>
          <CardContent className='flex items-center justify-between'>
            <div className='text-sm'>Expected Rate: {b.expected_rate ? `₹${b.expected_rate.toLocaleString()}` : '—'}</div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => updateStatus(b.id, 'open')}>Open</Button>
              <Button onClick={() => updateStatus(b.id, 'closed')}>Close</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {bids.length === 0 && (
        <Card><CardContent className='p-6 text-center text-muted-foreground'>No bids yet.</CardContent></Card>
      )}
    </div>
  );
}
