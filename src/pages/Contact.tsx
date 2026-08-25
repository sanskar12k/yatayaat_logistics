import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "yatayaatlogistics@gmail.com",
    href: "mailto:yatayaatlogistics@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 70447 11417",
    href: "tel:+917044711417",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "B/31/H/4 Gobra Gorasthan Road, Ground Floor, Kolkata-700046",
    href: "https://maps.google.com/?q=B/31/H/4+Gobra+Gorasthan+Road+Kolkata+700046",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("contact_us").insert([formData]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to submit your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">Contact Us</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Let’s discuss your shipment requirements.
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Reach out for a quote, service details, or support. We’ll get back to you quickly with the right solution for your move or transport needs.
            </p>

            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="block rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">{label}</div>
                      <div className="text-base font-medium text-foreground">{value}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <Card className="shadow-elegant border-border/60">
            <CardHeader>
              <CardTitle className="text-2xl">Send a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
                    Contact Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your shipment, location, timeline, and requirements."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {submitting ? "Sending..." : "Send Message"}
                </Button>

                {submitted && (
                  <p className="rounded-md border border-success/20 bg-success/10 px-3 py-2 text-sm text-success">
                    Your message has been submitted. We will contact you shortly.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
