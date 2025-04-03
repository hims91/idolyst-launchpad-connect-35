

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import UserAvatar from '../shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { PitchIdea } from '@/api/pitch';

interface LeaderboardCardProps {
  pitch: PitchIdea;
  rank: number;
}

const LeaderboardCard = ({ pitch, rank }: LeaderboardCardProps) => {
  // Get the medal for top 3
  const getMedal = () => {
    if (rank === 1) {
      return <Badge className="bg-yellow-200 text-yellow-800 border-yellow-400 ml-1">Gold</Badge>;
    } else if (rank === 2) {
      return <Badge className="bg-gray-200 text-gray-800 border-gray-400 ml-1">Silver</Badge>;
    } else if (rank === 3) {
      return <Badge className="bg-amber-200 text-amber-800 border-amber-400 ml-1">Bronze</Badge>;
    }
    return null;
  };

  return (
    <Link to={`/pitch-hub/${pitch.id}`}>
      <Card className={`hover:shadow-md transition-shadow duration-200 ${rank <= 3 ? 'border-2 border-amber-200' : ''}`}>
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              rank === 1 ? 'bg-yellow-100 text-yellow-800' :
              rank === 2 ? 'bg-gray-100 text-gray-800' :
              rank === 3 ? 'bg-amber-100 text-amber-800' :
              'bg-gray-50 text-gray-600'
            } font-bold text-sm`}>
              {rank}
            </div>
            
            <div className="flex items-center">
              <UserAvatar
                user={{
                  id: pitch.user_id,
                  name: pitch.author?.full_name || 'Unknown',
                  image: pitch.author?.avatar_url
                }}
                showStatus={false}
                size="sm"
              />
              
              <div className="ml-2">
                <div className="font-medium line-clamp-1 text-sm">
                  {pitch.title}
                </div>
                <div className="text-xs text-idolyst-gray">
                  {pitch.author?.username ? `@${pitch.author.username}` : 'Unknown'}
                  {getMedal()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
              <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs font-medium">{pitch.vote_count || 0}</span>
            </div>
            
            {pitch.is_premium && (
              <div className="ml-2">
                <Award className="h-4 w-4 text-amber-500" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LeaderboardCard;
