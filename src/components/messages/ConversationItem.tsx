
import { formatDistanceToNow } from "date-fns";
import { ConversationWithDetails } from "@/types/messages";
import UserAvatar from "@/components/shared/UserAvatar";

interface ConversationItemProps {
  conversation: ConversationWithDetails;
  isSelected: boolean;
}

const ConversationItem = ({ conversation, isSelected }: ConversationItemProps) => {
  const { otherParticipant, lastMessage, is_read } = conversation;
  const otherUser = otherParticipant?.profile;
  
  if (!otherUser) return null;
  
  // Format the timestamp
  const timestamp = lastMessage?.sent_at
    ? formatDistanceToNow(new Date(lastMessage.sent_at), { addSuffix: true })
    : formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true });
  
  // Truncate long messages
  const messagePreview = lastMessage?.content
    ? lastMessage.content.length > 35
      ? lastMessage.content.slice(0, 35) + "..."
      : lastMessage.content
    : "No messages yet";
  
  // Check if media was attached
  const hasMedia = lastMessage?.media_url && lastMessage?.media_type;
  const mediaPreview = hasMedia 
    ? lastMessage?.media_type === 'image' 
      ? "📷 Image" 
      : "📎 Attachment"
    : "";

  // Create a fallback text for the avatar
  const avatarFallbackText = otherUser.username?.[0] || otherUser.full_name?.[0] || "?";

  return (
    <div
      className={`px-4 py-3 flex items-start hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${
        isSelected ? "bg-gray-100 dark:bg-gray-800" : ""
      } ${!is_read && !isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
    >
      <UserAvatar
        src={otherUser.avatar_url || ""}
        fallbackText={avatarFallbackText}
        className={`h-10 w-10 ${!is_read && !isSelected ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
      />
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className={`text-sm font-medium truncate ${!is_read ? "font-bold text-black dark:text-white" : "text-gray-900 dark:text-gray-200"}`}>
            {otherUser.username || otherUser.full_name || "User"}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {timestamp}
          </span>
        </div>
        
        <p className={`text-sm truncate ${!is_read ? "font-medium text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
          {mediaPreview || messagePreview}
        </p>
      </div>
      
      {!is_read && !isSelected && (
        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse ml-2 mt-1" />
      )}
    </div>
  );
};

export default ConversationItem;
