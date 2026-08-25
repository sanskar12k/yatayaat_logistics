import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Quote {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  service_type: string;
  origin: string;
  destination: string;
  weight: number | null;
  dimensions: string | null;
  shipment_value: number | null;
  quantity: number | null;
  special_requirements: string | null;
  preferences: string | null;
  status: string;
  created_at: string;
}

export const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status updated successfully');
      fetchQuotes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      reviewed: "secondary",
      quoted: "default",
      closed: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const viewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quote Requests</CardTitle>
          <CardDescription>
            Manage customer quote requests and update their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No quote requests yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{quote.customer_name}</p>
                          {quote.company_name && (
                            <p className="text-sm text-muted-foreground">{quote.company_name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{quote.service_type}</TableCell>
                      <TableCell className="text-sm">
                        {quote.origin} → {quote.destination}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <a href={`mailto:${quote.email}`} className="text-sm flex items-center gap-1 hover:text-primary">
                            <Mail className="w-3 h-3" />
                            {quote.email}
                          </a>
                          <a href={`tel:${quote.phone}`} className="text-sm flex items-center gap-1 hover:text-primary">
                            <Phone className="w-3 h-3" />
                            {quote.phone}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewDetails(quote)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select
                            value={quote.status}
                            onValueChange={(value) => updateStatus(quote.id, value)}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="quoted">Quoted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedQuote && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Quote Request Details</DialogTitle>
              <DialogDescription>
                Submitted on {new Date(selectedQuote.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Customer Name</p>
                  <p className="text-sm text-muted-foreground">{selectedQuote.customer_name}</p>
                </div>
                {selectedQuote.company_name && (
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{selectedQuote.company_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{selectedQuote.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{selectedQuote.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Service Type</p>
                  <p className="text-sm text-muted-foreground">{selectedQuote.service_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  {getStatusBadge(selectedQuote.status)}
                </div>
                <div>
                  <p className="text-sm font-medium">Origin</p>
                  <p className="text-sm text-muted-foreground">{selectedQuote.origin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-sm text-muted-foreground">{selectedQuote.destination}</p>
                </div>
                {selectedQuote.weight && (
                  <div>
                    <p className="text-sm font-medium">Weight</p>
                    <p className="text-sm text-muted-foreground">{selectedQuote.weight} kg</p>
                  </div>
                )}
                {selectedQuote.dimensions && (
                  <div>
                    <p className="text-sm font-medium">Dimensions</p>
                    <p className="text-sm text-muted-foreground">{selectedQuote.dimensions}</p>
                  </div>
                )}
                {selectedQuote.shipment_value && (
                  <div>
                    <p className="text-sm font-medium">Shipment Value</p>
                    <p className="text-sm text-muted-foreground">₹{selectedQuote.shipment_value}</p>
                  </div>
                )}
                {selectedQuote.quantity && (
                  <div>
                    <p className="text-sm font-medium">Quantity</p>
                    <p className="text-sm text-muted-foreground">{selectedQuote.quantity} pieces</p>
                  </div>
                )}
              </div>
              
              {selectedQuote.special_requirements && (
                <div>
                  <p className="text-sm font-medium mb-2">Special Requirements</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded">
                    {selectedQuote.special_requirements}
                  </p>
                </div>
              )}
              
              {selectedQuote.preferences && (
                <div>
                  <p className="text-sm font-medium mb-2">Preferences / Additional Info</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded">
                    {selectedQuote.preferences}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
