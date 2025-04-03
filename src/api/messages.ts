
import { supabase } from "@/integrations/supabase/client";
import { 
  Conversation, 
  ConversationWithDetails, 
  Message,
  ConversationParticipant
} from "@/types/messages";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

// Fetch conversations for the current user
export const fetchConversations = async (): Promise<ConversationWithDetails[]> => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) throw new Error("User not authenticated");

    // Get all conversations the user is a participant in
    const { data: participations, error: participationsError } = await supabase
      .from("conversation_participants")
      .select(`
        conversation_id,
        conversations:conversation_id (
          id,
          created_at,
          updated_at,
          last_message_at,
          is_read
        )
      `)
      .eq("user_id", userId)
      .order("last_message_at", { foreignTable: "conversations", ascending: false });

    if (participationsError) throw participationsError;

    if (!participations || participations.length === 0) {
      return [];
    }

    // Extract conversation IDs
    const conversationIds = participations.map(p => p.conversation_id);

    // Get last messages for each conversation
    const { data: lastMessages, error: lastMessagesError } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", conversationIds)
      .order("sent_at", { ascending: false })
      .limit(1, { foreignTable: "conversation_id" });

    if (lastMessagesError) throw lastMessagesError;

    // Get all participants for these conversations
    const { data: allParticipants, error: participantsError } = await supabase
      .from("conversation_participants")
      .select(`
        id,
        conversation_id,
        user_id,
        joined_at,
        last_read_at,
        profile:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .in("conversation_id", conversationIds);

    if (participantsError) throw participantsError;

    // Build conversation details
    const conversations = participations.map(p => {
      const conversation = p.conversations as Conversation;
      
      // Find all participants for this conversation
      const participants = allParticipants
        .filter(participant => participant.conversation_id === conversation.id)
        .map(participant => ({
          ...participant,
          profile: participant.profile as ConversationParticipant['profile']
        }));
      
      // Find the other participant (not the current user)
      const otherParticipant = participants.find(p => p.user_id !== userId) as ConversationParticipant;
      
      // Find last message for this conversation
      const lastMessage = lastMessages?.find(m => m.conversation_id === conversation.id);
      
      return {
        ...conversation,
        participants,
        lastMessage,
        otherParticipant
      };
    });

    return conversations;
  } catch (error: any) {
    console.error("Error fetching conversations:", error.message);
    return [];
  }
};

// Fetch a single conversation by ID
export const fetchConversation = async (conversationId: string): Promise<ConversationWithDetails | null> => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) throw new Error("User not authenticated");

    // Get the conversation
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (conversationError) throw conversationError;

    // Get all participants
    const { data: participants, error: participantsError } = await supabase
      .from("conversation_participants")
      .select(`
        id,
        conversation_id,
        user_id,
        joined_at,
        last_read_at,
        profile:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq("conversation_id", conversationId);

    if (participantsError) throw participantsError;

    // Get last message
    const { data: lastMessage, error: lastMessageError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("sent_at", { ascending: false })
      .limit(1)
      .single();

    if (lastMessageError && lastMessageError.code !== 'PGRST116') throw lastMessageError;

    // Find the other participant (not the current user)
    const otherParticipant = participants.find(p => p.user_id !== userId) as ConversationParticipant;

    const typedParticipants = participants.map(p => ({
      ...p,
      profile: p.profile as ConversationParticipant['profile']
    }));

    return {
      ...conversation,
      participants: typedParticipants,
      lastMessage: lastMessage || undefined,
      otherParticipant
    };
  } catch (error: any) {
    console.error("Error fetching conversation:", error.message);
    return null;
  }
};

// Fetch messages for a specific conversation
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("sent_at", { ascending: true });

    if (error) throw error;
    return data as Message[];
  } catch (error: any) {
    console.error("Error fetching messages:", error.message);
    return [];
  }
};

// Send a new message
export const sendMessage = async (
  conversationId: string, 
  content: string, 
  mediaUrl?: string,
  mediaType?: string
): Promise<Message | null> => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) throw new Error("User not authenticated");

    const messageId = uuidv4();
    
    const { data, error } = await supabase
      .from("messages")
      .insert({
        id: messageId,
        conversation_id: conversationId,
        sender_id: userId,
        content,
        media_url: mediaUrl || null,
        media_type: mediaType || null
      })
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  } catch (error: any) {
    console.error("Error sending message:", error.message);
    toast({
      variant: "destructive",
      title: "Couldn't send message",
      description: error.message
    });
    return null;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) throw new Error("User not authenticated");

    // Mark all messages in the conversation as read
    const { error: messagesError } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("is_read", false);

    if (messagesError) throw messagesError;

    // Update the last_read_at timestamp for the participant
    const { error: participantError } = await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", userId);

    if (participantError) throw participantError;

    return true;
  } catch (error: any) {
    console.error("Error marking messages as read:", error.message);
    return false;
  }
};

// Create a new conversation
export const createConversation = async (recipientId: string, initialMessage: string): Promise<{ conversation: ConversationWithDetails | null, error?: string }> => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) {
      return { conversation: null, error: "User not authenticated" };
    }

    // Check if we can message this user
    const { data: canMessageData, error: canMessageError } = await supabase
      .rpc("can_message", { sender_id: userId, recipient_id: recipientId });

    if (canMessageError) throw canMessageError;

    if (!canMessageData) {
      return { 
        conversation: null, 
        error: "You can only message users who follow you or users you are in a mentorship with."
      };
    }

    // Check if a conversation already exists between these users
    const { data: existingConvs, error: existingError } = await supabase
      .from("conversation_participants")
      .select(`
        conversation_id,
        other_participants:conversation_participants!inner(user_id)
      `)
      .eq("user_id", userId);

    if (existingError) throw existingError;

    let existingConversationId = null;
    
    if (existingConvs && existingConvs.length > 0) {
      // Look for a conversation where the other user is the recipient
      for (const conv of existingConvs) {
        const hasRecipient = conv.other_participants.some(
          (p: { user_id: string }) => p.user_id === recipientId
        );
        
        if (hasRecipient) {
          existingConversationId = conv.conversation_id;
          break;
        }
      }
    }

    // If conversation exists, just send the message
    if (existingConversationId) {
      await sendMessage(existingConversationId, initialMessage);
      return { conversation: await fetchConversation(existingConversationId) };
    }

    // Start a new transaction to create conversation and add participants
    let conversationId: string | null = null;
    
    // Create new conversation
    const { data: newConversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({})
      .select()
      .single();

    if (conversationError) throw conversationError;
    
    conversationId = newConversation.id;
    
    // Add current user as participant
    const { error: addSenderError } = await supabase
      .from("conversation_participants")
      .insert({
        conversation_id: conversationId,
        user_id: userId
      });

    if (addSenderError) throw addSenderError;
    
    // Add recipient as participant
    const { error: addRecipientError } = await supabase
      .from("conversation_participants")
      .insert({
        conversation_id: conversationId,
        user_id: recipientId
      });
    
    if (addRecipientError) throw addRecipientError;
    
    // Send initial message
    await sendMessage(conversationId, initialMessage);
    
    // Get the full conversation details
    const conversation = await fetchConversation(conversationId);
    
    return { conversation };
  } catch (error: any) {
    console.error("Error creating conversation:", error.message);
    return { 
      conversation: null, 
      error: `Failed to create conversation: ${error.message}` 
    };
  }
};

// Search for users who can be messaged
export const searchMessageableUsers = async (query: string): Promise<any[]> => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) throw new Error("User not authenticated");

    // First get users who follow the current user or are followed by the current user
    const { data: follows, error: followsError } = await supabase
      .from("follows")
      .select(`
        followed_id,
        follower_id
      `)
      .or(`followed_id.eq.${userId},follower_id.eq.${userId}`);

    if (followsError) throw followsError;

    if (!follows || follows.length === 0) {
      return [];
    }

    // Extract user IDs who either follow the user or are followed by the user
    const connectionUserIds = follows.map(f => 
      f.followed_id === userId ? f.follower_id : f.followed_id
    );

    // Search for users matching the query among the connections
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select(`
        id,
        username,
        full_name,
        avatar_url
      `)
      .in("id", connectionUserIds)
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10);

    if (usersError) throw usersError;
    
    return users || [];
  } catch (error: any) {
    console.error("Error searching for users:", error.message);
    return [];
  }
};

// Delete a conversation
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error deleting conversation:", error.message);
    toast({
      variant: "destructive",
      title: "Couldn't delete conversation",
      description: error.message
    });
    return false;
  }
};

// Upload media for a message
export const uploadMessageMedia = async (file: File, conversationId: string): Promise<{ url: string; type: string } | null> => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) throw new Error("User not authenticated");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${conversationId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `message-attachments/${fileName}`;
    
    let mediaType = 'document';
    if (file.type.startsWith('image/')) {
      mediaType = 'image';
    }
    
    const { error: uploadError } = await supabase.storage
      .from('messages')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('messages')
      .getPublicUrl(filePath);
    
    return {
      url: urlData.publicUrl,
      type: mediaType
    };
  } catch (error: any) {
    console.error("Error uploading media:", error.message);
    toast({
      variant: "destructive",
      title: "Couldn't upload media",
      description: error.message
    });
    return null;
  }
};

// Check for unread messages
export const checkUnreadMessages = async (): Promise<number> => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) return 0;

    // Get conversations the user is part of
    const { data: participations, error: participationsError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", userId);

    if (participationsError) throw participationsError;

    if (!participations || participations.length === 0) {
      return 0;
    }

    const conversationIds = participations.map(p => p.conversation_id);

    // Count unread messages not sent by the current user
    const { count, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .in("conversation_id", conversationIds)
      .eq("is_read", false)
      .neq("sender_id", userId);

    if (countError) throw countError;

    return count || 0;
  } catch (error: any) {
    console.error("Error checking unread messages:", error.message);
    return 0;
  }
};
