
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

### Notification System
- `src/pages/Notifications.tsx` - Notifications listing page with chronological grouping
- `src/components/settings/NotificationSettings.tsx` - Notification preferences management
- `src/components/notifications/NotificationIcon.tsx` - Icon components for different notification types
- `src/components/notifications/NotificationItem.tsx` - Individual notification component with actions
- `src/components/notifications/EmptyNotifications.tsx` - Empty state for notifications
- `src/api/notifications.ts` - API functions for notifications (fetch, mark as read, etc.)
- `src/hooks/use-notifications.tsx` - Custom hook for managing notifications state and realtime updates
- `src/types/notifications.ts` - TypeScript types for notifications and preferences

### Messaging System
- `src/pages/Messages.tsx` - Main messaging page with conversation list and message view
- `src/components/messages/ConversationList.tsx` - List of all conversations with search functionality
- `src/components/messages/ConversationItem.tsx` - Individual conversation item with user info and message preview
- `src/components/messages/ConversationView.tsx` - Display of a selected conversation with messages and attachments
- `src/components/messages/MessageItem.tsx` - Individual message component with support for text and media
- `src/components/messages/MessageInput.tsx` - Input component for sending messages with attachment support
- `src/components/messages/MobileHeader.tsx` - Mobile-specific header with context switching
- `src/components/messages/EmptyState.tsx` - Empty state when no conversation is selected
- `src/components/messages/NewMessageModal.tsx` - Modal for starting a new conversation with user search
- `src/api/messages.ts` - API functions for messages (fetch, send, read, delete, etc.)
- `src/hooks/use-messages.tsx` - Custom hook for managing messages state and realtime updates
- `src/hooks/use-unread-messages.tsx` - Hook for tracking unread message count for notifications
- `src/types/messages.ts` - TypeScript types for messages, conversations and attachments

### Routes
- `src/App.tsx` - Main route definitions and auth-protected routes

### UI Components (shadcn/ui)
- Button, Form, Input, Dialog, Toast, etc. (already configured)

### Utilities
- `src/lib/utils.ts` - General utilities for formatting, validation, and UI helpers
- `src/lib/validation.ts` - Form validation schemas
- `src/lib/animations.ts` - Animation utilities for Framer Motion transitions
- `src/lib/supabase-types.ts` - TypeScript types for Supabase client

### API
- `src/api/auth.ts` - Authentication API calls
- `src/api/profile.ts` - Profile-related API calls
- `src/api/notifications.ts` - Notification-related API calls
- `src/api/messages.ts` - Messaging-related API calls
- `src/integrations/supabase/client.ts` - Supabase client

### Types
- `src/types/auth.ts` - Authentication related types
- `src/types/profile.ts` - Profile module related types
- `src/types/user.ts` - User profile related types
- `src/types/notifications.ts` - Notification system related types
- `src/types/messages.ts` - Messaging system related types

## Messaging System Implementation Details

### Core Features
1. **Conversations Management**:
   - One-on-one messaging between connected users (followers or mentor-mentee pairs)
   - Real-time conversation updates with Supabase Realtime
   - Conversation list with most recent messages first
   - Visual indicators for unread messages with badges
   - Search functionality for existing conversations

2. **Messaging Interface**:
   - Real-time message delivery with animated transitions
   - Read receipts with double-check indicators
   - Media sharing with preview (images, documents, links)
   - Dynamically resizing text input area
   - Mobile-optimized experience with responsive design

3. **User Experience**:
   - Seamless transitions between conversation list and conversation view
   - Smooth animations for message delivery
   - Intuitive navigation with mobile-first approach
   - Message grouping by sender and time
   - Visual feedback on message status (sending, sent, delivered, read)

4. **Security & Privacy**:
   - Restricted messaging between connected users only (followers)
   - Row-Level Security (RLS) ensures users can only access their conversations
   - Protected file storage for message attachments

### Database Schema
- **conversations**: Tracks individual conversations
- **conversation_participants**: Maps users to conversations (many-to-many relationship)
- **messages**: Stores message content, media links, and read status
- **follows**: Used to determine messaging eligibility (users can only message if they follow each other)

### Row-Level Security (RLS)
- Users can only view and modify conversations they are participants in
- Message creation restricted to conversation participants
- Conversation creation checked against follow relationship
- File uploads secured by user ID verification

### Real-time Features
- Instant message delivery using Supabase Realtime
- Live typing indicators with animation
- Real-time read receipts
- Unread message count updates across devices

### UI Components and Animation
- Mobile-first responsive design with distinctive message bubbles
- Smooth transitions between conversation states
- Animation for new messages with slide-in effects
- Loading states for all data fetching operations
- Scroll-to-bottom button for long conversations

### Media Handling
- Support for image uploads with preview
- Document attachment capabilities
- Secure file storage using Supabase Storage
- Progress indicators for media uploads

### Search and Filtering
- Real-time search through conversations by username or message content
- Results highlight matching terms
- Empty state indicators for no matching results

### Performance Optimizations
- Message grouping to reduce DOM nodes
- Lazy loading of images and media
- Debounced search to prevent excessive API calls
- Optimized real-time subscriptions

### Accessibility Features
- High contrast message bubbles
- Keyboard navigation support
- Screen reader compatible components
- Touch targets sized appropriately for mobile

## Notification System Implementation Details

### Core Features
1. **Notification Center**:
   - Chronological listing of notifications with visual indicators for unread items
   - Grouping by date (Today, Yesterday, Older)
   - "Mark all as read" functionality
   - Swipe-to-dismiss gesture on mobile
   - Real-time updates when new notifications arrive

2. **Notification Types**:
   - Social interactions: new followers, messages
   - Mentorship: session bookings, cancellations, reminders
   - PitchHub: votes, comments, mentor feedback
   - Ascend: level-ups, badge unlocks, leaderboard shifts
   - Launchpad: comments, reactions, reposts

3. **Notification Preferences**:
   - Fine-grained control over which notifications to receive
   - Delivery method settings (in-app, push, email)
   - Email digest frequency options (daily, weekly, never)
   - Temporary muting capabilities (1 hour, 4 hours, 24 hours)

4. **UI/UX Features**:
   - Unread notification badges in navigation
   - Custom icons and colors for different notification types
   - Smooth animations for new notifications
   - Empty state for no notifications
   - Mobile-first responsive design

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
   - Professional details and portfolio URL management
   - Social links management with automatic platform icon detection

3. **Activities Tracking**:
   - Recent user activities display (posts, pitches, mentorship, etc.)
   - Filterable activity feed with pagination
   - Activity privacy controls

4. **Social Features**:
   - Follow/unfollow functionality with real-time updates
   - Followers and following management with user lists
   - Direct messaging integration

5. **Settings**:
   - Account settings (email, password)
   - Notification preferences
   - Privacy controls
   - Security settings

## UI/UX Animations (Mobile-First)
- **Transitions**: Page loads with swipe-and-fade; button taps trigger scale effects
- **Feedback**: Successful actions show checkmark or ripple animations
- **Touch-Friendly**: Buttons ≥48px; swipe gestures for navigation
- **Real-Time Updates**: Notifications and messages slide in; counters update with subtle bounce

## SEO Optimization
- **Meta Tags**: Dynamic page titles and descriptions based on content
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Performance**: Optimized loading with lazy loading for images
- **Mobile Responsiveness**: Full mobile optimization for all features
