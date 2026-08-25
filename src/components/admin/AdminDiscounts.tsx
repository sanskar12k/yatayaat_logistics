import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface DiscountRequest {
  id: string;
  customer_name: string;
  discount_percentage: number;
  order_value: number;
  reason: string;
  status: string;
  created_at: string;
}

export function AdminDiscounts() {
  const [requests, setRequests] = useState<DiscountRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('discount_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch discount requests');
      console.error(error);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('discount_requests')
      .update({ 
        status, 
        approved_by: user?.id,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Discount ${status}`);
      fetchRequests();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Discount Approvals</h2>
        <p className="text-muted-foreground">Review and approve discount requests</p>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-foreground">{request.customer_name}</h3>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="ml-2 font-medium">{request.discount_percentage}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Order Value:</span>
                    <span className="ml-2 font-medium">₹{Number(request.order_value).toLocaleString()}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Discount Amount:</span>
                    <span className="ml-2 font-medium text-primary">
                      ₹{((Number(request.order_value) * Number(request.discount_percentage)) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Reason:</p>
                  <p className="text-sm mt-1">{request.reason}</p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Requested: {new Date(request.created_at).toLocaleString()}
                </p>
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => updateStatus(request.id, 'approved')}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(request.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No discount requests yet</p>
        </div>
      )}
    </div>
  );
}