import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Star, Clock, Award, TrendingUp, Check } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_weeks: number;
  university_price: number;
  features: string[];
  enrolled_count: number;
  rating: number;
  is_active: boolean;
}

export default function Courses() {
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
        .eq("is_active", true)
        .order("difficulty");

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to enroll in courses");
      return;
    }

    try {
      const { error } = await supabase
        .from("course_enrollments")
        .insert({
          user_id: user.id,
          course_id: courseId,
        });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already enrolled in this course!");
        } else {
          throw error;
        }
      } else {
        toast.success("Successfully enrolled! Course materials will be available soon.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Failed to enroll. Please try again.");
    }
  };

  const levelColors: Record<string, string> = {
    beginner: "bg-green-500/10 text-green-500",
    intermediate: "bg-blue-500/10 text-blue-500",
    advanced: "bg-purple-500/10 text-purple-500",
    expert: "bg-orange-500/10 text-orange-500",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">100% FREE Education</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            World-Class Logistics Education
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Worth ₹5+ Lakhs, Absolutely FREE!
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build expertise that universities charge lakhs for. Master supply chain, logistics, and business management with industry-recognized certifications.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="max-w-4xl mx-auto mb-16 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">🏛️ Traditional Universities</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• ₹3-8 lakhs + living expenses</li>
                <li>• 2-4 years full-time</li>
                <li>• Theoretical, outdated curriculum</li>
                <li>• Limited industry exposure</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">🎁 Yatayaat FREE Courses</h3>
              <ul className="space-y-2 text-primary font-medium">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" /> 100% FREE
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" /> 6-10 weeks part-time
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" /> Practical, industry-current
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" /> Direct industry partnerships
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={levelColors[course.difficulty]}>
                      {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground line-through">
                        University Price: ₹{course.university_price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-2xl font-bold text-primary">FREE</div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                  <CardDescription className="text-base">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{course.duration_weeks} Weeks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{course.enrolled_count}+ enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{course.rating}/5 rating</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">What You'll Learn:</h4>
                    <ul className="space-y-2">
                      {course.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>Certificate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Industry recognized</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll FREE Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Why Choose Section */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our FREE Courses?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">🎯</div>
                <CardTitle className="text-lg">Industry-Relevant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Designed by 20+ year industry veterans with real-world experience
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">📜</div>
                <CardTitle className="text-lg">Recognized Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Industry-accepted certificates that boost your career prospects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">👨‍🏫</div>
                <CardTitle className="text-lg">Expert Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn from logistics leaders and successful entrepreneurs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">🌍</div>
                <CardTitle className="text-lg">Global Perspective</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  International best practices and emerging market insights
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
