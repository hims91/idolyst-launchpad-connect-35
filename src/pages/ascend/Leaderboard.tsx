import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from "@/components/layout/Layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Trophy,
  ChevronLeft,
  Users,
  Calendar,
  Medal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LeaderboardCard from '@/components/ascend/LeaderboardCard';
import { useLeaderboard } from '@/hooks/useAscend';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTimeRange, setActiveTimeRange] = useState<'week' | 'month' | 'all'>('week');
  
  const { 
    data: leaderboard,
    isLoading
  } = useLeaderboard(activeTimeRange);

  const metrics = [
    {
      label: "Total Users",
      value: leaderboard?.length || 0,
      icon: <Users className="h-5 w-5" />
    },
    {
      label: "Time Frame",
      value: activeTimeRange === 'week' ? 'This Week' : activeTimeRange === 'month' ? 'This Month' : 'All Time',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      label: "Your Rank",
      value: leaderboard?.find(entry => entry.user_id === user?.id)?.weekly_rank || '-',
      icon: <Medal className="h-5 w-5" />
    }
  ];
  
  return (
    <Layout>
      <Helmet>
        <title>Leaderboard | Ascend | Idolyst</title>
        <meta name="description" content="See the top-ranked users based on XP and engagement on Idolyst." />
      </Helmet>

      <div className="max-w-4xl mx-auto pb-20 md:pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-4"
              onClick={() => navigate('/ascend')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">Leaderboard</h1>
          </div>
        </div>
        
        {/* Header with metrics */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-100 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg p-6 mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            <Trophy className="h-10 w-10 text-indigo-600 mr-4" />
            <div>
              <h2 className="text-xl font-bold">Top Users</h2>
              <p className="text-muted-foreground">
                The highest ranking community members based on XP and engagement
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {metrics.map((metric, index) => (
              <motion.div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3 text-indigo-600 dark:text-indigo-400">
                    {metric.icon}
                  </div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Time range tabs */}
        <Tabs 
          value={activeTimeRange} 
          onValueChange={(value) => setActiveTimeRange(value as 'week' | 'month' | 'all')}
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
            Top Users
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
            ) : leaderboard?.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <Trophy className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No data yet</h3>
                <p className="text-muted-foreground mb-6">
                  Leaderboard data is still being collected.
                </p>
              </div>
            ) : (
              <>
                {/* Top 3 with special styling */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {leaderboard?.slice(0, 3).map((entry) => (
                    <motion.div 
                      key={entry.id} 
                      className="p-4 rounded-lg border-2 shadow-md"
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.3 }}
                      style={{
                        borderColor: entry.weekly_rank === 1 
                          ? '#fcd34d' 
                          : entry.weekly_rank === 2 
                            ? '#9ca3af'
                            : '#d97706'
                      }}
                    >
                      <LeaderboardCard 
                        entry={entry} 
                        isCurrentUser={entry.user_id === user?.id}
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* Rest of the leaderboard */}
                {leaderboard && leaderboard.length > 3 && (
                  <>
                    <Separator className="my-6" />
                    
                    <div className="space-y-3">
                      {leaderboard.slice(3).map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.4 + index * 0.05 }}
                        >
                          <LeaderboardCard 
                            entry={entry} 
                            isCurrentUser={entry.user_id === user?.id}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Footer note */}
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Leaderboard rankings are updated daily based on XP earned from various activities.</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
