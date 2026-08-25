import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDockets } from "@/components/admin/AdminDockets";
import { AdminBlog } from "@/components/admin/AdminBlog";
import { AdminCourses } from "@/components/admin/AdminCourses";
import { AdminAgents } from "@/components/admin/AdminAgents";
import { AdminCaseStudies } from "@/components/admin/AdminCaseStudies";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminLeads } from "@/components/admin/AdminLeads";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminQuotes } from "@/components/admin/AdminQuotes";
import { AdminAILeads } from "@/components/admin/AdminAILeads";
import { AdminDiscounts } from "@/components/admin/AdminDiscounts";
import { AdminAdManagement } from "@/components/admin/AdminAdManagement";
import { AdminSEO } from "@/components/admin/AdminSEO";
import { AdminSystemHealth } from "@/components/admin/AdminSystemHealth";
import { AdminGrowthEngine } from "@/components/admin/AdminGrowthEngine";
import { AdminPartLoads } from "@/components/admin/AdminPartLoads";
import { AdminUIBuilder } from "@/components/admin/AdminUIBuilder";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/yatayaat-logo.png";

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !roleData) {
        toast.error("Access Denied", {
          description: "You don't have admin privileges"
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Admin check error:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Yatayaat Logistics" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">Yatayaat Logistics Management</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dockets" className="space-y-6">
          <TabsList className="flex flex-wrap w-full lg:w-auto">
            <TabsTrigger value="dockets">Dockets</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="cases">Case Studies</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
            <TabsTrigger value="partloads">Part Loads</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="ai-leads">AI Leads</TabsTrigger>
            <TabsTrigger value="discounts">Discounts</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="health">System</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="ui-builder">UI Builder</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

            <TabsContent value="dockets" className="space-y-4">
              <AdminDockets />
            </TabsContent>

            <TabsContent value="quotes" className="space-y-4">
              <AdminQuotes />
            </TabsContent>

            <TabsContent value="blog" className="space-y-4">
            <AdminBlog />
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <AdminCourses />
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <AdminAgents />
          </TabsContent>

          <TabsContent value="cases" className="space-y-4">
            <AdminCaseStudies />
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <AdminLeads />
          </TabsContent>

          <TabsContent value="bids" className="space-y-4">
            {/** Lazy import to avoid circular deps not needed; component is simple */}
            {/* @ts-ignore */}
            {require('../components/admin/AdminBids')?.AdminBids ? require('../components/admin/AdminBids').AdminBids() : null}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="partloads" className="space-y-4">
            <AdminPartLoads />
          </TabsContent>

          <TabsContent value="ai-leads" className="space-y-4">
            <AdminAILeads />
          </TabsContent>

          <TabsContent value="discounts" className="space-y-4">
            <AdminDiscounts />
          </TabsContent>

          <TabsContent value="ads" className="space-y-4">
            <AdminAdManagement />
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <AdminSEO />
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <AdminSystemHealth />
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <AdminGrowthEngine />
          </TabsContent>

          <TabsContent value="ui-builder" className="space-y-4">
            <AdminUIBuilder />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
