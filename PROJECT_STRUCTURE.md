
# Idolyst Project Structure

## Core Files and Components

### Authentication
- `src/hooks/useAuth.tsx` - Custom authentication hook to manage auth state
- `src/providers/AuthProvider.tsx` - Auth context provider
- `src/pages/auth/Login.tsx` - Login page
- `src/pages/auth/SignUp.tsx` - Sign up page with role selection
- `src/pages/auth/ForgotPassword.tsx` - Password recovery request page
- `src/pages/auth/ResetPassword.tsx` - Reset password page
- `src/components/auth/RoleSelector.tsx` - Role selection component
- `src/components/auth/PasswordStrengthMeter.tsx` - Password strength indicator

### Layout
- `src/components/layout/Layout.tsx` - Main layout wrapper
- `src/components/layout/WebSidebar.tsx` - Desktop sidebar navigation
- `src/components/layout/MobileNavigation.tsx` - Mobile bottom navigation
- `src/components/layout/MobileHeader.tsx` - Mobile header
- `src/components/layout/AuthLayout.tsx` - Authentication pages layout

### Profile Module
- `src/pages/Profile.tsx` - Main profile page for current user
- `src/pages/ProfileDetail.tsx` - Profile page view for any user by ID
- `src/pages/ProfileEdit.tsx` - Edit profile page
- `src/pages/ActivityFeed.tsx` - User activity feed page
- `src/pages/Settings.tsx` - User settings page
- `src/components/profile/ProfileHeader.tsx` - Header component with user info and actions
- `src/components/profile/ProfileStats.tsx` - Stats and achievements component
- `src/components/profile/ProfileActivity.tsx` - Recent activity component
- `src/components/profile/SocialLinks.tsx` - Social media links component
- `src/components/profile/ProfileTabs.tsx` - Tabs for profile content (posts, ideas, etc.)
- `src/components/profile/FollowersDialog.tsx` - Dialog for followers/following lists

### Routes
- `src/App.tsx` - Main route definitions and auth-protected routes

### UI Components (shadcn/ui)
- Button, Form, Input, Dialog, Toast, etc. (already configured)

### Utilities
- `src/lib/utils.ts` - General utilities
- `src/lib/validation.ts` - Form validation schemas
- `src/lib/animations.ts` - Animation utilities

### API
- `src/api/auth.ts` - Authentication API calls
- `src/api/profile.ts` - Profile-related API calls
- `src/integrations/supabase/client.ts` - Supabase client

### Types
- `src/types/auth.ts` - Authentication related types
- `src/types/profile.ts` - Profile module related types
- `src/types/user.ts` - User profile related types

## Profile Module Implementation Details

### Core Features
1. **Profile Overview**: 
   - Public-facing user profiles with configurable privacy settings
   - Displays user details, stats, activity, and social links
   - Role badges for entrepreneurs and mentors

2. **Profile Editing**:
   - Avatar upload with preview and cropping
   - Username and personal information management
   - Bio and external links configuration

3. **Activities Tracking**:
   - Recent user activities display (posts, pitches, mentorship, etc.)
   - Filterable activity feed with pagination
   - Activity privacy controls

4. **Social Features**:
   - Follow/unfollow functionality
   - Followers and following management
   - Messaging integration

5. **Settings**:
   - Account settings (email, password)
   - Notification preferences
   - Privacy controls
   - Security settings

### Data Models
- **UserProfile**: Core user information
- **SocialLink**: External social media links
- **Badge**: Achievements and recognition
- **Activity**: User actions and engagement
- **PrivacySettings**: User privacy preferences

### Real-time Features
- Profile updates reflect in real-time
- Follow/unfollow counts update instantly
- Activity feed updates with new content
