export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string | null
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          last_message_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          last_message_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          last_message_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          followed_id: string
          follower_id: string
          id: string
        }
        Insert: {
          created_at?: string
          followed_id: string
          follower_id: string
          id?: string
        }
        Update: {
          created_at?: string
          followed_id?: string
          follower_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_recurring: boolean | null
          mentor_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_recurring?: boolean | null
          mentor_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          mentor_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_availability_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_certifications: {
        Row: {
          created_at: string
          credential_url: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          issue_date: string
          issuer: string
          mentor_id: string
          title: string
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          issue_date: string
          issuer: string
          mentor_id: string
          title: string
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          issue_date?: string
          issuer?: string
          mentor_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_certifications_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_date_exceptions: {
        Row: {
          created_at: string
          exception_date: string
          id: string
          is_available: boolean
          mentor_id: string
        }
        Insert: {
          created_at?: string
          exception_date: string
          id?: string
          is_available?: boolean
          mentor_id: string
        }
        Update: {
          created_at?: string
          exception_date?: string
          id?: string
          is_available?: boolean
          mentor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_date_exceptions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          avg_rating: number | null
          bio: string
          created_at: string
          expertise: Database["public"]["Enums"]["expertise_category"][]
          hourly_rate: number
          id: string
          is_featured: boolean | null
          status: Database["public"]["Enums"]["mentor_status"] | null
          total_reviews: number | null
          total_sessions: number | null
          updated_at: string
          years_experience: number
        }
        Insert: {
          avg_rating?: number | null
          bio: string
          created_at?: string
          expertise: Database["public"]["Enums"]["expertise_category"][]
          hourly_rate: number
          id: string
          is_featured?: boolean | null
          status?: Database["public"]["Enums"]["mentor_status"] | null
          total_reviews?: number | null
          total_sessions?: number | null
          updated_at?: string
          years_experience?: number
        }
        Update: {
          avg_rating?: number | null
          bio?: string
          created_at?: string
          expertise?: Database["public"]["Enums"]["expertise_category"][]
          hourly_rate?: number
          id?: string
          is_featured?: boolean | null
          status?: Database["public"]["Enums"]["mentor_status"] | null
          total_reviews?: number | null
          total_sessions?: number | null
          updated_at?: string
          years_experience?: number
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          id: string
          meeting_link: string | null
          mentee_id: string
          mentor_id: string
          payment_status: boolean | null
          price: number
          session_date: string
          start_time: string
          status: Database["public"]["Enums"]["session_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          meeting_link?: string | null
          mentee_id: string
          mentor_id: string
          payment_status?: boolean | null
          price: number
          session_date: string
          start_time: string
          status?: Database["public"]["Enums"]["session_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          meeting_link?: string | null
          mentee_id?: string
          mentor_id?: string
          payment_status?: boolean | null
          price?: number
          session_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["session_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          id: string
          is_read: boolean | null
          media_type: string | null
          media_url: string | null
          read_at: string | null
          sender_id: string
          sent_at: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          id?: string
          is_read?: boolean | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          sender_id: string
          sent_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          id?: string
          is_read?: boolean | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          sender_id?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          badge_unlock: boolean | null
          email_digest_frequency: string | null
          email_enabled: boolean | null
          id: string
          launchpad_comment: boolean | null
          launchpad_reaction: boolean | null
          launchpad_repost: boolean | null
          leaderboard_shift: boolean | null
          level_up: boolean | null
          mentorship_booking: boolean | null
          mentorship_cancellation: boolean | null
          mentorship_reminder: boolean | null
          muted_until: string | null
          new_follower: boolean | null
          new_message: boolean | null
          pitch_comment: boolean | null
          pitch_feedback: boolean | null
          pitch_vote: boolean | null
          push_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badge_unlock?: boolean | null
          email_digest_frequency?: string | null
          email_enabled?: boolean | null
          id?: string
          launchpad_comment?: boolean | null
          launchpad_reaction?: boolean | null
          launchpad_repost?: boolean | null
          leaderboard_shift?: boolean | null
          level_up?: boolean | null
          mentorship_booking?: boolean | null
          mentorship_cancellation?: boolean | null
          mentorship_reminder?: boolean | null
          muted_until?: string | null
          new_follower?: boolean | null
          new_message?: boolean | null
          pitch_comment?: boolean | null
          pitch_feedback?: boolean | null
          pitch_vote?: boolean | null
          push_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badge_unlock?: boolean | null
          email_digest_frequency?: string | null
          email_enabled?: boolean | null
          id?: string
          launchpad_comment?: boolean | null
          launchpad_reaction?: boolean | null
          launchpad_repost?: boolean | null
          leaderboard_shift?: boolean | null
          level_up?: boolean | null
          mentorship_booking?: boolean | null
          mentorship_cancellation?: boolean | null
          mentorship_reminder?: boolean | null
          muted_until?: string | null
          new_follower?: boolean | null
          new_message?: boolean | null
          pitch_comment?: boolean | null
          pitch_feedback?: boolean | null
          pitch_vote?: boolean | null
          push_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          comment: boolean
          email_notifications: boolean
          id: string
          in_app_notifications: boolean
          mention: boolean
          mentorship_request: boolean
          new_follower: boolean
          new_message: boolean
          pitch_feedback: boolean
          push_notifications: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: boolean
          email_notifications?: boolean
          id?: string
          in_app_notifications?: boolean
          mention?: boolean
          mentorship_request?: boolean
          new_follower?: boolean
          new_message?: boolean
          pitch_feedback?: boolean
          push_notifications?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: boolean
          email_notifications?: boolean
          id?: string
          in_app_notifications?: boolean
          mention?: boolean
          mentorship_request?: boolean
          new_follower?: boolean
          new_message?: boolean
          pitch_feedback?: boolean
          push_notifications?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          related_id: string | null
          related_type: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_drafts: {
        Row: {
          created_at: string
          id: string
          media_urls: string[] | null
          problem_statement: string | null
          solution: string | null
          stage: Database["public"]["Enums"]["idea_stage"] | null
          tags: string[] | null
          target_group: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_urls?: string[] | null
          problem_statement?: string | null
          solution?: string | null
          stage?: Database["public"]["Enums"]["idea_stage"] | null
          tags?: string[] | null
          target_group?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_urls?: string[] | null
          problem_statement?: string | null
          solution?: string | null
          stage?: Database["public"]["Enums"]["idea_stage"] | null
          tags?: string[] | null
          target_group?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pitch_feedback: {
        Row: {
          content: string
          created_at: string
          id: string
          is_mentor_feedback: boolean
          pitch_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_mentor_feedback?: boolean
          pitch_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_mentor_feedback?: boolean
          pitch_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_feedback_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitch_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_ideas: {
        Row: {
          created_at: string
          id: string
          is_premium: boolean
          media_urls: string[] | null
          problem_statement: string
          solution: string
          stage: Database["public"]["Enums"]["idea_stage"]
          tags: string[]
          target_group: string
          title: string
          updated_at: string
          user_id: string
          views_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_premium?: boolean
          media_urls?: string[] | null
          problem_statement: string
          solution: string
          stage: Database["public"]["Enums"]["idea_stage"]
          tags: string[]
          target_group: string
          title: string
          updated_at?: string
          user_id: string
          views_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_premium?: boolean
          media_urls?: string[] | null
          problem_statement?: string
          solution?: string
          stage?: Database["public"]["Enums"]["idea_stage"]
          tags?: string[]
          target_group?: string
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number
        }
        Relationships: []
      }
      pitch_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_id: string | null
          payment_method: string
          payment_status: string
          pitch_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_id?: string | null
          payment_method: string
          payment_status?: string
          pitch_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_id?: string | null
          payment_method?: string
          payment_status?: string
          pitch_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_payments_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitch_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_votes: {
        Row: {
          created_at: string
          id: string
          pitch_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          pitch_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          pitch_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_votes_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitch_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_settings: {
        Row: {
          activity_visibility: string
          id: string
          messaging_permissions: string
          profile_visibility: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_visibility?: string
          id?: string
          messaging_permissions?: string
          profile_visibility?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_visibility?: string
          id?: string
          messaging_permissions?: string
          profile_visibility?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "privacy_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          last_active_tab: string
          portfolio_url: string | null
          professional_details: string | null
          updated_at: string
          username: string | null
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          last_active_tab?: string
          portfolio_url?: string | null
          professional_details?: string | null
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          last_active_tab?: string
          portfolio_url?: string | null
          professional_details?: string | null
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Relationships: []
      }
      session_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_public: boolean | null
          rating: number
          reviewer_id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          rating: number
          reviewer_id: string
          session_id: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          rating?: number
          reviewer_id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentorship_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          platform: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          platform: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          platform?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          comments: number | null
          content: string | null
          created_at: string
          id: string
          likes: number | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          comments?: number | null
          content?: string | null
          created_at?: string
          id?: string
          likes?: number | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          comments?: number | null
          content?: string | null
          created_at?: string
          id?: string
          likes?: number | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_pitch_vote_count: {
        Args: {
          pitch_id: string
        }
        Returns: number
      }
      can_message: {
        Args: {
          sender_id: string
          recipient_id: string
        }
        Returns: boolean
      }
      is_mentor: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      expertise_category:
        | "Business"
        | "Marketing"
        | "Technology"
        | "Design"
        | "Finance"
        | "Product"
        | "Leadership"
        | "Sales"
        | "Operations"
        | "Data"
      idea_stage:
        | "ideation"
        | "mvp"
        | "investment"
        | "pmf"
        | "go_to_market"
        | "growth"
        | "maturity"
      mentor_status: "pending" | "approved" | "rejected"
      notification_type:
        | "new_follower"
        | "new_message"
        | "mentorship_booking"
        | "mentorship_cancellation"
        | "mentorship_reminder"
        | "pitch_vote"
        | "pitch_comment"
        | "pitch_feedback"
        | "level_up"
        | "badge_unlock"
        | "leaderboard_shift"
        | "launchpad_comment"
        | "launchpad_reaction"
        | "launchpad_repost"
        | "payment_success"
      session_status: "scheduled" | "completed" | "cancelled" | "rescheduled"
      user_role: "entrepreneur" | "mentor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
