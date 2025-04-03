

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Award } from 'lucide-react';
import UserAvatar from '../shared/UserAvatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { PitchFeedback } from '@/api/pitch';

interface FeedbackCardProps {
  feedback: PitchFeedback;
}

const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  const createdDate = new Date(feedback.created_at);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  return (
    <Card className={`w-full ${feedback.is_mentor_feedback ? 'border-l-4 border-l-blue-500' : ''}`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${feedback.user_id}`}>
            <UserAvatar
              user={{
                id: feedback.user_id,
                name: feedback.author?.full_name || 'Unknown',
                image: feedback.author?.avatar_url
              }}
              showStatus={false}
            />
          </Link>
          
          <div>
            <div className="flex items-center space-x-2">
              <Link 
                to={`/profile/${feedback.user_id}`}
                className="font-semibold hover:text-idolyst-purple transition-colors"
              >
                {feedback.author?.full_name || 'Unknown'}
              </Link>
              
              {feedback.author?.username && (
                <span className="text-idolyst-gray text-sm">
                  @{feedback.author.username}
                </span>
              )}
              
              {feedback.author?.is_mentor && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Award className="h-3 w-3 mr-1" />
                  Mentor
                </Badge>
              )}
            </div>
            <p className="text-xs text-idolyst-gray">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-idolyst-gray-dark whitespace-pre-wrap">{feedback.content}</p>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
