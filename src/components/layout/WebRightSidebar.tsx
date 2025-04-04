
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Rocket
} from 'lucide-react';

interface WebRightSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const WebRightSidebar: React.FC<WebRightSidebarProps> = ({ collapsed, onToggle }) => {
  // Placeholder data for trending topics
  const trendingTopics = [
    { id: 1, name: 'AI Startups', count: 543 },
    { id: 2, name: 'Funding Strategies', count: 421 },
    { id: 3, name: 'Green Tech', count: 389 },
    { id: 4, name: 'Web3', count: 267 },
    { id: 5, name: 'Fintech', count: 245 }
  ];
  
  // Placeholder data for top mentors
  const topMentors = [
    { 
      id: 1, 
      name: 'Alexandra Chen', 
      avatar: '', 
      role: 'VC Partner', 
      path: '/mentor-space/1' 
    },
    { 
      id: 2, 
      name: 'Michael Rodriguez', 
      avatar: '', 
      role: 'Growth Strategist', 
      path: '/mentor-space/2' 
    },
    { 
      id: 3, 
      name: 'Sarah Johnson', 
      avatar: '', 
      role: 'Tech Founder', 
      path: '/mentor-space/3' 
    }
  ];
  
  // Placeholder data for featured pitches
  const featuredPitches = [
    { id: 1, title: 'Renewable Energy Storage Solution', votes: 432, path: '/pitch-hub/1' },
    { id: 2, title: 'AI-Powered Healthcare Assistant', votes: 385, path: '/pitch-hub/2' },
    { id: 3, title: 'Sustainable Fashion Marketplace', votes: 341, path: '/pitch-hub/3' }
  ];

  return (
    <aside className="h-full border-l flex flex-col bg-background">
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggle} 
          className={collapsed ? 'mx-auto' : ''}
        >
          {collapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
        {!collapsed && <h2 className="text-sm font-medium">Discover</h2>}
      </div>
      
      {collapsed ? (
        <div className="flex-1 flex flex-col items-center p-2 gap-4 overflow-y-auto">
          <Button variant="ghost" size="icon">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <Rocket className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      ) : (
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          {/* Trending Topics Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Trending Topics</h3>
            </div>
            <div className="space-y-2">
              {trendingTopics.map((topic) => (
                <Link 
                  key={topic.id} 
                  to={`/topics/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#{topic.name}</span>
                    <span className="text-xs text-muted-foreground">{topic.count}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          
          {/* Top Mentors Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Top Mentors</h3>
            </div>
            <div className="space-y-3">
              {topMentors.map((mentor) => (
                <Link 
                  key={mentor.id}
                  to={mentor.path}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{mentor.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{mentor.role}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              View All Mentors
            </Button>
          </section>
          
          {/* Featured Pitches Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Featured Pitches</h3>
            </div>
            <div className="space-y-3">
              {featuredPitches.map((pitch) => (
                <Link 
                  key={pitch.id}
                  to={pitch.path}
                  className="block p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <p className="text-sm font-medium line-clamp-2">{pitch.title}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-muted-foreground">{pitch.votes} votes</p>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              View More Pitches
            </Button>
          </section>
        </div>
      )}
    </aside>
  );
};

export default WebRightSidebar;
