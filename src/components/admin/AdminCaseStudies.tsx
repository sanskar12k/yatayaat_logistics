import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  region: string;
  is_published: boolean;
  views_count: number;
  created_at: string;
}

export function AdminCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error("Error fetching case studies:", error);
      toast.error("Failed to load case studies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;

    try {
      const { error } = await supabase
        .from("case_studies")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Case study deleted successfully");
      fetchCaseStudies();
    } catch (error) {
      console.error("Error deleting case study:", error);
      toast.error("Failed to delete case study");
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("case_studies")
        .update({ 
          is_published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Case study ${!currentStatus ? "published" : "unpublished"} successfully`);
      fetchCaseStudies();
    } catch (error) {
      console.error("Error updating case study:", error);
      toast.error("Failed to update case study");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading case studies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Case Studies Management</h2>
          <p className="text-muted-foreground">Manage global logistics case studies</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Case Study
        </Button>
      </div>

      <div className="grid gap-4">
        {caseStudies.map((study) => (
          <Card key={study.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{study.title}</CardTitle>
                  <CardDescription>
                    {study.category} • {study.region}
                  </CardDescription>
                </div>
                <Badge variant={study.is_published ? "default" : "secondary"}>
                  {study.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {study.views_count} views
                  </span>
                  <span>{new Date(study.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(study.id, study.is_published)}
                  >
                    {study.is_published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(study.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {caseStudies.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No case studies found. Create your first case study to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
