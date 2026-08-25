import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X, Send } from "lucide-react";

interface BidSubmissionFormProps {
  post: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BidSubmissionForm({ post, onSuccess, onCancel }: BidSubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    quoted_rate: '',
    truck_type: '',
    available_space_cft: '',
    route_details: '',
    remarks: ''
  });

  const sb = supabase as any;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 5 - photos.length);
      setPhotos([...photos, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('part-load-photos')
        .upload(fileName, photo, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from('part-load-photos')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  const calculateCompatibility = () => {
    const loadVolume = post.volume_cft;
    const availableSpace = parseFloat(formData.available_space_cft);
    
    if (availableSpace < loadVolume) return 0;
    
    const utilization = (loadVolume / availableSpace) * 100;
    return Math.max(0, 100 - Math.abs(utilization - 80));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to submit a bid');
        return;
      }

      // Upload photos
      const photoUrls = await uploadPhotos(user.id);
      const compatibility = calculateCompatibility();

      const { error } = await sb.from('part_load_bids').insert([{
        post_id: post.id,
        transporter_id: user.id,
        quoted_rate: parseFloat(formData.quoted_rate),
        truck_type: formData.truck_type,
        available_space_cft: parseFloat(formData.available_space_cft),
        route_details: formData.route_details || null,
        remarks: formData.remarks || null,
        truck_photos: photoUrls.length > 0 ? photoUrls : null,
        compatibility_score: compatibility,
        status: 'pending'
      }]);

      if (error) throw error;

      toast.success('Bid submitted successfully! The customer will be notified.');
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-foreground mb-4">Submit Your Bid</h3>
      
      {/* Post Summary */}
      <div className="mb-4 p-3 bg-muted rounded-lg">
        <p className="text-sm font-semibold text-foreground">{post.load_title}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {post.pickup_location} → {post.drop_location}
        </p>
        <p className="text-xs text-muted-foreground">
          Load: {post.weight_kg} kg / {post.volume_cft} ft³
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Your Quoted Rate (₹) *</Label>
            <Input
              type="number"
              value={formData.quoted_rate}
              onChange={(e) => setFormData({ ...formData, quoted_rate: e.target.value })}
              placeholder="15000"
              required
            />
          </div>

          <div>
            <Label>Truck Type *</Label>
            <Select value={formData.truck_type} onValueChange={(value) => setFormData({ ...formData, truck_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select truck type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mini Truck (7ft)">Mini Truck (7ft)</SelectItem>
                <SelectItem value="Tata Ace (8ft)">Tata Ace (8ft)</SelectItem>
                <SelectItem value="Pickup (8ft)">Pickup (8ft)</SelectItem>
                <SelectItem value="Canter (14ft)">Canter (14ft)</SelectItem>
                <SelectItem value="Canter (17ft)">Canter (17ft)</SelectItem>
                <SelectItem value="Canter (19ft)">Canter (19ft)</SelectItem>
                <SelectItem value="Container (20ft)">Container (20ft)</SelectItem>
                <SelectItem value="Container (32ft)">Container (32ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Available Space in Your Truck (ft³) *</Label>
          <Input
            type="number"
            value={formData.available_space_cft}
            onChange={(e) => setFormData({ ...formData, available_space_cft: e.target.value })}
            placeholder="Enter available cubic feet"
            required
          />
          {formData.available_space_cft && (
            <p className="text-xs text-muted-foreground mt-1">
              Compatibility: {calculateCompatibility().toFixed(0)}% 
              {calculateCompatibility() >= 90 && ' 🎯 Perfect fit!'}
            </p>
          )}
        </div>

        <div>
          <Label>Route Details</Label>
          <Input
            value={formData.route_details}
            onChange={(e) => setFormData({ ...formData, route_details: e.target.value })}
            placeholder="e.g., Via NH44, Will stop at Nagpur"
          />
        </div>

        <div>
          <Label>Remarks / Special Notes</Label>
          <Textarea
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="Any additional information for the customer..."
            rows={3}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <Label>Upload Truck/Space Photos (Max 5)</Label>
          <div className="mt-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
              id="bid-photo-upload"
              disabled={photos.length >= 5}
            />
            <label htmlFor="bid-photo-upload">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={photos.length >= 5}
                onClick={() => document.getElementById('bid-photo-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos ({photos.length}/5)
              </Button>
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Submitting...' : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Bid
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
