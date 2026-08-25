import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ServiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    title: string;
    description: string;
    features: string[];
    detailedInfo?: string;
  } | null;
  onRequestQuote: () => void;
}

const serviceDetails: Record<string, string> = {
  "Small LTL - All Pin Codes": "Our Small LTL (Less Than Truckload) service is designed for businesses and individuals who need to ship smaller consignments across India. We cover every pin code in the country, ensuring your goods reach even the most remote locations. Our network of reliable partners and our own fleet ensures timely delivery with complete transparency through real-time tracking. Whether you're shipping documents, small parcels, or multiple packages, our LTL service offers the perfect balance of cost-effectiveness and reliability. We handle all paperwork, provide insurance coverage, and ensure door-to-door delivery with professional handling at every step.",
  
  "Packers & Movers": "Our professional Packers & Movers service takes the stress out of relocation. Whether you're moving your home, office, or commercial establishment, our trained team handles everything from careful packing using quality materials to safe transportation and unpacking at your new location. We specialize in handling fragile items, furniture, electronics, and valuable possessions with utmost care. Our service includes disassembly and reassembly of furniture, proper labeling, systematic packing, and full insurance coverage. We also offer specialized vehicle transportation services for bikes and cars, ensuring they reach your destination in perfect condition.",
  
  "Full Truck Load (FTL)": "Our Full Truck Load service is ideal for large shipments that require dedicated trucks. We have established strong transportation lanes from Kolkata to major cities across India including Mumbai, Delhi, Bangalore, and Guwahati. With FTL, you get exclusive use of the entire truck, ensuring faster transit times and reduced handling of your goods. We offer various truck sizes from 14ft to 32ft to match your cargo requirements. Our experienced drivers know the routes well, ensuring timely delivery while maintaining the highest safety standards. Real-time GPS tracking keeps you informed throughout the journey, and our dedicated support team is always available to address your concerns.",
  
  "Air Freight Services": "When speed is of the essence, our Air Freight service is your best choice. We offer express air cargo services from Kolkata to destinations pan-India with guaranteed delivery timelines. Our tiered service levels - 24 hours for Tier-1 cities, 48 hours for Tier-2 cities, and 72 hours for Tier-3 cities - ensure you can choose the right balance of speed and cost. We handle all documentation, customs clearance (if required), and coordinate with airlines for priority handling. Our air freight service is perfect for time-sensitive shipments, high-value goods, perishables, and emergency consignments. Track your shipment in real-time and receive timely updates at every stage.",
  
  "Railway Services": "Our Railway Services provide a cost-effective solution for bulk shipments across India. Leveraging the extensive Indian Railway network, we offer both station-to-station and door-to-door delivery options. This service is particularly economical for heavy goods, bulk commodities, and non-urgent shipments. We handle all railway documentation, coordinate loading and unloading, and manage the entire logistics chain. Our partnerships with Indian Railways ensure reliable booking and timely movement of goods. Railway transport is also an environmentally friendly option, making it ideal for businesses focused on sustainability while keeping transportation costs low.",
  
  "Daily Part Load Bidding": "Our innovative Daily Part Load Bidding platform revolutionizes how you book part load shipments. Every day, we conduct live bidding sessions where multiple verified vendors compete to offer you the best rates for your bulk part load requirements. This competitive marketplace ensures you always get the most economical prices without compromising on service quality. The platform is transparent, showing you real-time bids from verified logistics partners. You can compare rates, check vendor credentials, and choose the best option for your needs. Get instant quotes, book immediately, and track your shipment - all through our digital platform.",
  
  "Tenders & Projects": "Our Tenders & Projects division specializes in handling large-scale logistics requirements for government tenders, corporate projects, and infrastructure developments. We offer comprehensive end-to-end logistics solutions tailored to your project's specific needs. Our team provides dedicated project management, ensuring compliance with all tender requirements and regulations. From initial planning and resource allocation to execution and delivery, we manage every aspect of your logistics needs. We have experience with various industries including construction, manufacturing, retail, and government sectors. Our project logistics services include warehousing, inventory management, last-mile delivery, and detailed reporting.",
  
  "Contractual Services": "Our Contractual Services offer flexible monthly and weekly contracts for all your regular transportation needs. We provide specialized logistics solutions including First Mile pickup, Middle Mile transportation, Last Mile delivery, and efficient Milk Run operations. These contracts are perfect for businesses with regular shipping requirements, offering cost predictability and priority service. We work closely with you to understand your specific needs and design custom logistics solutions that optimize your supply chain. Our contractual services include dedicated vehicles, scheduled pickups, optimized routes, and detailed performance reporting. Enjoy the benefits of a long-term logistics partnership with flexible terms and professional service."
};

export const ServiceDetailsDialog = ({ open, onOpenChange, service, onRequestQuote }: ServiceDetailsDialogProps) => {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{service.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {service.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div>
            <h3 className="font-semibold text-lg mb-3">Detailed Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              {serviceDetails[service.title] || service.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Key Features</h3>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 flex gap-3">
            <Button onClick={onRequestQuote} className="flex-1">
              Request Quote for This Service
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
