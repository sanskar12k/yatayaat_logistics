import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ActiveBidsTicker from '@/components/ActiveBidsTicker';

const schema = z.object({
  load_type: z.string().min(1),
  pickup_pincode: z.string().min(4).max(6),
  pickup_landmark: z.string().optional(),
  drop_pincode: z.string().min(4).max(6),
  drop_landmark: z.string().optional(),
  loading_unloading_scope: z.string().optional(),
  vehicle_type: z.string().min(1),
  expected_rate: z.string().optional(),
  cargo_value: z.string().optional(),
  special_preferences: z.string().optional(),
  payment_terms: z.string().optional(),
  contact_name: z.string().min(2),
  contact_number: z.string().min(10),
  detention_clause: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function FTLBidding() {
  useEffect(() => {
    document.title = 'FTL Bidding Platform | Yatayaat Logistics';
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.from('bids').insert([{ 
        load_type: values.load_type,
        pickup_pincode: values.pickup_pincode,
        drop_pincode: values.drop_pincode,
        vehicle_type: values.vehicle_type,
        contact_name: values.contact_name,
        contact_number: values.contact_number,
        pickup_landmark: values.pickup_landmark,
        drop_landmark: values.drop_landmark,
        loading_unloading_scope: values.loading_unloading_scope,
        special_preferences: values.special_preferences,
        payment_terms: values.payment_terms,
        detention_clause: values.detention_clause,
        expected_rate: values.expected_rate ? parseFloat(values.expected_rate) : null,
        cargo_value: values.cargo_value ? parseFloat(values.cargo_value) : null,
      }]);
      if (error) throw error;
      toast.success('Bid submitted successfully!');
      reset();
    } catch (e) {
      console.error(e);
      toast.error('Failed to submit bid');
    }
  };

  return (
    <div className='min-h-screen'>
      <Header />
      <main className='container mx-auto px-4 py-12'>
        <div className='max-w-5xl mx-auto grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>FTL Bidding Platform</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='text-sm font-medium'>Load Type</label>
                      <Input placeholder='e.g., Pallets/Cartons/Bulk' {...register('load_type')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Vehicle Type Required</label>
                      <Input placeholder='e.g., 32ft MXL' {...register('vehicle_type')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Pickup Pincode</label>
                      <Input placeholder='e.g., 700046' {...register('pickup_pincode')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Pickup Landmark</label>
                      <Input placeholder='e.g., Park Street' {...register('pickup_landmark')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Drop Pincode</label>
                      <Input placeholder='e.g., 400001' {...register('drop_pincode')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Drop Landmark</label>
                      <Input placeholder='e.g., BKC' {...register('drop_landmark')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Loading/Unloading Scope</label>
                      <Input placeholder='e.g., Both at origin & destination' {...register('loading_unloading_scope')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Expected Rate (₹)</label>
                      <Input type='number' step='0.01' placeholder='e.g., 85000' {...register('expected_rate')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Cargo Value (₹)</label>
                      <Input type='number' step='0.01' placeholder='e.g., 2500000' {...register('cargo_value')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Payment Terms</label>
                      <Input placeholder='e.g., 15 days' {...register('payment_terms')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Contact Person</label>
                      <Input placeholder='Your name' {...register('contact_name')} />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Contact Number</label>
                      <Input placeholder='Your phone' {...register('contact_number')} />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='text-sm font-medium'>Detention Clause</label>
                      <Input placeholder='e.g., ₹1000/hr after 8 hours free' {...register('detention_clause')} />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='text-sm font-medium'>Any Special Preference / Clause</label>
                      <Textarea rows={3} placeholder='Any preference or special requirement' {...register('special_preferences')} />
                    </div>
                  </div>
                  <Button type='submit' disabled={isSubmitting} className='w-full'>Submit Bid</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Premium Corridors from Kolkata</CardTitle>
              </CardHeader>
              <CardContent className='grid md:grid-cols-2 gap-3'>
                {['Mumbai','Delhi','Bangalore','Chennai','Hyderabad','Pune','Guwahati'].map(c => (
                  <div key={c} className='p-3 rounded bg-muted'>{c} • Guaranteed delivery & priority handling</div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <ActiveBidsTicker />
            <Card>
              <CardHeader>
                <CardTitle>Why Bid with Us?</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>• Transparent marketplace with verified transporters</p>
                <p>• Priority lanes from Kolkata to major metros</p>
                <p>• Real-time updates and dedicated support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
