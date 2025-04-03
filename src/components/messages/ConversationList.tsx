
import { motion, AnimatePresence } from "framer-motion";
import { ConversationWithDetails } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Search } from "lucide-react";
import { useState } from "react";
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
  
  // Filter conversations based on search query
  const filteredConversations = searchQuery.trim() === ""
    ? conversations
    : conversations.filter(conv => {
        const otherUser = conv.otherParticipant?.profile;
        if (!otherUser) return false;
        
        const username = otherUser.username?.toLowerCase() || "";
        const fullName = otherUser.full_name?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        
        return username.includes(query) || fullName.includes(query);
      });

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
            className="pl-9 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {isLoading ? (
            // Loading skeletons
            <div className="space-y-2 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-2">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            // Empty state
            <div className="text-center p-8 text-gray-500">
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
