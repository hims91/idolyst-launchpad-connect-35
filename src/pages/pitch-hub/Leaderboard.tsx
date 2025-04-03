import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Filter,
  ChevronLeft,
  Plus
} from 'lucide-react';
import Layout from "@/components/layout/Layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LeaderboardCard from '@/components/pitch-hub/LeaderboardCard';
import { useLeaderboard } from '@/hooks/usePitchHub';
import { TimeRange } from '@/api/pitch';
import { Helmet } from 'react-helmet-async';

const PitchHubLeaderboard = () => {
  const navigate = useNavigate();
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>('week');
  
  const { 
    leaderboard, 
    isLoading
  } = useLeaderboard(activeTimeRange);

  const metrics = [
    {
      label: "Total Ideas",
      value: leaderboard.length,
      icon: <Users className="h-5 w-5" />
    },
    {
      label: "Time Frame",
      value: activeTimeRange === 'week' ? 'This Week' : activeTimeRange === 'month' ? 'This Month' : 'All Time',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      label: "Total Votes",
      value: leaderboard.reduce((sum, idea) => sum + (idea.vote_count || 0), 0),
      icon: <Filter className="h-5 w-5" />
    }
  ];
  
  return (
    <Layout>
      <Helmet>
        <title>PitchHub Leaderboard | Idolyst</title>
        <meta name="description" content="See the top-ranked startup ideas based on community votes and engagement." />
        <meta property="og:title" content="PitchHub Leaderboard | Idolyst" />
        <meta property="og:description" content="See the top-ranked startup ideas based on community votes and engagement." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="PitchHub Leaderboard | Idolyst" />
        <meta name="twitter:description" content="See the top-ranked startup ideas based on community votes and engagement." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="max-w-4xl mx-auto pb-20 md:pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-4"
              onClick={() => navigate('/pitch-hub')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">Leaderboard</h1>
          </div>
          
          <Button 
            className="gradient-bg hover-scale w-full md:w-auto"
            onClick={() => navigate('/pitch-hub/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Your Idea
          </Button>
        </div>
        
        {/* Header with metrics */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-50 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Trophy className="h-10 w-10 text-idolyst-purple mr-4" />
            <div>
              <h2 className="text-xl font-bold">Top Pitch Ideas</h2>
              <p className="text-idolyst-gray-dark">
                The most popular startup ideas based on community votes and engagement
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-md p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-idolyst-purple/10 mr-3">
                    {metric.icon}
                  </div>
                  <div className="text-sm text-idolyst-gray">{metric.label}</div>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Time range tabs */}
        <Tabs 
          value={activeTimeRange} 
          onValueChange={(value) => setActiveTimeRange(value as TimeRange)}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Leaderboard listing */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            Top Ranking Ideas
          </h3>
          
          <div className="space-y-3">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center p-4 border rounded-md">
                  <div className="h-10 w-10 bg-slate-200 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 w-16 bg-slate-200 rounded-md"></div>
                </div>
              ))
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <Trophy className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No ideas yet</h3>
                <p className="text-idolyst-gray mb-6">
                  {activeTimeRange === 'week' 
                    ? "No ideas have been submitted this week" 
                    : activeTimeRange === 'month'
                      ? "No ideas have been submitted this month"
                      : "No ideas have been submitted yet"}
                </p>
                <Button
                  onClick={() => navigate('/pitch-hub/new')}
                  className="gradient-bg"
                >
                  Submit the First Idea
                </Button>
              </div>
            ) : (
              <>
                {/* Top 3 with special styling */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {leaderboard.slice(0, 3).map((idea, index) => (
                    <div 
                      key={idea.id} 
                      className={`
                        p-4 rounded-lg border-2 shadow-md transition-transform hover:scale-105
                        ${index === 0 
                          ? 'border-yellow-300 bg-yellow-50' 
                          : index === 1 
                            ? 'border-gray-300 bg-gray-50'
                            : 'border-amber-300 bg-amber-50'
                        }
                      `}
                    >
                      <LeaderboardCard 
                        pitch={idea} 
                        rank={index + 1} 
                      />
                    </div>
                  ))}
                </div>
                
                {/* Rest of the leaderboard */}
                {leaderboard.length > 3 && (
                  <>
                    <Separator className="my-6" />
                    
                    <div className="space-y-3">
                      {leaderboard.slice(3).map((idea, index) => (
                        <LeaderboardCard 
                          key={idea.id} 
                          pitch={idea} 
                          rank={index + 4} 
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Footer note */}
        <div className="mt-10 text-center text-sm text-idolyst-gray">
          <p>Leaderboard rankings are updated based on votes, comments, and other engagement metrics.</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </Layout>
  );
};

export default PitchHubLeaderboard;
