import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Award, Truck } from "lucide-react";

interface Bid {
  id: string;
  quoted_rate: number;
  truck_type: string;
  available_space_cft: number;
  compatibility_score: number | null;
  status: string;
}

interface BidComparisonPanelProps {
  bids: Bid[];
  loadVolume: number;
  onSelectBid?: (bidId: string) => void;
}

export function BidComparisonPanel({ bids, loadVolume, onSelectBid }: BidComparisonPanelProps) {
  if (bids.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No bids to compare yet</p>
      </Card>
    );
  }

  const sortedBids = [...bids].sort((a, b) => a.quoted_rate - b.quoted_rate);
  const lowestRate = sortedBids[0]?.quoted_rate;
  const highestRate = sortedBids[sortedBids.length - 1]?.quoted_rate;
  const averageRate = bids.reduce((sum, bid) => sum + bid.quoted_rate, 0) / bids.length;

  const bestMatchBid = [...bids].sort((a, b) => 
    (b.compatibility_score || 0) - (a.compatibility_score || 0)
  )[0];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Compare Bids</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground mb-1">Total Bids</p>
          <p className="text-2xl font-bold text-foreground">{bids.length}</p>
        </Card>

        <Card className="p-4 bg-green-50 dark:bg-green-950">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-800 dark:text-green-200">Lowest Rate</p>
          </div>
          <p className="text-2xl font-bold text-green-600">₹{lowestRate.toLocaleString()}</p>
        </Card>

        <Card className="p-4 bg-blue-50 dark:bg-blue-950">
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Average Rate</p>
          <p className="text-2xl font-bold text-blue-600">₹{averageRate.toFixed(0).toLocaleString()}</p>
        </Card>

        <Card className="p-4 bg-orange-50 dark:bg-orange-950">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <p className="text-sm text-orange-800 dark:text-orange-200">Highest Rate</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">₹{highestRate.toLocaleString()}</p>
        </Card>
      </div>

      {/* Best Match Highlight */}
      {bestMatchBid && (
        <Card className="p-4 bg-primary/10 mb-6 border-2 border-primary">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-lg text-foreground">Best Match Recommendation</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Truck Type</p>
              <p className="font-semibold text-foreground">{bestMatchBid.truck_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rate</p>
              <p className="font-semibold text-primary">₹{bestMatchBid.quoted_rate.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Match Score</p>
              <p className="font-semibold text-green-600">{bestMatchBid.compatibility_score?.toFixed(0)}%</p>
            </div>
            <div>
              <Button 
                onClick={() => onSelectBid && onSelectBid(bestMatchBid.id)}
                className="w-full"
              >
                Select This Bid
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-sm font-semibold text-foreground">Truck Type</th>
              <th className="text-left p-3 text-sm font-semibold text-foreground">Quoted Rate</th>
              <th className="text-left p-3 text-sm font-semibold text-foreground">Available Space</th>
              <th className="text-left p-3 text-sm font-semibold text-foreground">Match Score</th>
              <th className="text-left p-3 text-sm font-semibold text-foreground">Savings</th>
              <th className="text-left p-3 text-sm font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedBids.map((bid) => {
              const savingsVsHighest = highestRate - bid.quoted_rate;
              const savingsPercent = ((savingsVsHighest / highestRate) * 100).toFixed(1);
              
              return (
                <tr key={bid.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{bid.truck_type}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm font-bold text-foreground">
                      ₹{bid.quoted_rate.toLocaleString()}
                    </span>
                    {bid.quoted_rate === lowestRate && (
                      <Badge className="ml-2 bg-green-500">Lowest</Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-foreground">{bid.available_space_cft} ft³</span>
                    <div className="w-full bg-muted h-2 rounded-full mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${Math.min((loadVolume / bid.available_space_cft) * 100, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    {bid.compatibility_score ? (
                      <Badge variant={bid.compatibility_score >= 90 ? 'default' : 'secondary'}>
                        {bid.compatibility_score.toFixed(0)}%
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </td>
                  <td className="p-3">
                    {savingsVsHighest > 0 ? (
                      <div className="text-sm">
                        <p className="text-green-600 font-semibold">
                          ₹{savingsVsHighest.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">({savingsPercent}% off)</p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant={bid.status === 'pending' ? 'secondary' : 'outline'}>
                      {bid.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Smart Estimator */}
      <Card className="mt-6 p-4 bg-muted">
        <h3 className="font-semibold text-foreground mb-2">💡 Smart Estimator</h3>
        <p className="text-sm text-muted-foreground">
          Based on {bids.length} bids, the average rate is <span className="font-semibold text-foreground">₹{averageRate.toFixed(0).toLocaleString()}</span>.
          {' '}The best value bid offers <span className="font-semibold text-green-600">{((highestRate - lowestRate) / highestRate * 100).toFixed(1)}% savings</span> compared to the highest quote.
        </p>
      </Card>
    </Card>
  );
}