
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useMessages } from "@/hooks/use-messages";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, X, Image } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { attachment, handleFileSelection, removeAttachment } = useMessages();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle sending a message
  const handleSend = async () => {
    if ((!message.trim() && !attachment) || isSending) return;
    
    setIsSending(true);
    await onSendMessage(message);
    setMessage("");
    setIsSending(false);
  };
  
  // Handle pressing Enter to send (but allow Shift+Enter for new lines)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {/* Attachment preview */}
      {attachment && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 relative bg-gray-100 dark:bg-gray-800 rounded-md p-2"
        >
          <div className="flex items-center">
            {attachment.type === "image" ? (
              <div className="relative h-16 w-16 rounded overflow-hidden">
                <img 
                  src={attachment.previewUrl} 
                  alt="Attachment preview" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <Image className="h-6 w-6 text-white" />
                </div>
              </div>
            ) : (
              <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <Paperclip className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            
            <div className="ml-2 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {attachment.file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(attachment.file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500"
              onClick={removeAttachment}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {attachment.uploading && (
            <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${attachment.progress}%` }}
              />
            </div>
          )}
        </motion.div>
      )}

      <div className="flex items-end space-x-2">
        {/* Attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </Button>
        
        {/* Message input */}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 min-h-[40px] max-h-24 py-2 px-3 resize-none"
          rows={1}
          style={{ height: 'auto' }}
        />
        
        {/* Send button */}
        <Button
          type="button"
          size="icon"
          className={`rounded-full h-10 w-10 flex-shrink-0 ${
            !message.trim() && !attachment
              ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          onClick={handleSend}
          disabled={(!message.trim() && !attachment) || isSending}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
