import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Globe, TrendingUp, Search, Eye } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  category: string;
  region: string;
  challenge: string;
  solution: string;
  results: string;
  tags?: string[];
  is_published: boolean;
  views_count: number;
  created_at: string;
}

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filteredStudies, setFilteredStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  useEffect(() => {
    filterStudies();
  }, [searchQuery, selectedRegion, caseStudies]);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error("Error fetching case studies:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudies = () => {
    let filtered = caseStudies;

    if (searchQuery) {
      filtered = filtered.filter(
        (study) =>
          study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          study.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (study.tags && study.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter((study) => study.region === selectedRegion);
    }

    setFilteredStudies(filtered);
  };

  const regions = Array.from(new Set(caseStudies.map((study) => study.region)));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Global Success Stories</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Real-World Logistics
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Case Studies
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from successful implementations, crisis management strategies, and industry innovations across the globe
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search case studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Region Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant={selectedRegion === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedRegion(null)}
            >
              All Regions
            </Badge>
            {regions.map((region) => (
              <Badge
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </Badge>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredStudies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No case studies found. Check back soon for new insights!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStudies.map((study) => (
              <Card key={study.id} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-2">
                      <Badge variant="secondary">{study.category}</Badge>
                      <Badge variant="outline">{study.region}</Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Eye className="h-3 w-3 mr-1" />
                      {study.views_count}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{study.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <span className="text-destructive">⚠️</span> Challenge
                    </h4>
                    <p className="text-sm">{study.challenge}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <span className="text-primary">💡</span> Solution
                    </h4>
                    <p className="text-sm">{study.solution}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" /> Results
                    </h4>
                    <p className="text-sm">{study.results}</p>
                  </div>

                  {/* Tags */}
                  {study.tags && study.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {study.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-20 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Study These Cases?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learn from Mistakes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Understand common pitfalls and adopt preventive measures to avoid costly errors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Industry Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay updated with latest trends, technologies, and best practices worldwide
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practical Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Apply proven strategies and methodologies to your own logistics challenges
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
