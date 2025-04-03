
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
import { ArrowDown, Info, MoreVertical, UserMinus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typingStatus, setTypingStatus] = useState(false);
  
  const otherUser = conversation?.otherParticipant?.profile;
  
  // Group messages by sender for better UI
  const groupedMessages = messages.reduce((groups: MessageType[][], message, index) => {
    // Start a new group if:
    // 1. This is the first message
    // 2. The sender is different from the previous message
    // 3. More than 5 minutes passed between messages
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const shouldStartNewGroup = !previousMessage || 
      previousMessage.sender_id !== message.sender_id ||
      new Date(message.sent_at).getTime() - new Date(previousMessage.sent_at).getTime() > 5 * 60 * 1000;

    if (shouldStartNewGroup) {
      groups.push([message]);
    } else {
      groups[groups.length - 1].push(message);
    }
    
    return groups;
  }, []);
  
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
  
  // Handle conversation deletion
  const handleDeleteConversation = async () => {
    await removeConversation(conversation.id);
    setDeleteDialogOpen(false);
  };
  
  // Simulate typing indicator for demo purposes (would be replaced with real-time events)
  useEffect(() => {
    const randomTimeout = Math.random() * 10000 + 5000; // Random between 5-15 seconds
    const typingTimer = setTimeout(() => {
      setTypingStatus(true);
      
      setTimeout(() => {
        setTypingStatus(false);
      }, 3000);
    }, randomTimeout);
    
    return () => clearTimeout(typingTimer);
  }, [messages]);
  
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
            showStatus
            status="online"
          />
          
          <div className="ml-3 min-w-0">
            <h3 className="text-sm font-medium">
              {otherUser.username || otherUser.full_name || "User"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {typingStatus ? (
                <span className="text-green-500 dark:text-green-400 flex items-center">
                  <span className="mr-1">Typing</span>
                  <span className="flex">
                    <motion.span 
                      animate={{ y: [0, -3, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                      className="mx-0.5 h-1 w-1 bg-green-500 dark:bg-green-400 rounded-full inline-block"
                    />
                    <motion.span 
                      animate={{ y: [0, -3, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                      className="mx-0.5 h-1 w-1 bg-green-500 dark:bg-green-400 rounded-full inline-block"
                    />
                    <motion.span 
                      animate={{ y: [0, -3, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                      className="mx-0.5 h-1 w-1 bg-green-500 dark:bg-green-400 rounded-full inline-block"
                    />
                  </span>
                </span>
              ) : (
                <span>Online</span>
              )}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Conversation</DropdownMenuLabel>
            <DropdownMenuItem 
              className="flex items-center"
              onClick={() => window.open(`/profile/${otherUser.id}`, '_blank')}
            >
              <Info className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center text-red-600 dark:text-red-400"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              {groupedMessages.map((group, groupIndex) => (
                <div key={`group-${groupIndex}`} className="space-y-1">
                  {group.map((message, messageIndex) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      isCurrentUser={message.sender_id === user?.id}
                      otherUserAvatar={otherUser.avatar_url || ""}
                      otherUserName={otherUser.username?.[0] || otherUser.full_name?.[0] || "?"}
                      isLastInGroup={messageIndex === group.length - 1}
                    />
                  ))}
                </div>
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

      {/* Delete conversation confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConversation}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConversationView;
