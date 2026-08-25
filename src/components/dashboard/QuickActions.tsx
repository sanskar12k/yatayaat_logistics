import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, MessageSquare, FileText } from "lucide-react";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Plus,
      label: "Create Shipment",
      description: "Start a new shipment",
      onClick: () => navigate("/shipments/new"),
    },
    {
      icon: Search,
      label: "Track Package",
      description: "Track your shipment",
      onClick: () => navigate("/tracking"),
    },
    {
      icon: MessageSquare,
      label: "AI Assistant",
      description: "Get help from AI",
      onClick: () => navigate("/ai-assistant"),
    },
    {
      icon: FileText,
      label: "Get Quote",
      description: "Request a quote",
      onClick: () => navigate("/quotes"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="w-full justify-start"
            onClick={action.onClick}
          >
            <action.icon className="mr-3 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">{action.label}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
