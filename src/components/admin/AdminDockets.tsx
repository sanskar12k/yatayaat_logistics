import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DocketForm } from "./DocketForm";
import { Badge } from "@/components/ui/badge";

interface Docket {
  id: string;
  docket_number: string;
  docket_type: string;
  customer_name: string;
  origin: string;
  destination: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export function AdminDockets() {
  const [dockets, setDockets] = useState<Docket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDocket, setSelectedDocket] = useState<Docket | null>(null);

  useEffect(() => {
    fetchDockets();
  }, []);

  const fetchDockets = async () => {
    try {
      const { data, error } = await supabase
        .from("dockets")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDockets(data || []);
    } catch (error) {
      console.error("Error fetching dockets:", error);
      toast.error("Failed to load dockets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this docket?")) return;

    try {
      const { error } = await supabase
        .from("dockets")
        .update({ is_deleted: true })
        .eq("id", id);

      if (error) throw error;
      toast.success("Docket deleted successfully");
      fetchDockets();
    } catch (error) {
      console.error("Error deleting docket:", error);
      toast.error("Failed to delete docket");
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      in_transit: "bg-blue-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getDocketTypeLabel = (type: string) => {
    const labels = {
      packers_movers: "Packers & Movers",
      ptl_ftl: "PTL/FTL",
      other_services: "Other Services",
      courier_ecommerce: "Courier/E-commerce"
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return <div className="text-center py-8">Loading dockets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Docket Management</h2>
          <p className="text-muted-foreground">Manage all dockets and shipments</p>
        </div>
        <Button onClick={() => { setSelectedDocket(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Docket
        </Button>
      </div>

      {showForm && (
        <DocketForm
          docket={selectedDocket}
          onClose={() => { setShowForm(false); setSelectedDocket(null); }}
          onSuccess={() => { fetchDockets(); setShowForm(false); setSelectedDocket(null); }}
        />
      )}

      <div className="grid gap-4">
        {dockets.map((docket) => (
          <Card key={docket.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <CardTitle className="text-lg">{docket.docket_number}</CardTitle>
                    <CardDescription>
                      {docket.customer_name} • {getDocketTypeLabel(docket.docket_type)}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(docket.status)}>
                  {docket.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-medium">{docket.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{docket.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">₹{docket.total_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(docket.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setSelectedDocket(docket); setShowForm(true); }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(docket.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {dockets.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No dockets found. Create your first docket to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
