import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X, Package } from "lucide-react";

interface PartLoadPostFormProps {
  onSuccess?: () => void;
}

export function PartLoadPostForm({ onSuccess }: PartLoadPostFormProps) {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    load_title: '',
    pickup_location: '',
    pickup_pincode: '',
    drop_location: '',
    drop_pincode: '',
    weight_kg: '',
    volume_cft: '',
    goods_type: '',
    load_description: '',
    expected_rate: '',
    pickup_date: '',
    special_requirements: '',
    contact_person: '',
    contact_number: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to post a load');
        return;
      }

      // Upload photos
      const photoUrls = await uploadPhotos(user.id);

      const { error } = await sb.from('part_load_posts').insert([{
        customer_id: user.id,
        load_title: formData.load_title,
        pickup_location: formData.pickup_location,
        pickup_pincode: formData.pickup_pincode,
        drop_location: formData.drop_location,
        drop_pincode: formData.drop_pincode,
        weight_kg: parseFloat(formData.weight_kg),
        volume_cft: parseFloat(formData.volume_cft),
        goods_type: formData.goods_type,
        load_description: formData.load_description,
        expected_rate: formData.expected_rate ? parseFloat(formData.expected_rate) : null,
        pickup_date: formData.pickup_date || null,
        special_requirements: formData.special_requirements || null,
        contact_person: formData.contact_person,
        contact_number: formData.contact_number,
        photos: photoUrls
      }]);

      if (error) throw error;

      toast.success('Part load posted successfully! Transporters will start bidding soon.');
      
      // Reset form
      setFormData({
        load_title: '',
        pickup_location: '',
        pickup_pincode: '',
        drop_location: '',
        drop_pincode: '',
        weight_kg: '',
        volume_cft: '',
        goods_type: '',
        load_description: '',
        expected_rate: '',
        pickup_date: '',
        special_requirements: '',
        contact_person: '',
        contact_number: ''
      });
      setPhotos([]);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error posting load:', error);
      toast.error('Failed to post load');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Post Part Load</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Load Title *</Label>
          <Input
            value={formData.load_title}
            onChange={(e) => setFormData({ ...formData, load_title: e.target.value })}
            placeholder="e.g., Furniture moving from Mumbai to Delhi"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Pickup Location *</Label>
            <Input
              value={formData.pickup_location}
              onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
              placeholder="City, Landmark"
              required
            />
          </div>
          <div>
            <Label>Pickup Pincode *</Label>
            <Input
              value={formData.pickup_pincode}
              onChange={(e) => setFormData({ ...formData, pickup_pincode: e.target.value })}
              placeholder="400001"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Drop Location *</Label>
            <Input
              value={formData.drop_location}
              onChange={(e) => setFormData({ ...formData, drop_location: e.target.value })}
              placeholder="City, Landmark"
              required
            />
          </div>
          <div>
            <Label>Drop Pincode *</Label>
            <Input
              value={formData.drop_pincode}
              onChange={(e) => setFormData({ ...formData, drop_pincode: e.target.value })}
              placeholder="110001"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Weight (kg) *</Label>
            <Input
              type="number"
              value={formData.weight_kg}
              onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
              placeholder="500"
              required
            />
          </div>
          <div>
            <Label>Volume (cubic feet) *</Label>
            <Input
              type="number"
              value={formData.volume_cft}
              onChange={(e) => setFormData({ ...formData, volume_cft: e.target.value })}
              placeholder="100"
              required
            />
          </div>
          <div>
            <Label>Pickup Date</Label>
            <Input
              type="date"
              value={formData.pickup_date}
              onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Goods Type *</Label>
          <Select value={formData.goods_type} onValueChange={(value) => setFormData({ ...formData, goods_type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select goods type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="industrial">Industrial Equipment</SelectItem>
              <SelectItem value="vehicles">Vehicles/Parts</SelectItem>
              <SelectItem value="household">Household Items</SelectItem>
              <SelectItem value="commercial">Commercial Goods</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Load Description</Label>
          <Textarea
            value={formData.load_description}
            onChange={(e) => setFormData({ ...formData, load_description: e.target.value })}
            placeholder="Describe your load in detail..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Contact Person *</Label>
            <Input
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <Label>Contact Number *</Label>
            <Input
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              placeholder="+91 9876543210"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Expected Rate (₹)</Label>
            <Input
              type="number"
              value={formData.expected_rate}
              onChange={(e) => setFormData({ ...formData, expected_rate: e.target.value })}
              placeholder="15000"
            />
          </div>
          <div>
            <Label>Special Requirements</Label>
            <Input
              value={formData.special_requirements}
              onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
              placeholder="e.g., Need insurance, Time-sensitive"
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <Label>Upload Photos (Max 5, 2MB each)</Label>
          <div className="mt-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
              disabled={photos.length >= 5}
            />
            <label htmlFor="photo-upload">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={photos.length >= 5}
                onClick={() => document.getElementById('photo-upload')?.click()}
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Posting...' : 'Post Part Load'}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Your post will be visible to transporters for 24 hours. You'll receive bids shortly.
        </p>
      </form>
    </Card>
  );
}