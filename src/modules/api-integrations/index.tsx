import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeyManager } from "./ApiKeyManager";
import { ThirdPartyIntegrations } from "./ThirdPartyIntegrations";
import { Key, Plug } from "lucide-react";

export default function ApiIntegrationsModule() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">API Integrations Hub</h1>
          <p className="text-lg text-muted-foreground">
            Manage API keys and connect third-party services
          </p>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Plug className="h-4 w-4" />
              Third-Party
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <ApiKeyManager />
          </TabsContent>

          <TabsContent value="integrations">
            <ThirdPartyIntegrations />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

export { ApiKeyManager } from "./ApiKeyManager";
export { ThirdPartyIntegrations } from "./ThirdPartyIntegrations";