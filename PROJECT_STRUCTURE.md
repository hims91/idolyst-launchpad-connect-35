
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
- `src/components/layout/Layout.tsx` - Main layout wrapper (already exists)
- `src/components/layout/WebSidebar.tsx` - Desktop sidebar navigation (already exists)
- `src/components/layout/MobileNavigation.tsx` - Mobile bottom navigation (already exists)
- `src/components/layout/MobileHeader.tsx` - Mobile header (already exists)
- `src/components/layout/AuthLayout.tsx` - Authentication pages layout

### Routes
- `src/App.tsx` - Main route definitions and auth-protected routes

### UI Components (shadcn/ui)
- Button, Form, Input, Dialog, Toast, etc. (already configured)

### Utilities
- `src/lib/utils.ts` - General utilities (already exists)
- `src/lib/validation.ts` - Form validation schemas
- `src/lib/animations.ts` - Animation utilities

### API
- `src/api/auth.ts` - Authentication API calls
- `src/integrations/supabase/client.ts` - Supabase client (already exists)

### Types
- `src/types/auth.ts` - Authentication related types
- `src/types/user.ts` - User profile related types

