import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Edit, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  title: string;
  difficulty: string;
  duration_weeks: number;
  enrolled_count: number;
  rating: number;
  is_active: boolean;
}

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Course ${!currentStatus ? "activated" : "deactivated"} successfully`);
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course status");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-500",
      intermediate: "bg-yellow-500",
      advanced: "bg-orange-500",
      expert: "bg-red-500"
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-500";
  };

  if (loading) {
    return <div className="text-center py-8">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Course Management</h2>
          <p className="text-muted-foreground">Manage free logistics courses</p>
        </div>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>
                      {course.duration_weeks} weeks • {course.rating} ⭐ rating
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty.toUpperCase()}
                  </Badge>
                  <Badge variant={course.is_active ? "default" : "secondary"}>
                    {course.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.enrolled_count} enrolled
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(course.id, course.is_active)}
                >
                  {course.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
