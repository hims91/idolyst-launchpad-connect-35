
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Share2, Repeat2, Bookmark, BookmarkCheck, MoreHorizontal, Lightbulb, Rocket, Sparkles, Link as LinkIcon, TrendingUp } from 'lucide-react';

import { Post, reactToPost, repostPost, savePost } from '@/api/launchpad';
import { useAuth } from '@/hooks/useAuth';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/shared/UserAvatar';

import ReactionPopover from './ReactionPopover';
import ShareMenu from './ShareMenu';

interface PostCardProps {
  post: Post;
  onUpdate?: (post: Post) => void;
  isDetail?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onUpdate,
  isDetail = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthor = user?.id === post.user_id;
  
  // State for UI interactions
  const [isExpanded, setIsExpanded] = useState(isDetail);
  const [showReactionPopover, setShowReactionPopover] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Handle long press to show share menu
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setShowShareMenu(true);
    }, 500); // 500ms for long press
    
    setLongPressTimer(timer);
  };
  
  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
  // Navigate to post detail on click
  const handlePostClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a button or link
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLAnchorElement ||
      (e.target instanceof Element && e.target.closest('button')) ||
      (e.target instanceof Element && e.target.closest('a'))
    ) {
      return;
    }
    
    if (!isDetail) {
      navigate(`/launchpad/post/${post.id}`);
    }
  };
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Handle reactions
  const handleReaction = async (reactionType: 'insightful' | 'fundable' | 'innovative' | 'collab_worthy' | 'like') => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    // Optimistic update
    const newPost = { 
      ...post,
      user_reaction: post.user_reaction === reactionType ? null : reactionType,
      reactions_count: post.reactions_count || 0 + (post.user_reaction === reactionType ? -1 : 1)
    };
    
    if (onUpdate) {
      onUpdate(newPost);
    }
    
    // API call
    await reactToPost(post.id, reactionType);
  };
  
  // Handle repost
  const handleRepost = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    // Optimistic update
    const newPost = { 
      ...post,
      user_reposted: !post.user_reposted,
      reposts_count: (post.reposts_count || 0) + (post.user_reposted ? -1 : 1)
    };
    
    if (onUpdate) {
      onUpdate(newPost);
    }
    
    // API call
    await repostPost(post.id);
  };
  
  // Handle save
  const handleSave = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    // Optimistic update
    const newPost = { 
      ...post,
      user_saved: !post.user_saved,
      saves_count: (post.saves_count || 0) + (post.user_saved ? -1 : 1)
    };
    
    if (onUpdate) {
      onUpdate(newPost);
    }
    
    // API call
    await savePost(post.id);
  };
  
  // Reaction icons mapping
  const reactionIcons = {
    insightful: <Lightbulb className="h-4 w-4 mr-1" />,
    fundable: <Rocket className="h-4 w-4 mr-1" />,
    innovative: <Sparkles className="h-4 w-4 mr-1" />,
    collab_worthy: <LinkIcon className="h-4 w-4 mr-1" />,
    like: <div className="i-lucide-heart h-4 w-4 mr-1" />
  };
  
  // Get display reaction
  const displayReaction = post.user_reaction 
    ? { type: post.user_reaction, icon: reactionIcons[post.user_reaction] }
    : { type: 'react', icon: null };
  
  return (
    <motion.div 
      layout
      className="w-full"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <Card 
        className={`overflow-hidden border hover:shadow-md transition-shadow duration-200 ${
          isDetail ? 'shadow-md' : 'cursor-pointer'
        }`}
        onClick={handlePostClick}
      >
        {/* Post Header */}
        <div className="p-4 pb-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link 
              to={`/profile/${post.user_id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <UserAvatar 
                user={{
                  id: post.user_id,
                  name: post.author?.full_name || "User",
                  image: post.author?.avatar_url
                }}
                showStatus
                className="h-10 w-10 border-2 border-white shadow-sm"
              />
            </Link>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Link 
                  to={`/profile/${post.user_id}`}
                  className="font-semibold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.author?.full_name || "User"}
                </Link>
                
                {/* Follow button - only show if not the author */}
                {user && user.id !== post.user_id && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 text-xs py-0 px-2 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Follow functionality would be implemented here
                    }}
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Badge variant="outline" className="mr-2 text-xs">
                  {post.category}
                </Badge>
                <span>{formatRelativeTime(post.created_at)}</span>
              </div>
            </div>
          </div>
          
          {/* More actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthor && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  // Edit functionality would be implemented here
                }}>
                  Edit Post
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                Report Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Post Content */}
        <div className="px-4 pb-3">
          <div className={`prose prose-sm dark:prose-invert max-w-none ${
            !isDetail && !isExpanded && post.content.length > 250 
              ? 'line-clamp-4' 
              : ''
          }`}>
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
          
          {!isDetail && post.content.length > 250 && (
            <button 
              className="text-idolyst-purple hover:underline text-sm font-medium mt-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        
        {/* Media Preview */}
        {post.media_url && (
          <div 
            className={`relative ${
              isDetail ? 'max-h-[500px]' : 'max-h-[300px]'
            } overflow-hidden bg-gray-100 dark:bg-gray-800`}
          >
            <img 
              src={post.media_url} 
              alt="Post media" 
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        
        {/* URL Preview */}
        {post.url && post.url_preview && (
          <div className="border-t p-4">
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {post.url_preview.image && (
                <div className="h-32 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={post.url_preview.image} 
                    alt={post.url_preview.title || "Link preview"} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-3">
                <p className="font-medium text-sm line-clamp-1">
                  {post.url_preview.title || post.url}
                </p>
                {post.url_preview.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {post.url_preview.description}
                  </p>
                )}
              </div>
            </a>
          </div>
        )}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Post Stats & Engagement Buttons */}
        <div className="px-4 pt-2 pb-3 border-t">
          {/* Stats */}
          <div className="flex text-xs text-gray-500 mb-2">
            {post.reactions_count && post.reactions_count > 0 && (
              <span className="mr-3">{post.reactions_count} reactions</span>
            )}
            <span className="mr-3">
              {post.comments_count || 0} {post.comments_count === 1 ? 'comment' : 'comments'}
            </span>
            {post.views_count && post.views_count > 0 && (
              <span>{post.views_count} views</span>
            )}
            {post.is_trending && (
              <div className="ml-auto flex items-center text-idolyst-pink font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Trending</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-2">
            {/* Reaction Button */}
            <div className="relative">
              <Button
                variant={post.user_reaction ? "default" : "ghost"}
                size="sm"
                className={`text-xs flex items-center ${
                  post.user_reaction
                    ? 'gradient-bg hover-scale'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactionPopover(!showReactionPopover);
                }}
              >
                {displayReaction.icon}
                <span>{displayReaction.type === 'react' ? 'React' : displayReaction.type}</span>
              </Button>
              
              <AnimatePresence>
                {showReactionPopover && (
                  <ReactionPopover 
                    isOpen={showReactionPopover}
                    onClose={() => setShowReactionPopover(false)}
                    onReaction={handleReaction}
                    currentReaction={post.user_reaction}
                  />
                )}
              </AnimatePresence>
            </div>
            
            {/* Comment Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/launchpad/post/${post.id}`);
              }}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Comment</span>
            </Button>
            
            {/* Repost Button */}
            <Button
              variant={post.user_reposted ? "default" : "ghost"}
              size="sm"
              className={`text-xs ${
                post.user_reposted 
                  ? 'gradient-bg hover-scale' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleRepost();
              }}
            >
              <Repeat2 className="h-4 w-4 mr-1" />
              <span>Repost</span>
            </Button>
            
            {/* Share Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareMenu(!showShareMenu);
                }}
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span>Share</span>
              </Button>
              
              <AnimatePresence>
                {showShareMenu && (
                  <ShareMenu 
                    isOpen={showShareMenu}
                    onClose={() => setShowShareMenu(false)}
                    postId={post.id}
                  />
                )}
              </AnimatePresence>
            </div>
            
            {/* Save Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
            >
              {post.user_saved ? (
                <BookmarkCheck className="h-4 w-4 mr-1 text-idolyst-purple" />
              ) : (
                <Bookmark className="h-4 w-4 mr-1" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PostCard;
