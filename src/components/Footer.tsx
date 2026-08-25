import { useEffect, useState } from "react";
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const [companyInfo, setCompanyInfo] = useState({
    address: "B/31/H/4 Gobra Gorasthan Road, Ground Floor, Kolkata-700046",
    phone_primary: "7044711417",
    phone_secondary: "6289984889",
    phone_tertiary: "6290992707",
    email: "yatayaatlogistics@gmail.com"
  });

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const { data } = await supabase
        .from("company_settings")
        .select("address, phone_primary, phone_secondary, phone_tertiary, email")
        .single();

      if (data) {
        setCompanyInfo({
          address: data.address || companyInfo.address,
          phone_primary: data.phone_primary || companyInfo.phone_primary,
          phone_secondary: data.phone_secondary || companyInfo.phone_secondary,
          phone_tertiary: data.phone_tertiary || companyInfo.phone_tertiary,
          email: data.email || companyInfo.email
        });
      }
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  return (
    <footer className="bg-primary-dark text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-10">
              <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">Yatayaat</div>
                <div className="text-sm text-white/70">Logistics & Transport</div>
              </div>
            </div>
            <p className="text-white/80 mb-10">
              Professional logistics and transport services across India, built around reliability, clear communication, and timely delivery.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-white hover:text-secondary hover:bg-white/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-secondary hover:bg-white/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-secondary hover:bg-white/10">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-secondary hover:bg-white/10">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-white/80 hover:text-secondary transition-colors">Dashboard</a></li>
              <li><a href="/ai-assistant" className="text-white/80 hover:text-secondary transition-colors">AI Expert</a></li>
              <li><a href="/courses" className="text-white/80 hover:text-secondary transition-colors">Free Courses</a></li>
              <li><a href="/blog" className="text-white/80 hover:text-secondary transition-colors">Blog</a></li>
              <li><a href="/case-studies" className="text-white/80 hover:text-secondary transition-colors">Case Studies</a></li>
              <li><a href="/reviews" className="text-white/80 hover:text-secondary transition-colors">Reviews</a></li>
              <li><a href="/agent-program" className="text-white/80 hover:text-secondary transition-colors">Partner With Us</a></li>
            </ul>
          </div> */}

          {/* Services */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-10">Services</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-white/80 hover:text-secondary transition-colors">Small LTL</a></li>
              <li><a href="#services" className="text-white/80 hover:text-secondary transition-colors">Packers & Movers</a></li>
              <li><a href="#services" className="text-white/80 hover:text-secondary transition-colors">Full Truck Load</a></li>
              <li><a href="#services" className="text-white/80 hover:text-secondary transition-colors">Air Services</a></li>
              <li><a href="#services" className="text-white/80 hover:text-secondary transition-colors">Railway Services</a></li>
              <li><a href="#services" className="text-white/80 hover:text-secondary transition-colors">Contractual Services</a></li>
            </ul>
          </div> */}

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-10">Get In Touch</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">{companyInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <div className="text-white/80 text-sm">
                  <div>{companyInfo.phone_primary}</div>
                  {companyInfo.phone_secondary && <div>{companyInfo.phone_secondary}</div>}
                  {companyInfo.phone_tertiary && <div>{companyInfo.phone_tertiary}</div>}
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="text-white/80 text-sm">{companyInfo.email}</span>
              </li>
            </ul>
            {/* <div>
              <h4 className="text-sm font-semibold mb-2">Subscribe to Newsletter</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button variant="accent" size="sm">Subscribe</Button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <div>
              © 2025 Yatayaat Logistics. All rights reserved. | <span className="text-secondary">Samaan Appka, Zimmedaari Hamari</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-secondary transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};