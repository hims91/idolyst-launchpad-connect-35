import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ConversationWithDetails, Message as MessageType } from "@/types/messages";
import { useMessages } from "@/hooks/use-messages";
import { useAuth } from "@/providers/AuthProvider";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import UserAvatar from "@/components/shared/UserAvatar";
import { fadeIn } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown } from "lucide-react";

interface ConversationViewProps {
  conversation: ConversationWithDetails;
  messages: MessageType[];
  isLoading: boolean;
}

const ConversationView = ({
  conversation,
  messages,
  isLoading
}: ConversationViewProps) => {
  const { user } = useAuth();
  const { sendMessage, removeConversation } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const otherUser = conversation?.otherParticipant?.profile;
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);
  
  // Function to scroll to bottom
  const scrollToBottom = (smooth = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };
  
  // Handle scroll to detect if we're not at the bottom
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!atBottom);
  };
  
  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);
  
  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    await sendMessage(content, conversation.id);
  };
  
  if (!otherUser) return null;

  const avatarFallbackText = otherUser.username?.[0] || otherUser.full_name?.[0] || "?";

  return (
    <>
      {/* Conversation header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
        <div className="flex items-center flex-1">
          <UserAvatar
            src={otherUser.avatar_url || ""}
            fallbackText={avatarFallbackText}
            className="h-10 w-10"
          />
          
          <div className="ml-3 min-w-0">
            <h3 className="text-sm font-medium">
              {otherUser.username || otherUser.full_name || "User"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {otherUser.full_name}
            </p>
          </div>
        </div>
      </div>
      
      {/* Messages container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 scroll-smooth"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div className={`flex items-end max-w-[85%] ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full mr-2" />}
                  <div className={`px-4 py-2 rounded-t-xl ${i % 2 === 0 ? "rounded-br-xl bg-gray-100 dark:bg-gray-800" : "rounded-bl-xl bg-purple-100 dark:bg-purple-900"}`}>
                    <Skeleton className={`h-4 w-${20 + i * 10}`} />
                    <Skeleton className="h-4 w-12 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center p-8 text-gray-500"
          >
            <p>No messages yet. Send a message to start the conversation!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageItem
                    message={message}
                    isCurrentUser={message.sender_id === user?.id}
                    otherUserAvatar={otherUser.avatar_url || ""}
                    otherUserName={otherUser.username?.[0] || otherUser.full_name?.[0] || "?"}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-28 right-8 md:right-12 z-10 bg-purple-500 dark:bg-purple-700 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 dark:hover:bg-purple-800 transition-colors"
              onClick={() => scrollToBottom(true)}
            >
              <ArrowDown className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </>
  );
};

export default ConversationView;
