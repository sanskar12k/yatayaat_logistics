import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users } from "lucide-react";
import { toast } from "sonner";

interface UserWithRole {
  id: string;
  email: string;
  role: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data: rolesData, error } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (error) throw error;

      // We can only get the auth users through the backend
      // For now, we'll show user IDs and allow adding by email
      setUsers(
        rolesData.map((roleData) => ({
          id: roleData.user_id,
          email: roleData.user_id, // We'll show the ID for now
          role: roleData.role,
        }))
      );
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      // Get current user to find the target user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        toast.error("You must be logged in");
        return;
      }

      // For now, we'll let users enter their own ID or email
      // In a production app, you'd need a backend function to look up users by email
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: newAdminEmail.trim(), role: "admin" });

      if (error) throw error;

      toast.success(`User is now an admin`);
      setNewAdminEmail("");
      loadUsers();
    } catch (error) {
      console.error("Error making admin:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: "user" })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("Admin role removed");
      loadUsers();
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Failed to remove admin role");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">User Management</h2>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>User Roles</CardTitle>
          </div>
          <CardDescription>Grant or revoke admin access for users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Add Admin by User ID</Label>
            <div className="flex gap-2">
              <Input
                id="admin-email"
                type="text"
                placeholder="Enter user UUID"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
              <Button onClick={handleMakeAdmin}>Make Admin</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Enter the UUID of the user you want to make admin. You can find this in the backend.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Current Users</Label>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-sm text-muted-foreground">No users found</div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-muted-foreground">
                        {user.id.substring(0, 8)}...
                      </span>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </div>
                    {user.role === "admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAdmin(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
