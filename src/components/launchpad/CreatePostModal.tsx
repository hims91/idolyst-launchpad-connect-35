
import React, { useState, useRef, ChangeEvent } from "react";
import { X, Image, Link, PlusCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "../shared/UserAvatar";
import { createPost, uploadPostMedia, getCategories } from "@/api/launchpad";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface CreatePostModalProps {
  trigger: React.ReactNode;
  onPostCreated?: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ trigger, onPostCreated }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [urlPreview, setUrlPreview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = getCategories().filter(cat => cat !== "All");
  
  // Character limit
  const MAX_CHARS = 500;
  const charsRemaining = MAX_CHARS - content.length;
  const isOverLimit = charsRemaining < 0;
  
  // Handle media upload
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Only allow images
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setMediaFile(file);
      
      // Create temporary object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setMediaUrl(objectUrl);
      
      // Upload to server (can be done on submit to save bandwidth)
      const uploadedUrl = await uploadPostMedia(file);
      if (uploadedUrl) {
        setMediaUrl(uploadedUrl);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove uploaded media
  const handleRemoveMedia = () => {
    setMediaUrl(null);
    setMediaFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle tag input
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag) {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Handle URL preview (simplified - would use an API or backend service)
  const handleUrlChange = (url: string) => {
    setUrl(url);
    
    // Very simplified URL preview (in a real app, use a service to fetch metadata)
    if (url.match(/^https?:\/\//)) {
      setUrlPreview({
        title: "Link Preview",
        description: "This is a preview of the shared link",
        image: null, // Would fetch real image in production
      });
    } else {
      setUrlPreview(null);
    }
  };
  
  const handleSubmit = async () => {
    if (isOverLimit || !category || !content.trim()) {
      toast({
        title: "Cannot post",
        description: isOverLimit 
          ? "Your post exceeds the character limit" 
          : "Please add content and select a category",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // If we have a mediaFile but no mediaUrl, upload it now
      let finalMediaUrl = mediaUrl;
      if (mediaFile && !mediaUrl) {
        finalMediaUrl = await uploadPostMedia(mediaFile);
      }
      
      const newPost = await createPost(
        content,
        category,
        tags,
        finalMediaUrl || undefined,
        mediaFile?.type || undefined,
        url || undefined,
        urlPreview || undefined
      );
      
      if (newPost) {
        setIsOpen(false);
        resetForm();
        onPostCreated?.();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setContent("");
    setCategory("");
    setTags([]);
    setCurrentTag("");
    setMediaUrl(null);
    setMediaFile(null);
    setUrl("");
    setUrlPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Function to automatically resize textarea
  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl mx-auto">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, questions, or updates with the community.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-3 py-2">
          {user && (
            <UserAvatar
              user={{
                id: user.id,
                name: user.profile?.full_name || user.email || "User",
                image: user.profile?.avatar_url
              }}
              showStatus
            />
          )}
          <div className="flex-1">
            <p className="font-medium text-idolyst-gray-dark">
              {user?.profile?.full_name || "Your Name"}
            </p>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px] h-8 text-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[120px] resize-none overflow-hidden"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                autoResizeTextarea(e);
              }}
              maxLength={MAX_CHARS}
            />
            <div className={`absolute bottom-2 right-2 text-xs ${isOverLimit ? 'text-red-500' : 'text-idolyst-gray'}`}>
              {charsRemaining}/{MAX_CHARS}
            </div>
          </div>
          
          {/* Media preview */}
          {mediaUrl && (
            <div className="relative rounded-md overflow-hidden border border-gray-200">
              <img 
                src={mediaUrl} 
                alt="Upload preview" 
                className="max-h-64 w-auto mx-auto"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-80"
                onClick={handleRemoveMedia}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {/* URL preview */}
          {urlPreview && (
            <div className="border rounded-md p-3 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm">Link Preview</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setUrl("");
                    setUrlPreview(null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-idolyst-gray truncate">{url}</p>
            </div>
          )}
          
          {/* Tags section */}
          {(tags.length > 0 || currentTag) && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    #{tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                
                {currentTag && (
                  <Badge variant="outline" className="px-2 py-1">
                    #{currentTag}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Add a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value.replace(/\s+/g, ''))} // No spaces in tags
                  onKeyDown={handleKeyPress}
                  disabled={tags.length >= 5}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddTag}
                  disabled={!currentTag.trim() || tags.length >= 5}
                  size="sm"
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-idolyst-gray">
                {5 - tags.length} tags remaining
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || !!mediaUrl}
            className="flex items-center"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Image className="h-4 w-4 mr-2" />
            )}
            Add Image
          </Button>
          
          {!urlPreview && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => handleUrlChange("https://")}
                className="flex items-center"
              >
                <Link className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          )}
          
          {!tags.length && !currentTag && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setCurrentTag("tag")}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Tags
            </Button>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isOverLimit || !category || !content.trim()}
            className={isSubmitting ? '' : 'gradient-bg hover-scale'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
