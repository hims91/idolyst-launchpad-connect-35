
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { checkUnreadMessages } from '@/api/messages';
import { supabase } from '@/integrations/supabase/client';

export const useUnreadMessages = () => {
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check for unread messages
  const checkUnread = async () => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return;
    }
    
    setIsLoading(true);
    try {
      const count = await checkUnreadMessages();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error checking unread messages:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set up real-time updates for messages
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return;
    }
    
    // Initial check
    checkUnread();
    
    // Subscribe to new messages
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
          const newMessage = payload.new as any;
          
          // If the message is not from the current user, increment unread count
          if (newMessage.sender_id !== user.id) {
            checkUnread();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          // When a message is marked as read, update the count
          const updatedMessage = payload.new as any;
          if (updatedMessage.is_read && !payload.old.is_read) {
            checkUnread();
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [isAuthenticated, user]);
  
  return { 
    unreadCount, 
    checkUnread, 
    isLoading 
  };
};
