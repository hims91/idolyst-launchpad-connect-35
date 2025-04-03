import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Helmet } from 'react-helmet-async';
import { 
  Trophy, 
  Award, 
  Zap, 
  Gift, 
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import XpProgress from "@/components/ascend/XpProgress";
import XpTransactionList from "@/components/ascend/XpTransactionList";
import BadgeCard from "@/components/ascend/BadgeCard";
import RewardCard from "@/components/ascend/RewardCard";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  useUserStats, 
  useRecentXpTransactions, 
  useUserBadges, 
  useAvailableRewards, 
  useClaimReward,
  useUpdateLoginStreak
} from "@/hooks/useAscend";
import { fadeIn, fadeInUp } from "@/lib/animations";
import Confetti from 'react-confetti';
import { useWindowSize } from "@/hooks/use-window-size";

const AscendDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { width, height } = useWindowSize();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { 
    data: userStats, 
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useUserStats();
  
  const { 
    data: xpTransactions, 
    isLoading: isLoadingTransactions 
  } = useRecentXpTransactions(10);
  
  const { 
    data: badges, 
    isLoading: isLoadingBadges 
  } = useUserBadges();
  
  const { 
    data: rewards, 
    isLoading: isLoadingRewards 
  } = useAvailableRewards();
  
  const { mutate: claimRewardMutation, isPending: isClaimingReward } = useClaimReward();
  
  const { mutate: updateLoginStreak } = useUpdateLoginStreak();
  
  useEffect(() => {
    if (user?.id) {
      updateLoginStreak();
    }
  }, [user?.id]);
  
  const handleClaimReward = (rewardId: string) => {
    claimRewardMutation(rewardId, {
      onSuccess: () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
        refetchStats();
      }
    });
  };
  
  const seasonalEvents = [
    {
      id: 'summer-xp',
      title: 'Summer XP Boost',
      description: 'Earn double XP for all activities until August 31st',
      icon: Sparkles,
      startDate: new Date('2023-07-01'),
      endDate: new Date('2023-08-31'),
    }
  ];
  
  const xpSources = [
    { action: 'Post Content', xp: 10 },
    { action: 'Get 10+ Upvotes', xp: 5 },
    { action: 'Complete a Mentorship Session', xp: 15 },
    { action: 'Provide Feedback on PitchHub', xp: 8 },
    { action: 'Daily Login (Streak Bonus)', xp: 3 },
    { action: 'Level Up', xp: 20 },
  ];
  
  return (
    <Layout>
      <Helmet>
        <title>Ascend | Idolyst</title>
        <meta name="description" content="Track your progress, earn XP, unlock badges, and climb the leaderboard on the Ascend gamification platform." />
      </Helmet>
      
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.15}
          />
        )}
      </AnimatePresence>
      
      <div className="max-w-6xl mx-auto pb-20 md:pb-0">
        <motion.div 
          className="mb-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex items-center">
              <div className="mr-4 p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <Trophy className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Ascend</h1>
                <p className="text-muted-foreground max-w-xl">
                  Level up your journey with XP, badges, leaderboard rankings, and rewards
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/ascend/leaderboard')}
              className="gradient-bg hover-scale"
            >
              <Trophy className="mr-2 h-4 w-4" />
              View Leaderboard
            </Button>
          </div>
        </motion.div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mt-6"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="history">XP History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {isLoadingStats ? (
              <div className="space-y-6">
                <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
                  <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
                  <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 overflow-hidden border-indigo-100 dark:border-indigo-800/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2">
                          <XpProgress
                            currentXp={userStats?.xp || 0}
                            level={userStats?.level || 1}
                            nextLevelXp={userStats?.nextLevelXp || 100}
                            progress={userStats?.progressToNextLevel || 0}
                          />
                          
                          <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="flex flex-col items-center p-3 bg-white/80 dark:bg-gray-800/50 rounded-lg">
                              <Trophy className="h-5 w-5 text-indigo-500 mb-1" />
                              <span className="text-lg font-bold">{userStats?.rank || '-'}</span>
                              <span className="text-xs text-muted-foreground">Rank</span>
                            </div>
                            
                            <div className="flex flex-col items-center p-3 bg-white/80 dark:bg-gray-800/50 rounded-lg">
                              <Award className="h-5 w-5 text-amber-500 mb-1" />
                              <span className="text-lg font-bold">{userStats?.badgesCount || 0}</span>
                              <span className="text-xs text-muted-foreground">Badges</span>
                            </div>
                            
                            <div className="flex flex-col items-center p-3 bg-white/80 dark:bg-gray-800/50 rounded-lg">
                              <Calendar className="h-5 w-5 text-green-500 mb-1" />
                              <span className="text-lg font-bold">{userStats?.streakDays || 0}</span>
                              <span className="text-xs text-muted-foreground">Day Streak</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/80 dark:bg-gray-800/50 rounded-lg p-4">
                          <h3 className="text-sm font-medium mb-3">XP Sources</h3>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {xpSources.map((source, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{source.action}</span>
                                <span className="font-medium text-indigo-600 dark:text-indigo-400">+{source.xp} XP</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="h-full">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center">
                            <Award className="mr-2 h-5 w-5 text-amber-500" />
                            Badges
                          </CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => setActiveTab("badges")}
                          >
                            View All
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                        <CardDescription>
                          {userStats?.badgesCount || 0} badges earned
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-3 gap-2">
                          {isLoadingBadges ? (
                            Array(3).fill(0).map((_, i) => (
                              <div key={i} className="aspect-square rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                            ))
                          ) : badges?.filter(b => b.isEarned).length === 0 ? (
                            <p className="col-span-3 text-center text-sm text-muted-foreground py-6">
                              You haven't earned any badges yet.
                            </p>
                          ) : (
                            badges?.filter(b => b.isEarned).slice(0, 3).map((badge) => (
                              <div key={badge.id} className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-1">
                                  <img src={badge.icon} alt={badge.name} className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium truncate w-full">{badge.name}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="h-full">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center">
                            <Gift className="mr-2 h-5 w-5 text-purple-500" />
                            Rewards
                          </CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => setActiveTab("rewards")}
                          >
                            View All
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                        <CardDescription>
                          Spend your XP on special perks
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        {isLoadingRewards ? (
                          <div className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
                        ) : rewards?.length === 0 ? (
                          <p className="text-center text-sm text-muted-foreground py-6">
                            No rewards available at this time.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {rewards?.slice(0, 2).map((reward) => (
                              <div key={reward.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mr-2">
                                    <Gift className="h-4 w-4 text-purple-500" />
                                  </div>
                                  <div className="text-sm font-medium">{reward.name}</div>
                                </div>
                                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                  {reward.xp_cost} XP
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="h-full">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center">
                            <Trophy className="mr-2 h-5 w-5 text-indigo-500" />
                            Leaderboard
                          </CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => navigate('/ascend/leaderboard')}
                          >
                            View All
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                        <CardDescription>
                          Your rank: #{userStats?.rank || '-'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-md border border-yellow-100 dark:border-yellow-900/20">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-2">
                                <span className="text-xs font-bold text-yellow-800 dark:text-yellow-400">1</span>
                              </div>
                              <div className="text-sm font-medium">Top User</div>
                            </div>
                            <div className="text-xs font-medium">
                              1,250 XP
                            </div>
                          </div>
                          
                          {userStats?.rank && userStats.rank > 1 && (
                            <div className="flex justify-between items-center p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-md border border-indigo-100 dark:border-indigo-900/20">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-2">
                                  <span className="text-xs font-bold text-indigo-800 dark:text-indigo-400">
                                    {userStats.rank}
                                  </span>
                                </div>
                                <div className="text-sm font-medium">You</div>
                              </div>
                              <div className="text-xs font-medium">
                                {userStats.xp} XP
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                          onClick={() => navigate('/ascend/leaderboard')}
                        >
                          View Full Leaderboard
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
                
                {seasonalEvents.length > 0 && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-100 dark:border-cyan-900/30">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                          <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1">{seasonalEvents[0].title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {seasonalEvents[0].description}
                            </p>
                            <div className="text-xs text-cyan-700 dark:text-cyan-400">
                              Ends: {seasonalEvents[0].endDate.toLocaleDateString()}
                            </div>
                          </div>
                          
                          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                            <Zap className="mr-2 h-4 w-4" />
                            Participate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="badges" className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Your Badges</h2>
            
            {isLoadingBadges ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Award className="mr-2 h-5 w-5 text-amber-500" />
                    Earned Badges ({badges?.filter(b => b.isEarned).length || 0})
                  </h3>
                  
                  {badges?.filter(b => b.isEarned).length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                      <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-2">No Badges Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Complete platform activities to earn your first badge.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {badges?.filter(b => b.isEarned).map((badge, index) => (
                        <motion.div
                          key={badge.id}
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.05 }}
                        >
                          <BadgeCard
                            name={badge.name}
                            description={badge.description}
                            icon={badge.icon}
                            isEarned={true}
                            earnedAt={badge.earnedAt}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Separator className="my-8" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-indigo-500" />
                    Badges in Progress ({badges?.filter(b => !b.isEarned).length || 0})
                  </h3>
                  
                  {badges?.filter(b => !b.isEarned).length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center">
                      <p className="text-muted-foreground">
                        You've earned all available badges!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {badges?.filter(b => !b.isEarned).map((badge, index) => (
                        <motion.div
                          key={badge.id}
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          <BadgeCard
                            name={badge.name}
                            description={badge.description}
                            icon={badge.icon}
                            isEarned={false}
                            progress={badge.progress}
                            target={badge.target}
                            progressPercent={badge.progressPercent}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="rewards" className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Rewards</h2>
            
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-200 dark:bg-indigo-900/50 mr-4">
                    <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Your XP Balance</h3>
                    <p className="text-muted-foreground">Use your XP to claim rewards</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {userStats?.xp || 0} XP
                </div>
              </div>
            </motion.div>
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <Gift className="mr-2 h-5 w-5 text-purple-500" />
                Available Rewards
              </h3>
              
              {isLoadingRewards ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : rewards?.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                  <Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No Rewards Available</h3>
                  <p className="text-muted-foreground">
                    Check back later for new rewards to claim.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rewards?.map((reward, index) => (
                    <motion.div
                      key={reward.id}
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <RewardCard
                        name={reward.name}
                        description={reward.description}
                        xpCost={reward.xp_cost}
                        icon={reward.icon}
                        currentXp={userStats?.xp || 0}
                        onClaim={() => handleClaimReward(reward.id)}
                        isLoading={isClaimingReward}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">XP History</h2>
            
            {isLoadingTransactions ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <XpTransactionList transactions={xpTransactions || []} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AscendDashboard;
