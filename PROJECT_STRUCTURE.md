# Idolyst Project Structure
Idolyst, a mobile-first professional networking platform designed for entrepreneurs launching ideas (PitchHub), mentorship for professional growth (MentorSpace), gamified engagement (Ascend), one-on-one networking (Messaging), and monetization through mentorship fees and premium features. Every page, card, button, and UI/UX element is fleshed out with a very modern, mobile-first approach, complete with animations and deep interlinkages between modules.

## Core Files and Components

### Authentication
- `src/hooks/useAuth.tsx` - Custom authentication hook to manage auth state
- `src/providers/AuthProvider.tsx` - Auth context provider with comprehensive session management
- `src/pages/auth/Login.tsx` - Login page with improved error handling and redirection
- `src/pages/auth/SignUp.tsx` - Sign up page with role selection
- `src/pages/auth/ForgotPassword.tsx` - Password recovery request page
- `src/pages/auth/ResetPassword.tsx` - Reset password page
- `src/pages/auth/Callback.tsx` - Auth callback handling for various authentication flows
- `src/components/auth/ProtectedRoute.tsx` - Route protection with role-based access control
- `src/components/auth/RoleSelector.tsx` - Role selection component
- `src/components/auth/PasswordStrengthMeter.tsx` - Password strength indicator
- `src/api/auth.ts` - Authentication API calls and helper functions

### Layout
- `src/components/layout/Layout.tsx` - Main layout wrapper
- `src/components/layout/WebSidebar.tsx` - Desktop sidebar navigation with authentication state
- `src/components/layout/WebRightSidebar.tsx` - Desktop right sidebar with trending topics, top mentors, and featured pitches
- `src/components/layout/MobileNavigation.tsx` - Mobile bottom navigation
- `src/components/layout/MobileHeader.tsx` - Mobile header with authentication state
- `src/components/layout/AuthLayout.tsx` - Authentication pages layout

### Routes
- `src/App.tsx` - Main route definitions and auth-protected routes

### UI Components (shadcn/ui)
- Button, Form, Input, Dialog, Toast, etc. (already configured)

### Utilities
- `src/lib/utils.ts` - General utilities for formatting, validation, and UI helpers
- `src/lib/validation.ts` - Form validation schemas
- `src/lib/animations.ts` - Animation utilities for Framer Motion transitions
- `src/lib/supabase-types.ts` - TypeScript types for Supabase client and database tables

### API
- `src/api/auth.ts` - Authentication API calls
- `src/api/profile.ts` - Profile-related API calls
- `src/api/notifications.ts` - Notification-related API calls
- `src/api/messages.ts` - Messaging-related API calls
- `src/api/mentor.ts` - Mentor-related API calls
- `src/integrations/supabase/client.ts` - Supabase client

### Types
- `src/types/auth.ts` - Authentication related types
- `src/types/profile.ts` - Profile module related types
- `src/types/user.ts` - User profile related types
- `src/types/notifications.ts` - Notification system related types
- `src/types/messages.ts` - Messaging system related types
- `src/types/mentor.ts` - Mentor system related types

### Right Sidebar
- `src/components/layout/WebRightSidebar.tsx` - Web-only right sidebar component
- `src/hooks/useTrendingTopics.ts` - Hook to fetch trending topics and hashtags
- `src/hooks/useTopContributors.ts` - Hook to fetch top mentors and contributors
- `src/hooks/useFeaturedPitches.ts` - Hook to fetch featured pitch ideas

The right sidebar enhances the Idolyst desktop experience with:
1. **Trending Topics & Hashtags**: Displays clickable hashtags that filter the Launchpad content by topic
2. **Top Mentors & Contributors**: Shows cards with avatar, name, and direct profile links to top community members
3. **Featured PitchHub Ideas**: Presents mini idea cards with title, votes, and click-to-view functionality

The right sidebar is implemented with responsive design principles, smooth animations (fade-in on scroll), hover effects on cards, and real-time data fetching. It's strategically positioned to provide valuable supplementary content while maintaining focus on the main content area.
