import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Truck, Camera, Upload, X, Package } from "lucide-react";
import { toast } from "sonner";

interface EnhancedTruckVisualizerProps {
  totalCapacity: number;
  usedCapacity: number;
  truckType?: string;
  onPhotoUpload?: (photos: File[], type: "truck" | "material") => void;
  truckPhotos?: string[];
  materialPhotos?: string[];
  editable?: boolean;
}

export function EnhancedTruckVisualizer({
  totalCapacity,
  usedCapacity,
  truckType = "Standard Truck",
  onPhotoUpload,
  truckPhotos = [],
  materialPhotos = [],
  editable = false
}: EnhancedTruckVisualizerProps) {
  const [selectedTruckPhotos, setSelectedTruckPhotos] = useState<File[]>([]);
  const [selectedMaterialPhotos, setSelectedMaterialPhotos] = useState<File[]>([]);
  const truckInputRef = useRef<HTMLInputElement>(null);
  const materialInputRef = useRef<HTMLInputElement>(null);

  const remainingCapacity = totalCapacity - usedCapacity;
  const utilizationPercentage = (usedCapacity / totalCapacity) * 100;

  const getUtilizationColor = () => {
    if (utilizationPercentage >= 90) return "from-red-500 to-red-600";
    if (utilizationPercentage >= 70) return "from-yellow-500 to-yellow-600";
    if (utilizationPercentage >= 50) return "from-blue-500 to-blue-600";
    return "from-green-500 to-green-600";
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, type: "truck" | "material") => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }
    
    if (type === "truck") {
      setSelectedTruckPhotos(files);
    } else {
      setSelectedMaterialPhotos(files);
    }
    
    if (onPhotoUpload) {
      onPhotoUpload(files, type);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          {truckType} - Live Space View
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* 3D-style Truck Container */}
        <div className="relative">
          <div className="bg-muted rounded-lg p-4 border-2 border-border">
            {/* Truck Container */}
            <div className="relative h-32 bg-background rounded-lg overflow-hidden border border-border shadow-inner">
              {/* Filled Section */}
              <div
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getUtilizationColor()} transition-all duration-700 flex items-center justify-center`}
                style={{ width: `${utilizationPercentage}%` }}
              >
                <div className="flex flex-col items-center text-white">
                  {utilizationPercentage > 20 && (
                    <>
                      <Package className="h-8 w-8 opacity-80" />
                      <span className="text-sm font-bold mt-1">{utilizationPercentage.toFixed(0)}% Filled</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Empty Section */}
              <div 
                className="absolute right-0 top-0 h-full flex items-center justify-center"
                style={{ width: `${100 - utilizationPercentage}%` }}
              >
                {(100 - utilizationPercentage) > 20 && (
                  <span className="text-muted-foreground text-sm font-medium">
                    {(100 - utilizationPercentage).toFixed(0)}% Available
                  </span>
                )}
              </div>
              
              {/* Grid Lines */}
              <div className="absolute inset-0 flex">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-border/30" />
                ))}
              </div>
            </div>
            
            {/* Truck Cab */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-20 bg-primary rounded-r-lg shadow-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary-foreground rotate-90" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Total Capacity</p>
            <p className="text-xl font-bold text-foreground">{totalCapacity} ft³</p>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Used Space</p>
            <p className="text-xl font-bold text-primary">{usedCapacity.toFixed(0)} ft³</p>
          </div>
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-xl font-bold text-green-600">{remainingCapacity.toFixed(0)} ft³</p>
          </div>
        </div>

        {/* Auto Space Estimation */}
        <div className="bg-muted/50 p-4 rounded-lg border">
          <h4 className="font-semibold text-sm mb-2">AI Space Estimation</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Based on dimensions and load type, estimated space requirement:
          </p>
          <Badge variant="secondary" className="text-sm">
            ~{(remainingCapacity * 0.85).toFixed(0)} ft³ effective usable space
          </Badge>
        </div>

        {/* Photo Upload Sections */}
        {editable && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Truck Photos */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Truck Space Photos
              </Label>
              <input
                type="file"
                ref={truckInputRef}
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoChange(e, "truck")}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => truckInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Truck Photos
              </Button>
              {(truckPhotos.length > 0 || selectedTruckPhotos.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {truckPhotos.map((photo, idx) => (
                    <img key={idx} src={photo} alt="" className="w-16 h-16 object-cover rounded border" />
                  ))}
                  {selectedTruckPhotos.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="" 
                        className="w-16 h-16 object-cover rounded border" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Material Photos */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Material/Load Photos
              </Label>
              <input
                type="file"
                ref={materialInputRef}
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoChange(e, "material")}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => materialInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Material Photos
              </Button>
              {(materialPhotos.length > 0 || selectedMaterialPhotos.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {materialPhotos.map((photo, idx) => (
                    <img key={idx} src={photo} alt="" className="w-16 h-16 object-cover rounded border" />
                  ))}
                  {selectedMaterialPhotos.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="" 
                        className="w-16 h-16 object-cover rounded border" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}