import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, Users, Wallet, Lock, CheckCircle2, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export default function AgentProgram() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    city: "",
    experience_years: "",
    preferred_commission: "",
    payment_mode: "bank_transfer",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to apply for agent program");
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("agents").insert({
        user_id: user.id,
        agent_code: `AG${Date.now()}`,
        contact_person: formData.full_name,
        email: formData.email,
        phone: formData.phone_number,
        company_name: formData.company_name || null,
        city: formData.city,
        experience_years: parseInt(formData.experience_years) || 0,
        commission_percentage: parseFloat(formData.preferred_commission) || 5,
      });

      if (error) throw error;

      toast.success("Application submitted successfully! We'll review and contact you soon.");
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        company_name: "",
        city: "",
        experience_years: "",
        preferred_commission: "",
        payment_mode: "bank_transfer",
      });
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">100% Confidential</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Commission-Based
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Agent Program
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our confidential agent network. Generate loads, earn commissions, and grow your logistics business—your identity stays completely protected.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Complete Confidentiality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your identity and client details are 100% secure and never disclosed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <IndianRupee className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Flexible Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set your own commission rates based on load value and service type
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Wallet className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Multiple Payment Options</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bank transfer, UPI, cash, or any preferred payment method
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Unlimited Earning Potential</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No caps on earnings—more loads mean more commissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How Agent Program Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-lg">Register Securely</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submit your application with full confidentiality guarantee
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-lg">Get Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quick verification process, maintain complete anonymity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-lg">Submit Loads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share load details, set your commission, manage from dashboard
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <CardTitle className="text-lg">Earn Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receive payments in your preferred mode after successful delivery
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Apply for Agent Program</CardTitle>
              <CardDescription>
                All information is encrypted and kept strictly confidential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name *</label>
                    <Input
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                    <Input
                      required
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="10-digit mobile"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">City *</label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Your city"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company Name (Optional)</label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="If applicable"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience (Years)</label>
                    <Input
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                      placeholder="Years in logistics"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Commission (%)</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formData.preferred_commission}
                      onChange={(e) => setFormData({ ...formData, preferred_commission: e.target.value })}
                      placeholder="e.g., 5"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Payment Mode</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.payment_mode}
                      onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Confidentiality Guarantee</p>
                      <p className="text-muted-foreground">
                        Your personal information, client details, and all transactions are encrypted and kept strictly confidential. We never share agent identities with anyone.
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Services Covered */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Services You Can Offer as Agent</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="outline" className="text-sm px-4 py-2">Full Truck Load (FTL)</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Part Load (PTL)</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Packers & Movers</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Courier Services</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Air Freight</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Railway Services</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Warehouse Solutions</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Project Cargo</Badge>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
