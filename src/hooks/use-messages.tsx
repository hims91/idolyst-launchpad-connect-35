
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { 
  fetchConversations,
  fetchMessages,
  sendMessage as apiSendMessage,
  markMessagesAsRead,
  createConversation,
  searchMessageableUsers,
  deleteConversation,
  uploadMessageMedia,
  checkUnreadMessages
} from '@/api/messages';
import { 
  Conversation, 
  ConversationWithDetails, 
  Message, 
  MessageAttachment 
} from '@/types/messages';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useMessages = () => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [attachment, setAttachment] = useState<MessageAttachment | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoadingConversations(true);
    const data = await fetchConversations();
    setConversations(data);
    setIsLoadingConversations(false);
  }, [isAuthenticated, user]);
  
  // Load messages for a specific conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!isAuthenticated || !user) return;
    
    setIsLoadingMessages(true);
    const data = await fetchMessages(conversationId);
    setMessages(data);
    
    // Mark messages as read
    await markMessagesAsRead(conversationId);
    
    // Update local state to mark messages as read
    if (data.length > 0) {
      const updatedMessages = data.map(msg => {
        if (msg.sender_id !== user.id && !msg.is_read) {
          return { ...msg, is_read: true };
        }
        return msg;
      });
      setMessages(updatedMessages);
    }
    
    setIsLoadingMessages(false);
  }, [isAuthenticated, user]);
  
  // Send a message
  const sendMessage = useCallback(async (content: string, conversationId?: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Please sign in to send messages",
        variant: "destructive"
      });
      return null;
    }
    
    setIsSendingMessage(true);
    
    try {
      let targetConversationId = conversationId;
      let messageContent = content.trim();
      
      if (messageContent === '') {
        toast({
          title: "Cannot send empty message",
          variant: "destructive"
        });
        return null;
      }
      
      // Handle attachment if present
      let mediaUrl: string | undefined;
      let mediaType: string | undefined;
      
      if (attachment) {
        const media = await uploadMessageMedia(attachment.file, targetConversationId || 'new');
        if (media) {
          mediaUrl = media.url;
          mediaType = media.type;
        }
      }
      
      // Create a new conversation if needed
      if (!targetConversationId && currentConversation) {
        targetConversationId = currentConversation.id;
      }
      
      if (targetConversationId) {
        const message = await apiSendMessage(
          targetConversationId, 
          messageContent,
          mediaUrl,
          mediaType
        );
        
        // Update local state
        if (message) {
          setMessages(prev => [...prev, message]);
          
          // Reset attachment
          setAttachment(null);
        }
        
        return message;
      }
      
      return null;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    } finally {
      setIsSendingMessage(false);
    }
  }, [isAuthenticated, user, attachment, currentConversation]);
  
  // Start a new conversation
  const startConversation = useCallback(async (recipientId: string, initialMessage: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Please sign in to send messages",
        variant: "destructive"
      });
      return null;
    }
    
    setIsSendingMessage(true);
    
    try {
      const { conversation, error } = await createConversation(recipientId, initialMessage);
      
      if (error) {
        toast({
          title: "Couldn't start conversation",
          description: error,
          variant: "destructive"
        });
        return null;
      }
      
      if (conversation) {
        // Update local state
        setConversations(prev => [conversation, ...prev]);
        setCurrentConversation(conversation);
        
        // Load messages for this conversation
        await loadMessages(conversation.id);
        
        return conversation;
      }
      
      return null;
    } catch (error) {
      console.error("Error starting conversation:", error);
      return null;
    } finally {
      setIsSendingMessage(false);
    }
  }, [isAuthenticated, user, loadMessages]);
  
  // Search for users to message
  const searchUsers = useCallback(async (query: string) => {
    if (!isAuthenticated || !user || query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      const results = await searchMessageableUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  }, [isAuthenticated, user]);
  
  // Remove a conversation
  const removeConversation = useCallback(async (conversationId: string) => {
    if (!isAuthenticated || !user) return;
    
    const success = await deleteConversation(conversationId);
    
    if (success) {
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      
      toast({
        title: "Conversation deleted"
      });
    }
  }, [isAuthenticated, user, currentConversation]);
  
  // Handle file selection for attachment
  const handleFileSelection = useCallback((file: File) => {
    if (!file) {
      setAttachment(null);
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }
    
    // Create object URL for preview
    const previewUrl = URL.createObjectURL(file);
    
    // Determine type
    let type: 'image' | 'document' | 'other' = 'other';
    if (file.type.startsWith('image/')) {
      type = 'image';
    } else if (file.type === 'application/pdf' || file.type.includes('document')) {
      type = 'document';
    }
    
    setAttachment({
      file,
      previewUrl,
      type,
      uploading: false,
      progress: 0
    });
  }, []);
  
  // Remove attachment
  const removeAttachment = useCallback(() => {
    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
    setAttachment(null);
  }, [attachment]);
  
  // Check for unread messages count
  const checkUnread = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    const count = await checkUnreadMessages();
    setUnreadCount(count);
  }, [isAuthenticated, user]);
  
  // Set up real-time updates
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    // Subscribe to new messages in all conversations
    const messageSubscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, 
        async (payload) => {
          const newMessage = payload.new as Message;
          const senderIsCurrentUser = newMessage.sender_id === user.id;
          
          // If the message is for the current conversation, add it to the messages list
          if (currentConversation?.id === newMessage.conversation_id) {
            setMessages(prev => [...prev, newMessage]);
            
            // If the message is from another user, mark it as read
            if (!senderIsCurrentUser) {
              await markMessagesAsRead(newMessage.conversation_id);
            }
          }
          
          // Update conversations list to show latest message
          setConversations(prev => {
            const conversationIndex = prev.findIndex(c => c.id === newMessage.conversation_id);
            
            if (conversationIndex === -1) {
              // We don't have this conversation yet, need to reload conversations
              loadConversations();
              return prev;
            }
            
            // Update last message and move this conversation to the top
            const newConversations = [...prev];
            const conversation = { ...newConversations[conversationIndex] };
            
            conversation.lastMessage = newMessage;
            conversation.last_message_at = newMessage.sent_at;
            
            // If the message is from another user and not in current view, mark as unread
            if (!senderIsCurrentUser && currentConversation?.id !== newMessage.conversation_id) {
              conversation.is_read = false;
            }
            
            // Remove the conversation from its current position
            newConversations.splice(conversationIndex, 1);
            
            // Add it to the beginning of the array
            return [conversation, ...newConversations];
          });
          
          // Update unread count
          if (!senderIsCurrentUser) {
            checkUnread();
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [isAuthenticated, user, currentConversation, loadConversations, checkUnread]);
  
  // Initial load of conversations and unread count
  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversations();
      checkUnread();
    } else {
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user, loadConversations, checkUnread]);
  
  // Select a conversation and load its messages
  const selectConversation = useCallback((conversation: ConversationWithDetails) => {
    setCurrentConversation(conversation);
    loadMessages(conversation.id);
    
    // Update conversations list to mark this one as read
    setConversations(prev => 
      prev.map(c => 
        c.id === conversation.id 
          ? { ...c, is_read: true } 
          : c
      )
    );
  }, [loadMessages]);
  
  return {
    conversations,
    currentConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSendingMessage,
    searchResults,
    searchQuery,
    isSearching,
    attachment,
    unreadCount,
    loadConversations,
    loadMessages,
    sendMessage,
    startConversation,
    searchUsers,
    removeConversation,
    selectConversation,
    handleFileSelection,
    removeAttachment,
    checkUnread,
    setCurrentConversation
  };
};
