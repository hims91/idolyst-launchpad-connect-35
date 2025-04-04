
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
- `src/components/auth/SocialLoginButtons.tsx` - Social login options (Google, LinkedIn)
- `src/components/auth/TwoFactorSetup.tsx` - Two-factor authentication setup
- `src/components/auth/TwoFactorVerification.tsx` - Two-factor authentication verification
- `src/api/auth.ts` - Authentication API calls and helper functions

### Authentication Enhancements
The authentication system has been significantly enhanced with:

1. **Social Login Integration**
   - Google and LinkedIn OAuth authentication
   - Seamless social sign-up and sign-in flows
   - Provider connection management in user profile
   - Persistent provider data storage in Supabase

2. **Two-Factor Authentication (2FA)**
   - Complete TOTP-based 2FA implementation
   - QR code setup for authenticator apps
   - Challenge verification during login
   - Visual verification flow with clear user feedback

3. **Enhanced User Profiles**
   - Professional byline system (displayed with user content)
   - LinkedIn-style experience tracking for work history
   - Educational qualifications and certification management
   - Rich profile management interface

4. **Improved Authentication Flow**
   - More robust email verification workflow
   - Enhanced password reset experience
   - Better error handling and user feedback
   - Streamlined OAuth callback processing
   - Session persistence improvements

5. **Mobile-First Design**
   - Responsive authentication UI across all devices
   - Touch-optimized interface with intuitive controls
   - Smooth animations and transitions
   - Accessible form design with clear validation

### Layout
- `src/components/layout/Layout.tsx` - Main layout wrapper
- `src/components/layout/WebSidebar.tsx` - Desktop sidebar navigation with authentication state
- `src/components/layout/MobileNavigation.tsx` - Mobile bottom navigation
- `src/components/layout/MobileHeader.tsx` - Mobile header with authentication state
- `src/components/layout/AuthLayout.tsx` - Authentication pages layout

### Theme System
- `src/hooks/use-theme.tsx` - Theme management with context provider, browser preference detection, persistent storage in localStorage and user profile, and APIs for theme switching
- Theme implementation supports three modes:
  - Light mode: Default bright theme
  - Dark mode: Low-light UI for night usage and eye comfort
  - System mode: Automatically follows the user's system preference
- Responsive design considerations with different theme toggle placements for mobile and desktop
- Smooth theme transitions with CSS animations

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

### Professional Profile System
- `src/components/profile/ProfileExperience.tsx` - LinkedIn-style work experience component
- `src/components/profile/ProfileExperienceForm.tsx` - Form for adding and editing work experiences
- `src/components/profile/ProfileQualifications.tsx` - Educational qualifications component
- `src/components/profile/ProfileQualificationForm.tsx` - Form for adding and editing education
- `src/components/profile/ProfileByline.tsx` - Professional headline component

The professional profile system enhances user profiles with:
1. **Professional Byline**: Short professional headline displayed with user content
2. **Work Experience**: Chronological work history with company, position, dates, and descriptions
3. **Education**: Academic qualifications with institutions, degrees, dates, and descriptions
4. **Rich Editing Interface**: Intuitive forms for managing professional details
5. **Validation**: Form validation to ensure data quality and consistency

