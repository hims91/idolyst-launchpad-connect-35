
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { checkUnreadMessages } from '@/api/messages';
import { supabase } from '@/integrations/supabase/client';

export const useUnreadMessages = () => {
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Check for unread messages
  const checkUnread = async () => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return;
    }
    
    const count = await checkUnreadMessages();
    setUnreadCount(count);
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
      .subscribe();
    
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [isAuthenticated, user]);
  
  return { unreadCount, checkUnread };
};
