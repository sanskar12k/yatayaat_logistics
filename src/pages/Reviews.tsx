import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Reviews() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Reviews & Testimonials
            </h1>
            <p className="text-xl text-muted-foreground">
              See what our customers say about our services
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Form - Left Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ReviewForm onSuccess={handleReviewSuccess} />
              </div>
            </div>

            {/* Reviews List - Right Side */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="ftl">FTL</TabsTrigger>
                  <TabsTrigger value="partload">Part Load</TabsTrigger>
                  <TabsTrigger value="courier">Courier</TabsTrigger>
                  <TabsTrigger value="packers">Packers</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  <ReviewsList key={`all-${refreshKey}`} />
                </TabsContent>
                <TabsContent value="ftl" className="mt-6">
                  <ReviewsList key={`ftl-${refreshKey}`} serviceType="FTL Shipment" />
                </TabsContent>
                <TabsContent value="partload" className="mt-6">
                  <ReviewsList key={`partload-${refreshKey}`} serviceType="Part Load" />
                </TabsContent>
                <TabsContent value="courier" className="mt-6">
                  <ReviewsList key={`courier-${refreshKey}`} serviceType="Courier" />
                </TabsContent>
                <TabsContent value="packers" className="mt-6">
                  <ReviewsList key={`packers-${refreshKey}`} serviceType="Packers & Movers" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}