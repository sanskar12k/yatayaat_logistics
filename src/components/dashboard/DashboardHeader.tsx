import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Package, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Logistics Platform</h1>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate("/shipments")}>
            Shipments
          </Button>
          <Button variant="ghost" onClick={() => navigate("/tracking")}>
            Tracking
          </Button>
          <Button variant="ghost" onClick={() => navigate("/ai-assistant")}>
            AI Assistant
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{user?.email}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/shipments")}>Shipments</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/tracking")}>Tracking</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/ai-assistant")}>AI Assistant</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
