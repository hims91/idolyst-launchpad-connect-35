
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { HelmetProvider } from 'react-helmet-async';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/hooks/use-theme";

// Pages
import Index from "./pages/Index";
import PitchHub from "./pages/PitchHub";
import MentorSpace from "./pages/MentorSpace";
import Ascend from "./pages/Ascend";
import Profile from "./pages/Profile";
import ProfileDetail from "./pages/ProfileDetail";
import ProfileEdit from "./pages/ProfileEdit";
import ActivityFeed from "./pages/ActivityFeed";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Auth pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthCallback from "./pages/auth/Callback";

// MentorSpace pages
import MentorDirectory from "./pages/mentorspace/MentorDirectory";
import MentorDetail from "./pages/mentorspace/MentorDetail";
import SessionManagement from "./pages/mentorspace/SessionManagement";
import MentorApplication from "./pages/mentorspace/MentorApplication";
import MentorProfilePage from "./pages/mentorspace/MentorProfilePage";

// PitchHub pages
import PitchHubIndex from "./pages/pitch-hub/Index";
import PitchHubNew from "./pages/pitch-hub/New";
import PitchHubDetail from "./pages/pitch-hub/Detail";
import PitchHubLeaderboard from "./pages/pitch-hub/Leaderboard";

// Ascend pages
import AscendDashboard from "./pages/ascend/Dashboard";
import AscendLeaderboard from "./pages/ascend/Leaderboard";

// Launchpad pages
import PostPage from "./pages/launchpad/Post";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminModerationQueue from "./pages/admin/ModerationQueue";
import AdminUsers from "./pages/admin/Users";
import AdminSystemLogs from "./pages/admin/SystemLogs";
import AdminSettings from "./pages/admin/Settings";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <SidebarProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/pitch-hub" element={<PitchHub />} />
                    <Route path="/mentor-space" element={<MentorSpace />} />
                    <Route path="/ascend" element={<Ascend />} />
                    
                    {/* Launchpad routes */}
                    <Route path="/launchpad/post/:id" element={<PostPage />} />
                    
                    {/* PitchHub routes */}
                    <Route path="/pitch-hub/index" element={<PitchHubIndex />} />
                    <Route path="/pitch-hub/leaderboard" element={<PitchHubLeaderboard />} />
                    <Route path="/pitch-hub/:id" element={<PitchHubDetail />} />
                    <Route 
                      path="/pitch-hub/new" 
                      element={
                        <ProtectedRoute>
                          <PitchHubNew />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Auth routes */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/signup" element={<SignUp />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    
                    {/* Profile routes */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/:id" element={<ProfileDetail />} />
                    <Route 
                      path="/profile/edit" 
                      element={
                        <ProtectedRoute>
                          <ProfileEdit />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/profile/:id/activity" element={<ActivityFeed />} />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* MentorSpace routes */}
                    <Route path="/mentor-space/directory" element={<MentorDirectory />} />
                    <Route path="/mentor-space/:mentorId" element={<MentorDetail />} />
                    <Route 
                      path="/mentor-space/sessions" 
                      element={
                        <ProtectedRoute>
                          <SessionManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/mentor-space/apply" 
                      element={
                        <ProtectedRoute>
                          <MentorApplication />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/mentor-space/profile" 
                      element={
                        <ProtectedRoute>
                          <MentorProfilePage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Ascend routes */}
                    <Route 
                      path="/ascend/dashboard" 
                      element={
                        <ProtectedRoute>
                          <AscendDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/ascend/leaderboard" 
                      element={
                        <ProtectedRoute>
                          <AscendLeaderboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Admin routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/moderation" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <AdminModerationQueue />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/users" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <AdminUsers />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/logs" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <AdminSystemLogs />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/settings" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <AdminSettings />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Protected routes */}
                    <Route 
                      path="/messages" 
                      element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/notifications" 
                      element={
                        <ProtectedRoute>
                          <Notifications />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

export default App;
