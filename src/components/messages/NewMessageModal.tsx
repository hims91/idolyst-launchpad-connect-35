
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessages } from "@/hooks/use-messages";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, SendHorizonal, UserPlus, X, Loader2 } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewMessageModal = ({ isOpen, onClose }: NewMessageModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { searchUsers, searchResults, isSearching, startConversation } = useMessages();
  
  // Clear state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedUser(null);
      setMessage("");
      setIsCreating(false);
    }
  }, [isOpen]);
  
  // Handle search input changes
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const delaySearch = setTimeout(() => {
        searchUsers(searchTerm);
      }, 300);
      
      return () => clearTimeout(delaySearch);
    }
  }, [searchTerm, searchUsers]);
  
  // Handle sending a message
  const handleStartConversation = async () => {
    if (!selectedUser || !message.trim() || isCreating) return;
    
    setIsCreating(true);
    
    try {
      const result = await startConversation(selectedUser.id, message.trim());
      if (result) {
        onClose();
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          {/* Search input and results */}
          <div>
            <div className="relative">
              {selectedUser ? (
                <motion.div 
                  className="flex items-center py-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <UserAvatar
                    src={selectedUser.avatar_url || ""}
                    fallbackText={selectedUser.username?.[0] || selectedUser.full_name?.[0] || "?"}
                    className="h-8 w-8"
                  />
                  <span className="ml-2 text-sm font-medium">
                    {selectedUser.username || selectedUser.full_name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-gray-500 hover:text-red-500"
                    onClick={() => setSelectedUser(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative"
                >
                  <Input
                    placeholder="Search for a user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    autoComplete="off"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </motion.div>
              )}
            </div>
            
            {/* Search results */}
            {!selectedUser && searchTerm.trim().length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-800">
                {isSearching ? (
                  <div className="p-2 space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center p-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="ml-2 space-y-1">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-2 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchResults.length === 0 ? (
                  <motion.div 
                    className="p-4 text-center text-gray-500"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <UserPlus className="h-8 w-8 mx-auto opacity-50 mb-2" />
                    <p>No users found matching "{searchTerm}"</p>
                    <p className="text-sm mt-1">
                      You can only message users who follow you or who you follow.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {searchResults.map((user) => (
                      <motion.div
                        key={user.id}
                        variants={staggerItem}
                        onClick={() => setSelectedUser(user)}
                        className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <UserAvatar
                          src={user.avatar_url || ""}
                          fallbackText={user.username?.[0] || user.full_name?.[0] || "?"}
                          className="h-8 w-8"
                        />
                        <div className="ml-2">
                          <p className="text-sm font-medium">
                            {user.username || user.full_name}
                          </p>
                          {user.username && user.full_name && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.full_name}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </div>
          
          {/* Message input */}
          <AnimatePresence>
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Textarea
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Send button */}
          <div className="flex justify-end">
            <Button
              onClick={handleStartConversation}
              disabled={!selectedUser || !message.trim() || isCreating}
              className="gradient-bg hover-scale"
            >
              {isCreating ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <SendHorizonal className="mr-2 h-5 w-5" />
              )}
              Start Conversation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageModal;
