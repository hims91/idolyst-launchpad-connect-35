
import { motion, AnimatePresence } from "framer-motion";
import { ConversationWithDetails } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Search, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import ConversationItem from "./ConversationItem";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  isLoading: boolean;
  selectedId?: string;
  onSelectConversation: (conversation: ConversationWithDetails) => void;
  onNewMessage: () => void;
}

const ConversationList = ({
  conversations,
  isLoading,
  selectedId,
  onSelectConversation,
  onNewMessage
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  
  // Filter conversations based on search query
  const filteredConversations = searchQuery.trim() === ""
    ? conversations
    : conversations.filter(conv => {
        const otherUser = conv.otherParticipant?.profile;
        if (!otherUser) return false;
        
        const username = otherUser.username?.toLowerCase() || "";
        const fullName = otherUser.full_name?.toLowerCase() || "";
        const lastMessage = conv.lastMessage?.content?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        
        return username.includes(query) || 
               fullName.includes(query) || 
               lastMessage.includes(query);
      });

  // Reset search when component unmounts
  useEffect(() => {
    return () => setSearchQuery("");
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold mb-4">Messages</h1>
        
        <div className="relative">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setExpanded(true)}
            onBlur={() => setTimeout(() => setExpanded(false), 200)}
            className={`pl-9 w-full transition-all duration-300 ${expanded ? 'ring-2 ring-purple-500' : ''}`}
          />
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${expanded ? 'text-purple-500' : 'text-gray-400'}`} />
          
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchQuery("")}
            >
              <span className="sr-only">Clear search</span>
              <span aria-hidden="true">&times;</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* New message button */}
      <div className="p-4">
        <Button 
          onClick={onNewMessage} 
          className="w-full gradient-bg hover-scale"
        >
          <Edit className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <AnimatePresence>
          {isLoading ? (
            // Loading skeletons
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-3">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-3 w-10 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            // Empty state
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-8 w-8 mx-auto opacity-50 mb-2" />
              {searchQuery.trim() !== "" ? (
                <p>No conversations found matching "{searchQuery}"</p>
              ) : (
                <p>No conversations yet. Start a new message!</p>
              )}
            </div>
          ) : (
            // Conversations list
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="py-2"
            >
              {filteredConversations.map(conversation => (
                <motion.div
                  key={conversation.id}
                  variants={staggerItem}
                  layoutId={`conversation-${conversation.id}`}
                  onClick={() => onSelectConversation(conversation)}
                  whileHover={{ scale: 0.995 }}
                  transition={{ duration: 0.2 }}
                >
                  <ConversationItem
                    conversation={conversation}
                    isSelected={selectedId === conversation.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConversationList;
