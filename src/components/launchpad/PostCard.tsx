
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  ThumbsUp, 
  Repeat, 
  Share2, 
  MoreHorizontal,
  Award,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserAvatar from "../shared/UserAvatar";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      username: string;
      image?: string;
      roles?: string[];
    };
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    repostsCount: number;
    category?: string;
    isTrending?: boolean;
    mediaUrl?: string;
  };
  className?: string;
}

const PostCard = ({ post, className }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const handleRepost = () => {
    setIsReposted(!isReposted);
  };
  
  const formatRelativeTime = (dateString: string) => {
    // Simple implementation - in a real app you'd use a library like date-fns
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <Card className={cn("w-full overflow-hidden animate-fade-in card-hover", className)}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.author.id}`}>
            <UserAvatar user={post.author} showStatus={true} status="online" />
          </Link>
          
          <div>
            <div className="flex items-center space-x-1">
              <Link 
                to={`/profile/${post.author.id}`} 
                className="font-semibold text-idolyst-gray-dark hover:text-idolyst-purple transition-colors"
              >
                {post.author.name}
              </Link>
              
              <Button asChild variant="ghost" size="sm" className="h-auto p-0 px-1 text-idolyst-purple">
                <Link to={`/profile/${post.author.id}`}>@{post.author.username}</Link>
              </Button>
              
              <span className="text-idolyst-gray text-sm">·</span>
              <span className="text-idolyst-gray text-sm">{formatRelativeTime(post.createdAt)}</span>
            </div>
            
            {post.author.roles && post.author.roles.length > 0 && (
              <div className="flex items-center space-x-1 mt-0.5">
                {post.author.roles.map(role => (
                  <span 
                    key={role} 
                    className="text-xs bg-idolyst-purple/10 text-idolyst-purple px-2 py-0.5 rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {post.category && (
            <span className="text-xs bg-idolyst-blue px-2 py-0.5 rounded-full">
              {post.category}
            </span>
          )}
          
          {post.isTrending && (
            <span className="flex items-center space-x-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>Trending</span>
            </span>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem>Save Post</DropdownMenuItem>
              <DropdownMenuItem>Report Post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-idolyst-gray-dark">{post.content}</p>
        
        {post.mediaUrl && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img src={post.mediaUrl} alt="Post media" className="w-full h-auto object-cover" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-2 pt-0 flex items-center justify-between border-t border-gray-100">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "flex items-center space-x-1",
            isLiked && "text-idolyst-purple"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{post.likesCount + (isLiked ? 1 : 0)}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
          <MessageSquare className="h-4 w-4" />
          <span>{post.commentsCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "flex items-center space-x-1",
            isReposted && "text-green-600"
          )}
          onClick={handleRepost}
        >
          <Repeat className="h-4 w-4" />
          <span>{post.repostsCount + (isReposted ? 1 : 0)}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
