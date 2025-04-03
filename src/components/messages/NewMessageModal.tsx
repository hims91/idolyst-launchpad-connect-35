
import { useEffect, useState } from "react";
import { useMessages } from "@/hooks/use-messages";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, SendHorizonal, UserPlus, X } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";

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
                <div className="flex items-center py-2">
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
                </div>
              ) : (
                <>
                  <Input
                    placeholder="Search for a user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </>
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
                  <div className="p-4 text-center text-gray-500">
                    <UserPlus className="h-8 w-8 mx-auto opacity-50 mb-2" />
                    <p>No users found matching "{searchTerm}"</p>
                    <p className="text-sm mt-1">
                      You can only message users who follow you or who you follow.
                    </p>
                  </div>
                ) : (
                  <div>
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
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
                            <p className="text-xs text-gray-500">
                              {user.full_name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Message input */}
          <div>
            <Textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
          
          {/* Send button */}
          <div className="flex justify-end">
            <Button
              onClick={handleStartConversation}
              disabled={!selectedUser || !message.trim() || isCreating}
              className="gradient-bg hover-scale"
            >
              <SendHorizonal className="mr-2 h-5 w-5" />
              Start Conversation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageModal;
