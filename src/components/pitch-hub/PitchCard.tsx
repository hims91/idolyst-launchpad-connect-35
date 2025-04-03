
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowDown, 
  ArrowUp, 
  MessageSquare, 
  Share2, 
  Award, 
  TrendingUp 
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserAvatar from '../shared/UserAvatar';
import { PitchIdea, votePitch } from '@/api/pitch';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PitchCardProps {
  pitch: PitchIdea;
  onVote?: (pitchId: string, voteType: 'upvote' | 'downvote', newCount: number) => void;
}

const PitchCard = ({ pitch, onVote }: PitchCardProps) => {
  const { isAuthenticated } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [voteCount, setVoteCount] = useState(pitch.vote_count || 0);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(pitch.user_vote || null);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to vote on pitch ideas.",
        variant: "destructive",
      });
      return;
    }

    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      // Calculate new vote count before API call for immediate feedback
      let newCount = voteCount;
      
      if (!userVote) {
        // New vote
        newCount += voteType === 'upvote' ? 1 : -1;
      } else if (userVote === voteType) {
        // Removing existing vote
        newCount += voteType === 'upvote' ? -1 : 1;
      } else {
        // Changing vote (e.g., from upvote to downvote)
        newCount += voteType === 'upvote' ? 2 : -2;
      }
      
      // Optimistic UI update
      setVoteCount(newCount);
      setUserVote(userVote === voteType ? null : voteType);
      
      // Notify parent component
      if (onVote) {
        onVote(pitch.id, voteType, newCount);
      }
      
      // Make API call
      await votePitch(pitch.id, voteType);
    } catch (error) {
      console.error('Vote error:', error);
      // Revert on error
      setVoteCount(pitch.vote_count || 0);
      setUserVote(pitch.user_vote || null);
      
      toast({
        title: "Voting failed",
        description: "Failed to register your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  // Format the creation date
  const createdDate = new Date(pitch.created_at);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <Card className="w-full overflow-hidden animate-fade-in hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2 space-y-0 flex flex-row items-start justify-between">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${pitch.user_id}`}>
            <UserAvatar 
              user={{
                id: pitch.user_id,
                name: pitch.author?.full_name || 'Unknown',
                image: pitch.author?.avatar_url
              }} 
              showStatus={false}
            />
          </Link>
          
          <div>
            <div className="flex flex-wrap items-center gap-1">
              <Link 
                to={`/profile/${pitch.user_id}`} 
                className="font-semibold text-idolyst-gray-dark hover:text-idolyst-purple transition-colors"
              >
                {pitch.author?.full_name || 'Unknown'}
              </Link>
              
              {pitch.author?.username && (
                <span className="text-idolyst-gray">
                  @{pitch.author.username}
                </span>
              )}
              
              <span className="text-idolyst-gray text-sm">·</span>
              <span className="text-idolyst-gray text-sm">{timeAgo}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-1">
              {pitch.tags && pitch.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {pitch.tags && pitch.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{pitch.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {pitch.is_premium && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
              <Award className="mr-1 h-3 w-3" />
              Premium
            </Badge>
          )}
          
          {pitch.mentor_feedback_count && pitch.mentor_feedback_count > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              <Award className="mr-1 h-3 w-3" />
              Mentor
            </Badge>
          )}
          
          {voteCount > 50 && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <TrendingUp className="mr-1 h-3 w-3" />
              Hot
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <Link to={`/pitch-hub/${pitch.id}`} className="hover:text-idolyst-purple transition-colors">
          <h3 className="font-bold text-lg mb-2">{pitch.title}</h3>
          
          <p className="text-idolyst-gray-dark text-sm mb-2 line-clamp-2">
            {pitch.problem_statement}
          </p>
          
          {pitch.media_urls && pitch.media_urls.length > 0 && (
            <div className="mt-2 rounded-lg overflow-hidden max-h-40">
              <img 
                src={pitch.media_urls[0]} 
                alt="Pitch illustration" 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </Link>
      </CardContent>
      
      <CardFooter className="p-2 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleVote('upvote')}
            disabled={isVoting}
            className={`px-2 ${userVote === 'upvote' ? 'text-green-600' : ''}`}
          >
            <ArrowUp className="h-4 w-4 mr-1" />
          </Button>
          
          <span className="font-medium text-sm min-w-[24px] text-center">
            {voteCount}
          </span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleVote('downvote')}
            disabled={isVoting}
            className={`px-2 ${userVote === 'downvote' ? 'text-red-600' : ''}`}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        
        <Link to={`/pitch-hub/${pitch.id}#feedback`}>
          <Button variant="ghost" size="sm" className="px-2">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {pitch.feedback_count || 0}
            </span>
          </Button>
        </Link>
        
        <Button variant="ghost" size="sm" className="px-2" onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/pitch-hub/${pitch.id}`);
          toast({ title: "Link copied", description: "Pitch idea link copied to clipboard" });
        }}>
          <Share2 className="h-4 w-4" />
        </Button>
        
        <Link to={`/pitch-hub/${pitch.id}`}>
          <Button variant="secondary" size="sm" className="text-xs px-3">
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PitchCard;
