import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X } from "lucide-react";

interface DocketFormProps {
  docket: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function DocketForm({ docket, onClose, onSuccess }: DocketFormProps) {
  const [loading, setLoading] = useState(false);
  const [gstRates, setGstRates] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    docket_type: docket?.docket_type || "packers_movers",
    customer_name: docket?.customer_name || "",
    customer_phone: docket?.customer_phone || "",
    customer_email: docket?.customer_email || "",
    customer_address: docket?.customer_address || "",
    origin: docket?.origin || "",
    destination: docket?.destination || "",
    distance_km: docket?.distance_km || "",
    pickup_date: docket?.pickup_date || "",
    delivery_date: docket?.delivery_date || "",
    vehicle_type: docket?.vehicle_type || "",
    vehicle_number: docket?.vehicle_number || "",
    driver_name: docket?.driver_name || "",
    driver_phone: docket?.driver_phone || "",
    item_description: docket?.item_description || "",
    quantity: docket?.quantity || "",
    weight_kg: docket?.weight_kg || "",
    volume_cbm: docket?.volume_cbm || "",
    declared_value: docket?.declared_value || "",
    base_amount: docket?.base_amount || "",
    gst_percentage: docket?.gst_percentage || "18.00",
    payment_mode: docket?.payment_mode || "cash",
    status: docket?.status || "pending",
    notes: docket?.notes || "",
  });

  useEffect(() => {
    fetchGSTRates();
  }, []);

  const fetchGSTRates = async () => {
    const { data } = await supabase
      .from("gst_rates")
      .select("*")
      .eq("is_active", true);
    if (data) setGstRates(data);
  };

  const calculateGST = () => {
    const base = parseFloat(formData.base_amount) || 0;
    const gst = parseFloat(formData.gst_percentage) || 0;
    const gstAmount = (base * gst) / 100;
    const total = base + gstAmount;
    return { gstAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { gstAmount, total } = calculateGST();
      const { data: { user } } = await supabase.auth.getUser();

      const docketData = {
        ...formData,
        docket_number: docket?.docket_number || `DKT-${Date.now()}`,
        gst_amount: gstAmount,
        total_amount: total,
        balance_due: total - (parseFloat(formData.base_amount) || 0),
        created_by: user?.id,
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        volume_cbm: formData.volume_cbm ? parseFloat(formData.volume_cbm) : null,
        declared_value: formData.declared_value ? parseFloat(formData.declared_value) : null,
        base_amount: parseFloat(formData.base_amount),
        gst_percentage: parseFloat(formData.gst_percentage),
      };

      if (docket) {
        const { error } = await supabase
          .from("dockets")
          .update(docketData)
          .eq("id", docket.id);
        if (error) throw error;
        toast.success("Docket updated successfully");
      } else {
        const { error } = await supabase.from("dockets").insert([docketData]);
        if (error) throw error;
        toast.success("Docket created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving docket:", error);
      toast.error("Failed to save docket");
    } finally {
      setLoading(false);
    }
  };

  const { gstAmount, total } = calculateGST();

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{docket ? "Edit Docket" : "Create New Docket"}</CardTitle>
            <CardDescription>Fill in the docket details below</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="docket_type">Docket Type *</Label>
              <Select value={formData.docket_type} onValueChange={(value) => setFormData({ ...formData, docket_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="packers_movers">Packers & Movers</SelectItem>
                  <SelectItem value="ptl_ftl">PTL/FTL</SelectItem>
                  <SelectItem value="other_services">Other Services</SelectItem>
                  <SelectItem value="courier_ecommerce">Courier/E-commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_phone">Customer Phone *</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_email">Customer Email</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="customer_address">Customer Address *</Label>
              <Input
                id="customer_address"
                value={formData.customer_address}
                onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance_km">Distance (KM)</Label>
              <Input
                id="distance_km"
                type="number"
                step="0.01"
                value={formData.distance_km}
                onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_date">Pickup Date *</Label>
              <Input
                id="pickup_date"
                type="date"
                value={formData.pickup_date}
                onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item_description">Item Description</Label>
              <Input
                id="item_description"
                value={formData.item_description}
                onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_kg">Weight (KG)</Label>
              <Input
                id="weight_kg"
                type="number"
                step="0.01"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_amount">Base Amount (₹) *</Label>
              <Input
                id="base_amount"
                type="number"
                step="0.01"
                value={formData.base_amount}
                onChange={(e) => setFormData({ ...formData, base_amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gst_percentage">GST % *</Label>
              <Select value={formData.gst_percentage} onValueChange={(value) => setFormData({ ...formData, gst_percentage: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gstRates.map((rate) => (
                    <SelectItem key={rate.id} value={rate.gst_percentage.toString()}>
                      {rate.gst_percentage}% - {rate.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Base Amount:</span>
              <span className="font-medium">₹{parseFloat(formData.base_amount || "0").toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST ({formData.gst_percentage}%):</span>
              <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total Amount:</span>
              <span className="text-primary">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : docket ? "Update Docket" : "Create Docket"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
