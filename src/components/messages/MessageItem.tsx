
import { Message } from "@/types/messages";
import { format } from "date-fns";
import UserAvatar from "@/components/shared/UserAvatar";
import { cn } from "@/lib/utils";
import { FileText, Image as ImageIcon, File, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  otherUserAvatar: string;
  otherUserName: string;
  isLastInGroup?: boolean;
}

const MessageItem = ({
  message,
  isCurrentUser,
  otherUserAvatar,
  otherUserName,
  isLastInGroup = true
}: MessageItemProps) => {
  // Format the message timestamp
  const time = format(new Date(message.sent_at), "h:mm a");
  
  // Determine if the message contains media
  const hasMedia = message.media_url && message.media_type;

  // URL regex to detect links in messages
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Render message content with clickable links
  const renderContentWithLinks = (content: string) => {
    if (!content) return null;
    
    const parts = content.split(urlRegex);
    const matches = content.match(urlRegex) || [];
    
    return (
      <>
        {parts.map((part, i) => {
          const url = i % 2 === 1 ? matches[(i - 1) / 2] : null;
          if (url) {
            return (
              <a 
                key={i} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                {url}
                <ExternalLink className="h-3 w-3 inline ml-1" />
              </a>
            );
          }
          return part;
        })}
      </>
    );
  };

  // Render media content based on type
  const renderMediaContent = () => {
    if (!message.media_url || !message.media_type) return null;
    
    if (message.media_type === "image") {
      return (
        <div className="mt-2 rounded-lg overflow-hidden">
          <img 
            src={message.media_url} 
            alt="Image attachment" 
            className="max-w-full h-auto max-h-60 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(message.media_url, "_blank")}
            loading="lazy"
          />
        </div>
      );
    }
    
    if (message.media_type === "document") {
      return (
        <div 
          className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => window.open(message.media_url, "_blank")}
        >
          <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Document attachment</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Click to open</p>
          </div>
        </div>
      );
    }
    
    // Default file attachment
    return (
      <div 
        className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={() => window.open(message.media_url, "_blank")}
      >
        <File className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">File attachment</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Click to download</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className={cn(
        "flex items-end mb-1",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar for other user's messages */}
      {!isCurrentUser && isLastInGroup && (
        <UserAvatar
          src={otherUserAvatar}
          fallbackText={otherUserName}
          className="h-8 w-8 mr-2 flex-shrink-0"
        />
      )}

      {/* Avatar space reservation if not last in group */}
      {!isCurrentUser && !isLastInGroup && (
        <div className="w-8 mr-2 flex-shrink-0" />
      )}
      
      <div
        className={cn(
          "max-w-[85%] px-4 py-2 break-words",
          isCurrentUser 
            ? "rounded-t-lg rounded-bl-lg bg-purple-100 dark:bg-purple-900 dark:text-white" 
            : "rounded-t-lg rounded-br-lg bg-gray-100 dark:bg-gray-800",
          hasMedia ? "w-60 md:w-80" : ""
        )}
      >
        {/* Text content */}
        {message.content && (
          <p className="whitespace-pre-wrap">{renderContentWithLinks(message.content)}</p>
        )}
        
        {/* Media content */}
        {renderMediaContent()}
        
        {/* Timestamp and read status */}
        <div className={cn(
          "text-xs mt-1",
          isCurrentUser ? "text-right" : "text-left",
          isCurrentUser ? "text-purple-700 dark:text-purple-300" : "text-gray-500 dark:text-gray-400"
        )}>
          {time}
          {isCurrentUser && (
            <span className={`ml-1 ${message.is_read ? "text-blue-500" : "text-gray-400"}`}>
              {message.is_read ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageItem;
