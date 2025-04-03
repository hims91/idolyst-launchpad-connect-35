
// Message conversation types
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  sent_at: string;
  read_at: string | null;
  media_url: string | null;
  media_type: string | null;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  is_read: boolean;
  participants?: ConversationParticipant[];
  lastMessage?: Message;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
  profile?: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface ConversationWithDetails extends Conversation {
  participants: ConversationParticipant[];
  lastMessage?: Message;
  otherParticipant: ConversationParticipant;
}

export interface MessageAttachment {
  file: File;
  previewUrl: string;
  type: 'image' | 'document' | 'other';
  uploading: boolean;
  progress: number;
}

export interface TypingIndicator {
  user_id: string;
  conversation_id: string;
  timestamp: number;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';
