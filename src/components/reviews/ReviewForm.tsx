import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewFormProps {
  onSuccess?: () => void;
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    reviewerName: "",
    rating: 5,
    reviewText: "",
    serviceType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (!formData.reviewerName || !formData.reviewText || !formData.serviceType) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const sb = supabase as any;
      const { error } = await sb
        .from("reviews")
        .insert({
          user_id: user.id,
          reviewer_name: formData.reviewerName,
          rating: formData.rating,
          review_text: formData.reviewText,
          service_type: formData.serviceType,
        });

      if (error) throw error;

      toast.success("Review submitted successfully!");
      setFormData({
        reviewerName: "",
        rating: 5,
        reviewText: "",
        serviceType: "",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reviewerName">Your Name</Label>
            <Input
              id="reviewerName"
              value={formData.reviewerName}
              onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FTL Shipment">FTL Shipment</SelectItem>
                <SelectItem value="Part Load">Part Load</SelectItem>
                <SelectItem value="Courier">Courier</SelectItem>
                <SelectItem value="Packers & Movers">Packers & Movers</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Rating</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= formData.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="reviewText">Your Review</Label>
            <Textarea
              id="reviewText"
              value={formData.reviewText}
              onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
              placeholder="Share your experience..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}