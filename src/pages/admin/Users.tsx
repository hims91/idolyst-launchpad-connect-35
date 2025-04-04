
import React, { useState } from "react";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users as UsersIcon, MoreHorizontal, ShieldCheck, ShieldX } from "lucide-react";

const UsersAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const queryClient = useQueryClient();
  
  const pageSize = 10;
  
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin", "users", page, searchTerm, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select(`
          *,
          roles:user_roles(*)
        `, { count: 'exact' })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
        
      const { data, count, error } = await query;
      
      if (error) throw error;
      
      let filteredData = data;
      
      // Filter by role on the client side since we can't easily do it in the query
      if (roleFilter) {
        filteredData = data.filter((user) => {
          return user.roles?.some((role: any) => role.role === roleFilter);
        });
      }
      
      return { users: filteredData, totalCount: count || 0 };
    },
  });
  
  // Mutation for adding admin role
  const addAdminRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin" as any,
          is_verified: true
        });
      
      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      toast({
        title: "Admin role added",
        description: "User has been granted admin privileges",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => {
      console.error("Error adding admin role:", error);
      toast({
        title: "Error adding admin role",
        description: "There was an error granting admin privileges",
        variant: "destructive",
      });
    },
  });
  
  // Mutation for removing admin role
  const removeAdminRoleMutation = useMutation({
    mutationFn: async (params: { userId: string, roleId: string }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", params.roleId)
        .eq("user_id", params.userId)
        .eq("role", "admin" as any);
      
      if (error) throw error;
      return params;
    },
    onSuccess: () => {
      toast({
        title: "Admin role removed",
        description: "User's admin privileges have been revoked",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => {
      console.error("Error removing admin role:", error);
      toast({
        title: "Error removing admin role",
        description: "There was an error revoking admin privileges",
        variant: "destructive",
      });
    },
  });
  
  const handleAddAdminRole = (userId: string) => {
    addAdminRoleMutation.mutate(userId);
  };
  
  const handleRemoveAdminRole = (userId: string, roleId: string) => {
    removeAdminRoleMutation.mutate({ userId, roleId });
  };
  
  const users = usersData?.users || [];
  const totalCount = usersData?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };
  
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };

  const getUserInitials = (user: any) => {
    if (user.full_name) {
      return user.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    
    return 'U';
  };
  
  const getUserRoleBadges = (roles: any[]) => {
    if (!roles || !roles.length) return <Badge variant="outline">No Role</Badge>;
    
    return roles.map((role: any) => {
      switch (role.role) {
        case "entrepreneur":
          return (
            <Badge key={role.id} variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Entrepreneur
            </Badge>
          );
        case "mentor":
          return (
            <Badge key={role.id} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              {role.is_verified ? "Verified Mentor" : "Mentor"}
            </Badge>
          );
        case "admin":
          return (
            <Badge key={role.id} variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
              Admin
            </Badge>
          );
        default:
          return <Badge key={role.id} variant="outline">{role.role}</Badge>;
      }
    });
  };

  const hasAdminRole = (roles: any[]) => {
    return roles?.some((role: any) => role.role === "admin") || false;
  };
  
  const getAdminRoleId = (roles: any[]) => {
    const adminRole = roles?.find((role: any) => role.role === "admin");
    return adminRole?.id || null;
  };
  
  return (
    <AdminLayout activeTab="users">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">User Management</h2>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
            
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="entrepreneur">Entrepreneurs</SelectItem>
                <SelectItem value="mentor">Mentors</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">No users found</h3>
            <p className="text-muted-foreground">
              {searchTerm || roleFilter
                ? "Try changing your search or filter"
                : "There are no users to display"}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>XP</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.full_name || user.username}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getUserRoleBadges(user.roles)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono">{user.xp}</div>
                    </TableCell>
                    <TableCell>
                      {user.created_at ? format(new Date(user.created_at), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            View Details
                          </DropdownMenuItem>
                          {hasAdminRole(user.roles) ? (
                            <DropdownMenuItem 
                              onClick={() => handleRemoveAdminRole(user.id, getAdminRoleId(user.roles))}
                              className="text-red-500"
                            >
                              <ShieldX className="h-4 w-4 mr-2" />
                              Remove Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleAddAdminRole(user.id)}>
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Make Admin
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min((page - 1) * pageSize + 1, totalCount)} to{" "}
                {Math.min(page * pageSize, totalCount)} of {totalCount} users
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* User Details Dialog */}
      <Dialog open={Boolean(selectedUser)} onOpenChange={() => selectedUser && setSelectedUser(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about this user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url} />
                  <AvatarFallback className="text-lg">{getUserInitials(selectedUser)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.full_name || selectedUser.username}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getUserRoleBadges(selectedUser.roles)}
                  </div>
                </div>
                
                <div className="ml-auto">
                  {hasAdminRole(selectedUser.roles) ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-300"
                      onClick={() => {
                        handleRemoveAdminRole(selectedUser.id, getAdminRoleId(selectedUser.roles));
                        setSelectedUser(null);
                      }}
                    >
                      <ShieldX className="h-4 w-4 mr-2" />
                      Remove Admin
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-purple-700 border-purple-300"
                      onClick={() => {
                        handleAddAdminRole(selectedUser.id);
                        setSelectedUser(null);
                      }}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Make Admin
                    </Button>
                  )}
                </div>
              </div>
              
              <Tabs defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Username</p>
                      <p>{selectedUser.username || "Not set"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">User ID</p>
                      <p className="font-mono text-xs">{selectedUser.id}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Joined</p>
                      <p>{selectedUser.created_at ? format(new Date(selectedUser.created_at), "PPP") : "Unknown"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p>{selectedUser.updated_at ? format(new Date(selectedUser.updated_at), "PPP") : "Unknown"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Experience</p>
                      <p>{selectedUser.xp} XP (Level {selectedUser.level || 1})</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Location</p>
                      <p>{selectedUser.location || "Not set"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Bio</p>
                    <p className="text-sm">{selectedUser.bio || "No bio provided"}</p>
                  </div>
                </div>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersAdmin;
