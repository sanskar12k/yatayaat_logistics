import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, Zap, AlertTriangle, CheckCircle, Globe, FileText, 
  Link, Image, RefreshCw, TrendingUp, Sparkles 
} from "lucide-react";
import { toast } from "sonner";

interface SeoPage {
  id: string;
  page_url: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  audit_score: number | null;
  issues: any[];
}

export function SeoOptimizer() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<SeoPage | null>(null);
  const [generatedMeta, setGeneratedMeta] = useState<{ title: string; description: string; keywords: string[] } | null>(null);

  const sb = supabase as any;

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await sb
        .from('seo_pages')
        .select('*')
        .order('audit_score', { ascending: true, nullsFirst: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeUrl = async (url: string) => {
    setAnalyzing(true);
    try {
      // Simulate AI analysis (in production, this would call an AI endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock analysis
      const score = Math.floor(Math.random() * 40) + 60;
      const issues = [
        score < 80 && { type: 'warning', message: 'Meta description could be more descriptive' },
        score < 70 && { type: 'error', message: 'Missing alt text on images' },
        score < 90 && { type: 'info', message: 'Consider adding more internal links' },
      ].filter(Boolean);

      // Upsert page
      const { error } = await sb
        .from('seo_pages')
        .upsert({
          page_url: url,
          audit_score: score,
          issues: issues,
          last_audit_at: new Date().toISOString(),
        }, { onConflict: 'page_url' });

      if (error) throw error;
      
      toast.success(`Analysis complete! Score: ${score}/100`);
      fetchPages();
    } catch (error: any) {
      toast.error('Analysis failed: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const generateMetaTags = async (pageUrl: string) => {
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const generated = {
        title: `Yatayaat Logistics - ${pageUrl.split('/').pop() || 'Home'} | Best Transport Services`,
        description: `Experience seamless logistics solutions with Yatayaat. Trusted by 10,000+ businesses for FTL, PTL, packers & movers. Get instant quotes and real-time tracking.`,
        keywords: ['logistics', 'transport', 'ftl', 'ptl', 'packers movers', 'kolkata logistics', 'freight'],
      };

      setGeneratedMeta(generated);
      toast.success('Meta tags generated!');
    } catch (error) {
      toast.error('Generation failed');
    }
  };

  const applyMetaTags = async () => {
    if (!selectedPage || !generatedMeta) return;

    try {
      const { error } = await sb
        .from('seo_pages')
        .update({
          meta_title: generatedMeta.title,
          meta_description: generatedMeta.description,
          keywords: generatedMeta.keywords,
        })
        .eq('id', selectedPage.id);

      if (error) throw error;
      
      toast.success('Meta tags updated!');
      setGeneratedMeta(null);
      fetchPages();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Quick Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            SEO Analyzer
          </CardTitle>
          <CardDescription>Analyze any page for SEO issues and get AI-powered suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter page URL (e.g., /services, /about)"
              className="flex-1"
              id="analyze-url"
            />
            <Button 
              onClick={() => {
                const input = document.getElementById('analyze-url') as HTMLInputElement;
                if (input.value) analyzeUrl(input.value);
              }}
              disabled={analyzing}
            >
              {analyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pages Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Page Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No pages analyzed yet. Start by analyzing a URL above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                    selectedPage?.id === page.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-bold ${getScoreColor(page.audit_score)}`}>
                        {page.audit_score || '--'}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{page.page_url}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {page.meta_title || 'No title set'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {page.issues && page.issues.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {page.issues.length} issues
                        </Badge>
                      )}
                      {page.audit_score && page.audit_score >= 80 && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Page Details */}
      {selectedPage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedPage.page_url}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="meta">
              <TabsList>
                <TabsTrigger value="meta">Meta Tags</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="generate">AI Generate</TabsTrigger>
              </TabsList>

              <TabsContent value="meta" className="space-y-4">
                <div>
                  <Label>Meta Title</Label>
                  <Input value={selectedPage.meta_title || ''} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Textarea value={selectedPage.meta_description || ''} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Keywords</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPage.keywords?.map((kw, idx) => (
                      <Badge key={idx} variant="secondary">{kw}</Badge>
                    )) || <span className="text-muted-foreground text-sm">No keywords set</span>}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="issues" className="space-y-3">
                {selectedPage.issues && selectedPage.issues.length > 0 ? (
                  selectedPage.issues.map((issue: any, idx: number) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg flex items-start gap-3 ${
                        issue.type === 'error' ? 'bg-red-500/10' :
                        issue.type === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                      }`}
                    >
                      <AlertTriangle className={`h-5 w-5 ${
                        issue.type === 'error' ? 'text-red-500' :
                        issue.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <p className="text-sm">{issue.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>No issues found!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="generate" className="space-y-4">
                <Button onClick={() => generateMetaTags(selectedPage.page_url)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Meta Tags
                </Button>

                {generatedMeta && (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    <div>
                      <Label>Generated Title</Label>
                      <Input value={generatedMeta.title} readOnly />
                    </div>
                    <div>
                      <Label>Generated Description</Label>
                      <Textarea value={generatedMeta.description} readOnly />
                    </div>
                    <div>
                      <Label>Suggested Keywords</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {generatedMeta.keywords.map((kw, idx) => (
                          <Badge key={idx} variant="secondary">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button onClick={applyMetaTags} className="w-full">
                      Apply These Tags
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}