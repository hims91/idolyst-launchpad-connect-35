
import React, { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Share2,
  MoreHorizontal,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Eye,
  Lightbulb,
  DollarSign,
  Sparkles,
  Users,
  GripHorizontal,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import UserAvatar from "../shared/UserAvatar";
import ReactionPopover from "./ReactionPopover";
import ShareMenu from "./ShareMenu";
import { Post, reactToPost, savePost, repostPost, ReactionType } from "@/api/launchpad";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  post: Post;
  onUpdate?: (post: Post) => void;
  isDetail?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate, isDetail = false }) => {
  const { user } = useAuth();
  const [isReactionOpen, setIsReactionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  
  const isAuthor = user?.id === post.user_id;
  
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy · h:mm aaa");
    } catch (e) {
      return "Invalid date";
    }
  };
  
  const handleReaction = async (reactionType: ReactionType) => {
    if (!user) return; // Handle in the reaction component
    
    try {
      await reactToPost(post.id, reactionType);
      
      // Update local state to reflect the change
      if (onUpdate && post) {
        const isAdding = post.user_reaction !== reactionType;
        
        const updatedPost: Post = {
          ...post,
          user_reaction: isAdding ? reactionType : null,
          reactions_count: isAdding 
            ? (post.reactions_count || 0) + 1 
            : Math.max((post.reactions_count || 0) - 1, 0)
        };
        
        onUpdate(updatedPost);
      }
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    try {
      const isSaved = await savePost(post.id);
      
      // Update local state
      if (onUpdate && post) {
        const updatedPost: Post = {
          ...post,
          user_saved: isSaved,
          saves_count: isSaved 
            ? (post.saves_count || 0) + 1 
            : Math.max((post.saves_count || 0) - 1, 0)
        };
        
        onUpdate(updatedPost);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };
  
  const handleRepost = async () => {
    if (!user) return;
    
    try {
      const isReposted = await repostPost(post.id);
      
      // Update local state
      if (onUpdate && post) {
        const updatedPost: Post = {
          ...post,
          user_reposted: isReposted,
          reposts_count: isReposted 
            ? (post.reposts_count || 0) + 1 
            : Math.max((post.reposts_count || 0) - 1, 0)
        };
        
        onUpdate(updatedPost);
      }
    } catch (error) {
      console.error("Error reposting:", error);
    }
  };
  
  // Get reaction icon based on type
  const getReactionIcon = (reactionType: ReactionType | null) => {
    switch(reactionType) {
      case 'insightful':
        return <Lightbulb className="h-4 w-4" />;
      case 'fundable':
        return <DollarSign className="h-4 w-4" />;
      case 'innovative':
        return <Sparkles className="h-4 w-4" />;
      case 'collab_worthy':
        return <Users className="h-4 w-4" />;
      default:
        return <ThumbsUp className="h-4 w-4" />;
    }
  };
  
  // Get reaction color based on type
  const getReactionColor = (reactionType: ReactionType | null) => {
    switch(reactionType) {
      case 'insightful':
        return 'text-blue-600';
      case 'fundable':
        return 'text-green-600';
      case 'innovative':
        return 'text-purple-600';
      case 'collab_worthy':
        return 'text-amber-600';
      default:
        return 'text-idolyst-purple';
    }
  };
  
  // Helper to truncate content
  const truncateContent = (content: string, maxLength = 300) => {
    if (isDetail || content.length <= maxLength) {
      return content;
    }
    
    return `${content.substring(0, maxLength)}... `;
  };
  
  return (
    <Card className={cn(
      "w-full overflow-hidden animate-fade-in border border-gray-100 hover:border-gray-200 transition-all duration-300",
      isDetail ? "shadow-sm" : "card-hover hover:shadow",
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.user_id}`}>
            <UserAvatar 
              user={{
                id: post.user_id,
                name: post.author?.full_name || "Unknown",
                image: post.author?.avatar_url
              }} 
              showStatus={true} 
            />
          </Link>
          
          <div>
            <div className="flex items-center space-x-1 flex-wrap">
              <Link 
                to={`/profile/${post.user_id}`} 
                className="font-semibold text-idolyst-gray-dark hover:text-idolyst-purple transition-colors"
              >
                {post.author?.full_name || "Unknown"}
              </Link>
              
              <Button asChild variant="ghost" size="sm" className="h-auto p-0 px-1 text-idolyst-purple">
                <Link to={`/profile/${post.user_id}`}>
                  @{post.author?.username || "user"}
                </Link>
              </Button>
              
              <span className="text-idolyst-gray text-sm">·</span>
              <span className="text-idolyst-gray text-sm">{formatDateTime(post.created_at)}</span>
            </div>
            
            {post.author?.bio && (
              <p className="text-xs text-idolyst-gray line-clamp-1 mt-0.5">
                {post.author.bio}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {post.category && (
            <Badge variant="secondary" className="bg-idolyst-blue/10 text-idolyst-blue hover:bg-idolyst-blue/20">
              {post.category}
            </Badge>
          )}
          
          {post.is_trending && (
            <Badge variant="secondary" className="flex items-center space-x-1 bg-amber-100 text-amber-700 hover:bg-amber-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSave}>
                {post.user_saved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save Post
                  </>
                )}
              </DropdownMenuItem>
              
              {isAuthor && (
                <>
                  <DropdownMenuItem>
                    <Link to={`/launchpad/edit/${post.id}`} className="flex items-center w-full">
                      <GripHorizontal className="h-4 w-4 mr-2" />
                      Edit Post
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              
              {!isAuthor && (
                <DropdownMenuItem>
                  Report Post
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 space-y-3">
        <Link to={`/launchpad/post/${post.id}`}>
          <div className="prose prose-sm max-w-none prose-p:my-2 text-idolyst-gray-dark whitespace-pre-wrap">
            <p>{truncateContent(post.content)}</p>
            {!isDetail && post.content.length > 300 && (
              <Link 
                to={`/launchpad/post/${post.id}`}
                className="text-idolyst-purple hover:text-idolyst-purple-dark font-medium"
              >
                Read more
              </Link>
            )}
          </div>
        </Link>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-gray-50">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {post.media_url && (
          <div className="mt-3 rounded-lg overflow-hidden relative">
            <div 
              className={cn(
                "cursor-pointer transition-all duration-300",
                isImageExpanded ? "cursor-zoom-out" : "cursor-zoom-in hover:opacity-90"
              )}
              onClick={() => isDetail && setIsImageExpanded(!isImageExpanded)}
            >
              <img 
                src={post.media_url} 
                alt="Post media" 
                className={cn(
                  "w-full h-auto object-cover rounded-md",
                  isImageExpanded ? "max-h-none" : "max-h-96"
                )}
              />
              {!isDetail && (
                <Link 
                  to={`/launchpad/post/${post.id}`}
                  className="absolute inset-0 bg-transparent"
                />
              )}
            </div>
          </div>
        )}
        
        {post.url && post.url_preview && (
          <a 
            href={post.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-3 border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all"
          >
            {post.url_preview.image && (
              <div className="h-32 overflow-hidden">
                <img 
                  src={post.url_preview.image} 
                  alt={post.url_preview.title || "Link preview"} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-3 bg-gray-50">
              <p className="font-medium text-sm line-clamp-1">
                {post.url_preview.title || post.url}
              </p>
              {post.url_preview.description && (
                <p className="text-xs text-idolyst-gray line-clamp-2 mt-1">
                  {post.url_preview.description}
                </p>
              )}
              <p className="text-xs text-idolyst-gray mt-1 truncate">
                {post.url}
              </p>
            </div>
          </a>
        )}
        
        {/* Engagement stats */}
        <div className="flex items-center text-xs text-idolyst-gray pt-2">
          <div className="flex items-center mr-4">
            <Eye className="h-3.5 w-3.5 mr-1" />
            {post.views_count || 0} views
          </div>
          <div className="flex items-center mr-4">
            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
            {post.reactions_count || 0} reactions
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            {post.comments_count || 0} comments
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-2 pt-0 flex items-center justify-between border-t border-gray-100">
        {/* Reaction Button */}
        <div className="relative">
          <ReactionPopover 
            postId={post.id}
            currentReaction={post.user_reaction}
            onReaction={handleReaction}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center space-x-1",
                post.user_reaction && getReactionColor(post.user_reaction)
              )}
            >
              {getReactionIcon(post.user_reaction)}
              <span>{post.reactions_count || 0}</span>
            </Button>
          </ReactionPopover>
        </div>
        
        {/* Comment Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-1"
          asChild
        >
          <Link to={`/launchpad/post/${post.id}`}>
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{post.comments_count || 0}</span>
          </Link>
        </Button>
        
        {/* Repost Button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center space-x-1",
            post.user_reposted && "text-green-600"
          )}
          onClick={handleRepost}
        >
          <Repeat2 className="h-4 w-4 mr-1" />
          <span>{post.reposts_count || 0}</span>
        </Button>
        
        {/* Share Button */}
        <ShareMenu postId={post.id} postUrl={`/launchpad/post/${post.id}`}>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <Share2 className="h-4 w-4" />
          </Button>
        </ShareMenu>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
