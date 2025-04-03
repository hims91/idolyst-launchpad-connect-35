
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessages } from "@/hooks/use-messages";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, X, Image, File, Smile } from "lucide-react";
import { fadeIn } from "@/lib/animations";
import { scaleIn } from "@/lib/animations";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState<number>(40);
  const { attachment, handleFileSelection, removeAttachment } = useMessages();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle sending a message
  const handleSend = async () => {
    if ((!message.trim() && !attachment) || isSending) return;
    
    setIsSending(true);
    await onSendMessage(message);
    setMessage("");
    adjustTextareaHeight("");
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

  // Dynamically adjust textarea height based on content
  const adjustTextareaHeight = useCallback((value: string) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);
    }
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    adjustTextareaHeight(value);
  };

  return (
    <div>
      {/* Attachment preview */}
      <AnimatePresence>
        {attachment && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
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
                  <File className="h-6 w-6 text-gray-500 dark:text-gray-400" />
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
                <motion.div 
                  className="h-full bg-purple-500 transition-all duration-300"
                  initial={{ width: "0%" }}
                  animate={{ width: `${attachment.progress}%` }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end space-x-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2">
        {/* Attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 flex-shrink-0 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </Button>
        
        {/* Emoji button - placeholder for future emoji picker */}
        <Button
          type="button" 
          variant="ghost" 
          size="icon"
          className="rounded-full h-10 w-10 flex-shrink-0 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors md:flex hidden"
        >
          <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Button>
        
        {/* Message input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 min-h-[40px] max-h-24 py-2 px-3 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          style={{ height: `${textareaHeight}px` }}
        />
        
        {/* Send button */}
        <AnimatePresence mode="wait">
          {message.trim() || attachment ? (
            <motion.div 
              key="send-active"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={scaleIn}
            >
              <Button
                type="button"
                size="icon"
                className="rounded-full h-10 w-10 flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSend}
                disabled={isSending}
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="send-inactive"
              initial="hidden"
              animate="visible" 
              exit="hidden"
              variants={scaleIn}
            >
              <Button
                type="button"
                size="icon"
                className="rounded-full h-10 w-10 flex-shrink-0 bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                disabled
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessageInput;
