import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author_id: string;
  published_at: string;
  views_count: number;
  featured_image: string;
  seo_description: string;
  seo_keywords: string[];
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      setPost(data);

      // Increment view count
      await supabase
        .from("blog_posts")
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq("id", data.id);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Article not found");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video overflow-hidden rounded-xl mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge>{post.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <Eye className="h-4 w-4" />
                {post.views_count} views
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Admin
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {new Date(post.published_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <Link to="/blog">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  More Articles
                </Button>
              </Link>
              <Button onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
