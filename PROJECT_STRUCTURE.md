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

### MentorSpace Module
- `src/pages/MentorSpace.tsx` - Main entry page for MentorSpace features
- `src/pages/mentorspace/MentorDirectory.tsx` - Browse and filter available mentors
- `src/pages/mentorspace/MentorProfile.tsx` - View a mentor's profile and book sessions
- `src/pages/mentorspace/SessionManagement.tsx` - Manage mentorship sessions
- `src/pages/mentorspace/MentorApplication.tsx` - Apply to become a mentor
- `src/pages/mentorspace/MentorProfilePage.tsx` - Mentor's own profile management page
- `src/components/mentorspace/MentorCard.tsx` - Card component for displaying mentor information
- `src/components/mentorspace/MentorCardSkeleton.tsx` - Loading skeleton for mentor cards
- `src/components/mentorspace/FilterBar.tsx` - Filter interface for mentor directory
- `src/components/mentorspace/CertificationCard.tsx` - Display a mentor's certification
- `src/components/mentorspace/ReviewCard.tsx` - Display a mentor review
- `src/components/mentorspace/SessionCard.tsx` - Card for displaying session information
- `src/components/mentorspace/AvailabilityPicker.tsx` - Date and time slot selection for booking
- `src/components/mentorspace/BookingForm.tsx` - Form for completing session booking
- `src/components/mentorspace/ReviewForm.tsx` - Form for submitting session reviews
- `src/components/mentorspace/MentorApplicationForm.tsx` - Form for applying to be a mentor
- `src/components/mentorspace/EmptyState.tsx` - Empty states for various MentorSpace views
- `src/api/mentor.ts` - API functions for mentor-related operations
- `src/hooks/use-mentors.tsx` - Custom hooks for mentor-related data and operations
- `src/types/mentor.ts` - TypeScript types for mentors, sessions, and reviews

### Ascend Module (Gamification)

The Ascend module is a comprehensive gamification system that rewards users for their activities on the platform with XP, badges, leaderboard rankings, and redeemable rewards.

#### Database Structure

- **profiles**: Contains user XP and level information
- **badges**: Badge definitions with names, descriptions, and icons
- **user_badges**: Tracks which badges users have earned
- **badge_progress**: Tracks progress towards earning badges
- **rewards**: Available rewards that can be claimed with XP
- **user_rewards**: Tracks rewards claimed by users
- **xp_transactions**: Log of all XP earned or spent by users
- **login_streaks**: Tracks daily login streaks
- **leaderboard_history**: Historical record of user rankings

#### API Functionality

- XP earning for various platform activities (posts, feedback, mentorship, etc.)
- Badge awarding based on achievements and milestones
- Leaderboard ranking system with weekly and monthly timeframes
- Reward claiming system with XP expenditure
- Login streak tracking and bonus XP for consecutive days

#### User Interface

- **Dashboard**: Overview of user's XP, level, badges, rewards, and leaderboard position
- **Badges Page**: Display of earned badges and progress towards locked badges
- **Rewards Shop**: Allows users to claim rewards by spending XP
- **XP History**: Chronological record of XP transactions
- **Leaderboard**: Rankings of users by XP with position changes

#### Integration with Other Modules

The Ascend module is deeply integrated with other platform features:

- **Notifications**: Users receive notifications for level-ups, badge unlocks, and leaderboard position changes
- **Profile**: User profiles display level, XP, and badges
- **PitchHub**: Submitting ideas and providing feedback earns XP
- **MentorSpace**: Completing mentorship sessions earns XP for both mentor and mentee
- **Launchpad**: Engagement with content earns XP

#### Technical Implementation

- Real-time XP updates using Supabase's realtime functionality
- Database triggers for automatic XP awarding and badge unlocking
- Row-level security policies to ensure data privacy
- React components for badges, rewards, and leaderboard with animations
- XP visualization with progress bars and level indicators

#### Key Components

- **XpProgress**: Shows progress towards next level with animated indicators
- **BadgeCard**: Displays badge info with earned/locked states and progress
- **RewardCard**: Shows available rewards with claim buttons
- **XpTransactionList**: Records recent XP activities with visual cues
- **AscendStats**: Mini-component for embedding in profile pages

#### Pages

- **Ascend**: Entry point with options to view dashboard or leaderboard
- **Dashboard**: Main view with personal XP stats, badges, rewards
- **Leaderboard**: Rankings with weekly/monthly toggle and position changes

This gamification system encourages platform engagement, creates a sense of progression, and rewards users for contributing positively to the community.

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
- `src/api/mentor.ts` - Mentor-related API calls
- `src/integrations/supabase/client.ts` - Supabase client

### Types
- `src/types/auth.ts` - Authentication related types
- `src/types/profile.ts` - Profile module related types
- `src/types/user.ts` - User profile related types
- `src/types/notifications.ts` - Notification system related types
- `src/types/messages.ts` - Messaging system related types
- `src/types/mentor.ts` - Mentor system related types

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

## MentorSpace Module Implementation Details

### Core Features

1. **Mentor Directory**:
   - Browse mentors with filtering by expertise, price range, rating
   - Search functionality for finding mentors by name or keywords
   - Mobile-optimized grid/list view with mentor cards
   - Real-time data with Supabase integration
   - Sorting options (rating, price, session count)
   - Advanced SEO optimization with structured data

2. **Mentor Profiles**:
   - Detailed profile pages with bio, expertise, pricing
   - Certification and credential display
   - Client reviews and ratings
   - Session availability calendar
   - Booking interface with time slot selection
   - Social media links and professional information

3. **Session Management**:
   - Book, reschedule, and cancel sessions
   - View upcoming and past sessions
   - Meeting link management
   - Session status tracking (scheduled, completed, cancelled)
   - User-friendly mobile interface with separate tabs for different session statuses
   - Real-time updates when sessions are modified

4. **Review System**:
   - Leave reviews and ratings for completed sessions
   - Public/private review options
   - Average rating calculation
   - Impact on mentor visibility and ranking
   - Rich review display with user information

5. **Mentor Application**:
   - Apply to become a mentor
   - Set expertise, hourly rate, and availability
   - Admin approval flow with status tracking
   - Certification and credential management
   - User-friendly mobile-first application process

### Database Schema Integration

The mentor-profile integration leverages Supabase with the following key elements:

1. **Tables and Relationships**:
   - `mentors`: Stores mentor profiles with expertise, rates, and statistics
   - `mentor_certifications`: Tracks professional certifications and credentials
   - `mentor_availability`: Manages recurring weekly availability slots
   - `mentor_date_exceptions`: Handles specific date exceptions
   - `mentorship_sessions`: Records booked sessions with status tracking
   - `session_reviews`: Stores session feedback and ratings
   - `profiles`: Extended by mentor data to provide a unified user experience

2. **Row-Level Security Policies**:
   - Ensures mentors can only view and manage their own information
   - Provides public read access to approved mentor profiles
   - Restricts session access to the relevant mentor and mentee
   - Controls review visibility based on public/private settings
   - Secures the booking process with proper access controls

3. **Real-time Updates**:
   - Implements Supabase real-time subscriptions for session status changes
   - Provides immediate notification of booking confirmations
   - Updates mentor ratings instantly when reviews are submitted
   - Synchronizes availability when sessions are booked

### Integration with User Profiles

The mentor-profile integration connects with the user profile system:

1. **Unified User Experience**:
   - Seamless transition between user profile and mentor profile
   - Extended profile data for mentors with professional information
   - Consistent UI/UX across both modules

2. **Role-Based Features**:
   - Mentor-specific dashboard for those with mentor role
   - Special indicators and badges for mentors in the general user interface
   - Role-appropriate actions in session management

### Mobile-First UI/UX Design

The implementation follows mobile-first design principles:

1. **Responsive Interfaces**:
   - Adaptive layouts that work on any screen size
   - Touch-friendly components with appropriate sizing
   - Collapsible sections and progressive disclosure for complex information

2. **Performance Optimization**:
   - Efficient loading states with skeleton components
   - Lazy loading of reviews and certifications
   - Optimized images and assets

3. **Animation and Transitions**:
   - Smooth page transitions using Framer Motion
   - Subtle feedback animations for user interactions
   - Staggered animations for list items

### Advanced SEO Implementation

The integration includes comprehensive SEO optimization:

1. **Structured Data**:
   - JSON-LD for mentor profiles with rich person schema
   - Review markup for social proof
   - Service and offer schemas for mentorship sessions

2. **Metadata Optimization**:
   - Dynamic, descriptive page titles
   - Custom meta descriptions for each page
   - Open Graph tags for social sharing

3. **Semantic HTML**:
   - Proper heading hierarchy
   - Accessible landmarks and regions
   - Meaningful alt text for images

### Real-Time Capabilities

The implementation leverages Supabase's real-time features:

1. **Session Updates**:
   - Instant notification when a session is booked
   - Real-time status updates for both mentor and mentee
   - Live availability updates in the booking interface

2. **Rating and Review Changes**:
   - Immediate profile updates when reviews are submitted
   - Real-time calculation of average ratings
   - Instant feedback for users submitting reviews

3. **Security and Privacy**:
   - RLS policies ensure data is only accessible to authorized users
   - Real-time channel authorization follows the same security rules
   - Private information is properly protected

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

## Launchpad (Home Feed) Module

The Launchpad module serves as the main content hub where users engage with posts, discover trends, and connect with the startup ecosystem community. This module is implemented with a mobile-first approach, featuring modern UI/UX elements, animations, and responsive design.

### Core Features

1. **Interactive Feed with Multiple Views**:
   - Trending algorithm that ranks posts based on engagement metrics and recency
   - Following feed that displays content from users the logged-in user follows
   - Latest feed that shows the most recent posts chronologically
   - Category-based filtering system with a horizontally scrollable filter bar

2. **Post Creation**:
   - Rich post creation interface with 500 character limit
   - Category selection and tagging system
   - Media upload capabilities for images
   - URL sharing with preview functionality

3. **Engagement Features**:
   - Multiple reaction types (Like, Insightful, Fundable, Innovative, Collab Worthy)
   - Threaded comments and replies
   - Repost functionality similar to Twitter/X
   - Share options for various platforms
   - Bookmark/save functionality

4. **Gamification Integration**:
   - XP rewards for posting and receiving engagement
   - Integration with the Ascend module for achievements

### Implementation Details

#### Database Schema
- Post-related tables with realtime enabled
- Engagement tracking tables (reactions, comments, reposts, shares, saves)
- Database functions for engagement scoring and trending calculations
- XP award triggers and notification triggers

#### Components
- `LaunchpadFeed`: Main feed component with infinite scrolling
- `PostCard`: Versatile card component for displaying posts in feed and detail views
- `CategoryFilter`: Horizontally scrollable filter selection with active state indicators
- `CreatePostModal`: Rich post creation interface with media upload
- `ReactionPopover`: Interactive reaction selector
- `ShareMenu`: Platform-specific sharing options

#### APIs
- Real-time data fetching with Supabase
- Optimistic UI updates for immediate feedback
- Engagement scoring algorithm for trend calculation

#### SEO Optimization
- Meta tags for social sharing
- Structured data for search engines
- Mobile-friendly layout

#### Performance Optimizations
- Virtualized lists for handling large feeds
- Lazy loading of images and media
- Optimistic UI updates for better perceived performance

The Launchpad module is fully integrated with the authentication system, user profiles, and the Ascend gamification system, creating a cohesive experience across the platform.
