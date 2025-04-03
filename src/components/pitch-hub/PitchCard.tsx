
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye,
  Award,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserAvatar from '../shared/UserAvatar';
import { PitchIdea } from '@/api/pitch';

interface PitchCardProps {
  pitch: PitchIdea;
  onVote?: (id: string, type: 'upvote' | 'downvote') => void;
}

const PitchCard = ({ pitch, onVote }: PitchCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(pitch.created_at), { addSuffix: true });

  const handleVote = (type: 'upvote' | 'downvote', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onVote) {
      onVote(pitch.id, type);
    }
  };

  return (
    <Link to={`/pitch-hub/${pitch.id}`}>
      <Card className={`hover:shadow-md transition-shadow duration-200 ${pitch.is_premium ? 'border-2 border-amber-200' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Vote buttons with count */}
            <div className="flex flex-col items-center space-y-1 mt-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => handleVote('upvote', e)}
              >
                <ArrowUp className={`h-5 w-5 ${pitch.user_vote === 'upvote' ? 'text-green-600 fill-green-600' : ''}`} />
              </Button>
              
              <span className="text-sm font-medium">{pitch.vote_count || 0}</span>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={(e) => handleVote('downvote', e)}
              >
                <ArrowDown className={`h-5 w-5 ${pitch.user_vote === 'downvote' ? 'text-red-600 fill-red-600' : ''}`} />
              </Button>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg line-clamp-1">{pitch.title}</h3>
                {pitch.is_premium && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                    <Award className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              
              <p className="text-idolyst-gray-dark mb-3 line-clamp-2">
                {pitch.problem_statement}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {pitch.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {pitch.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{pitch.tags.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <UserAvatar
                    user={{
                      id: pitch.user_id,
                      name: pitch.author?.full_name || 'Unknown',
                      image: pitch.author?.avatar_url
                    }}
                    size="sm"
                    showStatus={false}
                  />
                  <div>
                    <p className="text-sm font-medium line-clamp-1">
                      {pitch.author?.full_name || 'Unknown'}
                    </p>
                    <p className="text-xs text-idolyst-gray">{timeAgo}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-idolyst-gray">
                  <div className="flex items-center text-xs">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    {pitch.views_count || 0}
                  </div>
                  <div className="flex items-center text-xs">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    {pitch.feedback_count || 0}
                  </div>
                  <div className="flex items-center text-xs">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {pitch.tags.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        {pitch.mentor_feedback_count > 0 && (
          <CardFooter className="bg-blue-50 py-2 px-4 border-t">
            <div className="flex items-center text-blue-700 text-sm">
              <Award className="h-4 w-4 mr-2" />
              {pitch.mentor_feedback_count} mentor {pitch.mentor_feedback_count === 1 ? 'feedback' : 'feedbacks'}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default PitchCard;
