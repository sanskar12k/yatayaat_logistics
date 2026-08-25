import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Calendar, DollarSign, Package, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Bid {
  id: string;
  quoted_rate: number;
  truck_type: string;
  available_space_cft: number;
  truck_photos: string[] | null;
  remarks: string | null;
  route_details: string | null;
  compatibility_score: number | null;
  status: string;
  created_at: string;
}

interface BidCardProps {
  bid: Bid;
  loadVolume?: number;
  onAccept?: (bidId: string) => void;
  onReject?: (bidId: string) => void;
  isCustomer?: boolean;
}

export function BidCard({ bid, loadVolume, onAccept, onReject, isCustomer = false }: BidCardProps) {
  const [showPhotos, setShowPhotos] = useState(false);

  const getStatusBadge = () => {
    switch (bid.status) {
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{bid.status}</Badge>;
    }
  };

  const getCompatibilityColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-lg text-foreground">{bid.truck_type}</h3>
              <p className="text-sm text-muted-foreground">
                {bid.available_space_cft} ft³ Available
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Compatibility Score */}
        {bid.compatibility_score && (
          <div className={`flex items-center justify-center p-3 rounded-lg bg-muted ${getCompatibilityColor(bid.compatibility_score)}`}>
            <Package className="h-5 w-5 mr-2" />
            <span className="font-semibold">
              {bid.compatibility_score.toFixed(0)}% Match Score
            </span>
            {bid.compatibility_score >= 90 && <span className="ml-2">🎯 Perfect Fit!</span>}
          </div>
        )}

        {/* Quoted Rate */}
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Quoted Rate</span>
          </div>
          <span className="text-2xl font-bold text-primary">
            ₹{bid.quoted_rate.toLocaleString()}
          </span>
        </div>

        {/* Route Details */}
        {bid.route_details && (
          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Route Details</p>
              <p className="text-sm text-muted-foreground">{bid.route_details}</p>
            </div>
          </div>
        )}

        {/* Remarks */}
        {bid.remarks && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground mb-1">Transporter Remarks</p>
            <p className="text-sm text-muted-foreground">{bid.remarks}</p>
          </div>
        )}

        {/* Truck Photos */}
        {bid.truck_photos && bid.truck_photos.length > 0 && (
          <Dialog open={showPhotos} onOpenChange={setShowPhotos}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <ImageIcon className="h-4 w-4 mr-2" />
                View Truck Photos ({bid.truck_photos.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Truck & Space Photos</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {bid.truck_photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Truck photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Bid Timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Bid placed: {new Date(bid.created_at).toLocaleString()}</span>
        </div>

        {/* Action Buttons for Customer */}
        {isCustomer && bid.status === 'pending' && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <Button
              variant="outline"
              onClick={() => onReject && onReject(bid.id)}
              className="w-full"
            >
              Reject
            </Button>
            <Button
              onClick={() => onAccept && onAccept(bid.id)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Accept Bid
            </Button>
          </div>
        )}

        {/* Load fit visualization */}
        {loadVolume && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Your Load vs Available Space</p>
            <div className="relative h-6 bg-background rounded overflow-hidden border">
              <div
                className="absolute left-0 top-0 h-full bg-primary"
                style={{ width: `${Math.min((loadVolume / bid.available_space_cft) * 100, 100)}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {loadVolume} ft³ / {bid.available_space_cft} ft³
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}