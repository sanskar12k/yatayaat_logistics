import { Button } from "@/components/ui/button";
import { Truck, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/yatayaat-logo.png";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleServicesClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileMenuOpen(false);

    const scrollToServices = () => {
      const servicesSection = document.getElementById("services");
      if (!servicesSection) return;

      const headerOffset = 80;
      const sectionTop = servicesSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: sectionTop - headerOffset, behavior: "smooth" });
    };

    if (location.pathname === "/") {
      scrollToServices();
    } else {
      navigate("/#services");
      window.setTimeout(scrollToServices, 100);
    }
  };

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileMenuOpen(false);

    const scrollToHero = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (location.pathname === "/") {
      scrollToHero();
    } else {
      navigate("/");
      window.setTimeout(scrollToHero, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Yatayaat Logistics" className="w-10 h-10 rounded-lg" />
            <div>
              <div className="text-xl font-bold text-foreground">Yatayaat</div>
              <div className="text-xs text-muted-foreground">Logistics & Transport</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" onClick={handleHomeClick} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/#services" onClick={handleServicesClick} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hidden md:inline-flex"
              onClick={() => setQuoteFormOpen(true)}
            >
              Request Quote
            </Button>
            <Link to="/contact">
              <Button variant="hero">
                Contact Us
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 space-y-3 border-t">
            <Link to="/" onClick={handleHomeClick} className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2">
              Home
            </Link>
            <Link to="/#services" onClick={handleServicesClick} className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2">
              Services
            </Link>
            <Link to="/contact" className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2">
              Contact
            </Link>
          </nav>
        )}
      </div>

      <QuoteRequestForm open={quoteFormOpen} onOpenChange={setQuoteFormOpen} />
    </header>
  );
};
