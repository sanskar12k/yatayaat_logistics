import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

const quoteFormSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  company_name: z.string().optional(),
  service_type: z.string().min(1, "Please select a service"),
  origin: z.string().min(2, "Origin is required"),
  destination: z.string().min(2, "Destination is required"),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  shipment_value: z.string().optional(),
  quantity: z.string().optional(),
  special_requirements: z.string().optional(),
  preferences: z.string().optional(),
});

interface QuoteRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string;
}

export const QuoteRequestForm = ({ open, onOpenChange, defaultService }: QuoteRequestFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof quoteFormSchema>>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      service_type: defaultService || "",
      customer_name: "",
      email: "",
      phone: "",
      company_name: "",
      origin: "",
      destination: "",
      weight: "",
      dimensions: "",
      shipment_value: "",
      quantity: "",
      special_requirements: "",
      preferences: "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('quote-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        return { name: file.name, url: filePath };
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles([...uploadedFiles, ...results]);
      toast.success(`${results.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof quoteFormSchema>) => {
    setSubmitting(true);
    try {
      const quoteData = {
        customer_name: values.customer_name,
        email: values.email,
        phone: values.phone,
        company_name: values.company_name || null,
        service_type: values.service_type,
        origin: values.origin,
        destination: values.destination,
        weight: values.weight ? parseFloat(values.weight) : null,
        // dimensions: values.dimensions || null,
        shipment_value: values.shipment_value ? parseFloat(values.shipment_value) : null,
        // quantity: values.quantity ? parseInt(values.quantity) : null,
        special_requirements: values.special_requirements || null,
        // preferences: `${values.preferences || ''}\n\nAttached files: ${uploadedFiles.map(f => f.name).join(', ')}`,
      };

      const { error } = await supabase
        .from('quote_requests')
        .insert([quoteData]);

      if (error) throw error;

      toast.success('Quote request submitted successfully! We will contact you soon.');
      form.reset();
      setUploadedFiles([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit quote request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request Custom Quote</DialogTitle>
          <DialogDescription className="text-base pt-2">
            <span className="text-primary font-medium">
              This information will help us provide you with an accurate rate quotation to avoid any hassle.
            </span>
            <br />
            Please fill in the details below and we'll get back to you with a competitive quote.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Shipment Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Shipment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="service_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Small LTL - All Pin Codes">Small LTL - All Pin Codes</SelectItem>
                          <SelectItem value="Packers & Movers">Packers & Movers</SelectItem>
                          <SelectItem value="Full Truck Load (FTL)">Full Truck Load (FTL)</SelectItem>
                          {/* <SelectItem value="Air Freight Services">Air Freight Services</SelectItem> */}
                          <SelectItem value="Railway Services">Railway Services</SelectItem>
                          {/* <SelectItem value="Daily Part Load Bidding">Daily Part Load Bidding</SelectItem> */}
                          <SelectItem value="Tenders & Projects">Tenders & Projects</SelectItem>
                          {/* <SelectItem value="Contractual Services">Contractual Services</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (Pieces/Packages)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin (From) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Kolkata" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination (To) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="100.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensions (L x W x H in cm)</FormLabel>
                      <FormControl>
                        <Input placeholder="50 x 40 x 30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipment_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipment Value (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Additional Information</h3>
              <FormField
                control={form.control}
                name="special_requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="E.g., Fragile items, temperature controlled, insurance needs, etc." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferences / Wishes / Clauses</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any specific delivery time, packaging preferences, or special clauses you'd like to add" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            {/* File Upload */}
            {/* <div className="space-y-4">
              <h3 className="font-semibold text-lg">Upload Photos / Documents</h3>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                    <p className="text-sm text-muted-foreground">
                      Click to upload photos of your shipment, documents, or any relevant files
                    </p>
                  </div>
                </label>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Quote Request'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
