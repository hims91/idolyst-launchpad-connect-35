
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Users, Rocket, ExternalLink, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import useTrendingTopics from '@/hooks/useTrendingTopics';
import useTopContributors from '@/hooks/useTopContributors';
import useFeaturedPitches from '@/hooks/useFeaturedPitches';

const WebRightSidebar = () => {
  return (
    <motion.div
      className="hidden lg:block w-72 h-screen sticky top-0 px-4 py-6 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ScrollArea className="h-[calc(100vh-2rem)]">
        <div className="space-y-6 pr-2">
          <TrendingTopics />
          <TopMentors />
          <FeaturedPitches />
        </div>
      </ScrollArea>
    </motion.div>
  );
};

const TrendingTopics = () => {
  const { topics, isLoading } = useTrendingTopics(8);
  const navigate = useNavigate();
  
  const handleTagClick = (tag: string) => {
    navigate(`/?tab=trending&category=${encodeURIComponent(tag)}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="bg-card border border-border shadow-sm hover:shadow transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Flame className="h-4 w-4 text-red-500" />
            <span>Trending Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : topics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <Badge 
                  key={topic.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary hover-scale"
                  onClick={() => handleTagClick(topic.topic)}
                >
                  #{topic.topic}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {topic.post_count}
                  </span>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-muted-foreground text-sm">
              No trending topics yet
            </div>
          )}
          
          <div className="mt-4 text-right">
            <Button 
              variant="link" 
              size="sm" 
              className="text-xs text-muted-foreground flex items-center gap-1"
              asChild
            >
              <Link to="/explore/topics">
                View all
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TopMentors = () => {
  const { contributors, isLoading } = useTopContributors(5);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="bg-card border border-border shadow-sm hover:shadow transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>Top Mentors & Contributors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : contributors.length > 0 ? (
            <div className="space-y-3">
              {contributors.map(contributor => (
                <Link 
                  key={contributor.id} 
                  to={`/profile/${contributor.id}`}
                  className="flex items-center gap-3 p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={contributor.avatar_url || undefined} alt={contributor.username || 'User'} />
                    <AvatarFallback>
                      {(contributor.username?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {contributor.full_name || contributor.username}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{contributor.contribution_points} XP</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-muted-foreground text-sm">
              No top contributors yet
            </div>
          )}
          
          <div className="mt-4 text-right">
            <Button 
              variant="link" 
              size="sm" 
              className="text-xs text-muted-foreground flex items-center gap-1"
              asChild
            >
              <Link to="/mentor-space/directory">
                View all mentors
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeaturedPitches = () => {
  const { pitches, isLoading } = useFeaturedPitches(3);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="bg-card border border-border shadow-sm hover:shadow transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Rocket className="h-4 w-4 text-purple-500" />
            <span>Featured Pitch Ideas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </div>
              ))}
            </div>
          ) : pitches.length > 0 ? (
            <div className="space-y-4">
              {pitches.map(pitch => (
                <Link 
                  key={pitch.id} 
                  to={`/pitch-hub/${pitch.id}`}
                  className="block p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <h4 className="font-medium text-sm line-clamp-1">
                    {pitch.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {pitch.problem_statement}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{pitch.vote_count || 0} votes</span>
                    </div>
                    <span>•</span>
                    <span>{pitch.views_count || 0} views</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-muted-foreground text-sm">
              No featured pitches yet
            </div>
          )}
          
          <div className="mt-4 text-right">
            <Button 
              variant="link" 
              size="sm" 
              className="text-xs text-muted-foreground flex items-center gap-1"
              asChild
            >
              <Link to="/pitch-hub">
                Explore more ideas
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WebRightSidebar;
