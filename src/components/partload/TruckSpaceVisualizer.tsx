import { Truck } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TruckSpaceVisualizerProps {
  totalCapacity: number;
  usedCapacity: number;
  truckType?: string;
  className?: string;
}

export function TruckSpaceVisualizer({
  totalCapacity,
  usedCapacity,
  truckType = "Standard Truck",
  className = ""
}: TruckSpaceVisualizerProps) {
  const remainingCapacity = totalCapacity - usedCapacity;
  const utilizationPercentage = (usedCapacity / totalCapacity) * 100;
  const remainingPercentage = 100 - utilizationPercentage;

  const getUtilizationColor = () => {
    if (utilizationPercentage >= 90) return "bg-red-500";
    if (utilizationPercentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">{truckType}</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {utilizationPercentage.toFixed(1)}% Filled
          </span>
        </div>

        {/* Visual Truck Bar */}
        <div className="relative h-20 bg-muted rounded-lg overflow-hidden border border-border">
          {/* Filled portion */}
          <div
            className={`absolute left-0 top-0 h-full ${getUtilizationColor()} transition-all duration-500 flex items-center justify-center`}
            style={{ width: `${utilizationPercentage}%` }}
          >
            {utilizationPercentage > 15 && (
              <span className="text-white font-semibold text-sm">
                {usedCapacity.toFixed(0)} ft³ Used
              </span>
            )}
          </div>

          {/* Empty portion */}
          <div
            className="absolute right-0 top-0 h-full bg-background border-l-2 border-border flex items-center justify-center"
            style={{ width: `${remainingPercentage}%` }}
          >
            {remainingPercentage > 15 && (
              <span className="text-muted-foreground font-semibold text-sm">
                {remainingCapacity.toFixed(0)} ft³ Free
              </span>
            )}
          </div>

          {/* Truck icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Truck className="h-12 w-12 text-foreground/20" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-semibold text-foreground">{totalCapacity} ft³</p>
          </div>
          <div>
            <p className="text-muted-foreground">Used</p>
            <p className="font-semibold text-primary">{usedCapacity.toFixed(0)} ft³</p>
          </div>
          <div>
            <p className="text-muted-foreground">Available</p>
            <p className="font-semibold text-green-600">{remainingCapacity.toFixed(0)} ft³</p>
          </div>
        </div>

        {/* Utilization status */}
        <div className="text-center">
          {utilizationPercentage >= 90 && (
            <p className="text-sm text-red-600 font-medium">⚠️ Nearly Full - Limited Space</p>
          )}
          {utilizationPercentage >= 70 && utilizationPercentage < 90 && (
            <p className="text-sm text-yellow-600 font-medium">⚡ Good Utilization</p>
          )}
          {utilizationPercentage < 70 && (
            <p className="text-sm text-green-600 font-medium">✓ Plenty of Space Available</p>
          )}
        </div>
      </div>
    </Card>
  );
}