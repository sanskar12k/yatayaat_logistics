import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import Tracking from "./pages/Tracking";
import AIAssistant from "./pages/AIAssistant";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Courses from "./pages/Courses";
import CaseStudies from "./pages/CaseStudies";
import Courier from "./pages/Courier";
import AgentProgram from "./pages/AgentProgram";
import AITools from "./pages/AITools";
import AIKnowledge from "./pages/AIKnowledge";
import FTLBidding from "./pages/FTLBidding";
import PartLoadBidding from "./pages/PartLoadBidding";
import TransporterBidding from "./pages/TransporterBidding";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";

// New Isolated Modules
import EnhancedPartLoadModule from "./modules/partload-enhanced";
import ApiIntegrationsModule from "./modules/api-integrations";
import CrowdfundingModule from "./modules/crowdfunding/CrowdfundingCampaign";
import SeoOptimizerModule from "./modules/seo-optimizer";
import LeadEngineModule from "./modules/lead-engine";
import AiMarketingModule from "./modules/ai-marketing-agent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/courier" element={<Courier />} />
          <Route path="/agent-program" element={<AgentProgram />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/ai-knowledge/:slug" element={<AIKnowledge />} />
          <Route path="/ftl-bidding" element={<FTLBidding />} />
          <Route path="/part-load-bidding" element={<PartLoadBidding />} />
          <Route path="/transporter-bidding" element={<TransporterBidding />} />
          <Route path="/reviews" element={<Reviews />} />
          {/* NEW ISOLATED MODULE ROUTES */}
          <Route path="/modules/enhanced-ptl" element={<EnhancedPartLoadModule />} />
          <Route path="/modules/api-integrations" element={<ApiIntegrationsModule />} />
          <Route path="/modules/crowdfunding" element={<CrowdfundingModule />} />
          <Route path="/modules/seo-optimizer" element={<SeoOptimizerModule />} />
          <Route path="/modules/lead-engine" element={<LeadEngineModule />} />
          <Route path="/modules/ai-marketing" element={<AiMarketingModule />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
