
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from "@/components/layout/Layout";
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  ChevronLeft, 
  Calendar,
  Medal,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeaderboard } from '@/hooks/usePitchHub';
import { Skeleton } from '@/components/ui/skeleton';
import { TimeRange } from '@/api/pitch';
import LeaderboardCard from '@/components/pitch-hub/LeaderboardCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  const { 
    leaderboard, 
    isLoading,
    isError,
    error,
    refetch
  } = useLeaderboard(timeRange);
  
  // Handle time range change
  const handleRangeChange = (range: string) => {
    setTimeRange(range as TimeRange);
  };

  return (
    <Layout>
      <Helmet>
        <title>PitchHub Leaderboard | Idolyst</title>
        <meta name="description" content="See the top-rated startup ideas on the PitchHub leaderboard." />
        <meta property="og:title" content="PitchHub Leaderboard | Idolyst" />
        <meta property="og:description" content="See the top-rated startup ideas on the PitchHub leaderboard." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="PitchHub Leaderboard | Idolyst" />
        <meta name="twitter:description" content="See the top-rated startup ideas on the PitchHub leaderboard." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="max-w-3xl mx-auto pb-20 md:pb-0">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/pitch-hub')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to PitchHub
          </Button>
        </div>
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center">
              <Award className="mr-2 h-7 w-7" />
              PitchHub Leaderboard
            </h1>
            <p className="text-idolyst-gray-dark mt-1">
              Top-rated startup ideas recognized by the community
            </p>
          </div>
        </div>
        
        {/* Error message if there's an issue */}
        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was a problem loading the leaderboard data.
              <Button variant="outline" size="sm" className="ml-2" onClick={() => refetch()}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Time range selection */}
        <Tabs 
          defaultValue="week" 
          value={timeRange}
          onValueChange={handleRangeChange}
          className="w-full mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="month" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              All Time
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Leaderboard Content */}
        <div className="space-y-6">
          {/* Top 3 winners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons for top 3
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-200 mb-2"></div>
                    </div>
                    <div className="h-5 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))
            ) : leaderboard && leaderboard.length >= 3 ? leaderboard.slice(0, 3).map((idea, index) => (
              <Card 
                key={idea.id} 
                className={`overflow-hidden border-t-4 ${
                  index === 0 ? 'border-t-yellow-400' : 
                  index === 1 ? 'border-t-gray-400' : 
                  'border-t-amber-600'
                } animate-fade-in`}
              >
                <CardHeader className="pt-6 pb-2 text-center">
                  <div className="flex justify-center mb-3">
                    <div className={`rounded-full p-3 ${
                      index === 0 ? 'bg-yellow-100' : 
                      index === 1 ? 'bg-gray-100' : 
                      'bg-amber-100'
                    }`}>
                      <Medal className={`h-6 w-6 ${
                        index === 0 ? 'text-yellow-600' : 
                        index === 1 ? 'text-gray-600' : 
                        'text-amber-600'
                      }`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg">
                    {index === 0 ? '1st Place' : 
                     index === 1 ? '2nd Place' : 
                     '3rd Place'}
                  </CardTitle>
                  <p className="text-sm text-idolyst-gray">
                    {idea.vote_count || 0} votes
                  </p>
                </CardHeader>
                <CardContent className="pt-0 text-center">
                  <h3 className="font-medium mb-1 hover:text-idolyst-purple transition-colors cursor-pointer"
                      onClick={() => navigate(`/pitch-hub/${idea.id}`)}
                  >
                    {idea.title}
                  </h3>
                  <p className="text-xs text-idolyst-gray">
                    by {idea.author?.full_name || 'Unknown'}
                  </p>
                </CardContent>
              </Card>
            )) : null}
          </div>
          
          {/* Rest of the leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                {timeRange === 'week' ? 'Weekly' : 
                 timeRange === 'month' ? 'Monthly' : 
                 'All-Time'} Top Ideas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {isLoading ? (
                // Loading skeletons for remaining items
                Array(7).fill(0).map((_, index) => (
                  <div key={index} className="animate-pulse flex items-center p-3 border rounded-md">
                    <div className="h-8 w-8 bg-slate-200 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 w-12 bg-slate-200 rounded-md"></div>
                  </div>
                ))
              ) : !leaderboard || leaderboard.length === 0 ? (
                <div className="py-12 text-center">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No leaderboard data yet</h3>
                  <p className="text-idolyst-gray mb-4">
                    Be the first to submit and vote on ideas!
                  </p>
                </div>
              ) : (
                // Render all leaderboard items (will include the top 3 again, but that's fine)
                leaderboard.map((idea, index) => (
                  <LeaderboardCard 
                    key={idea.id} 
                    pitch={idea} 
                    rank={index + 1} 
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
