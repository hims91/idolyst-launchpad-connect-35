
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { 
  Trophy, 
  Medal, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  ArrowLeft,
  Calendar
} from "lucide-react";
import { useLeaderboard } from "@/hooks/useAscend";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fadeIn, fadeInUp } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "@/api/ascend";

const AscendLeaderboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  
  const { 
    data: leaderboardData, 
    isLoading
  } = useLeaderboard(timeRange);
  
  const topUsers = leaderboardData?.slice(0, 3) || [];
  const remainingUsers = leaderboardData?.slice(3) || [];
  
  const getRankChangeElement = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-500">
          <ArrowUp className="h-3 w-3 mr-1" />
          <span className="text-xs">{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowDown className="h-3 w-3 mr-1" />
          <span className="text-xs">{Math.abs(change)}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <Minus className="h-3 w-3 mr-1" />
          <span className="text-xs">0</span>
        </div>
      );
    }
  };
  
  const getPlaceIcon = (place: number) => {
    if (place === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (place === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (place === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return null;
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Leaderboard | Ascend | Idolyst</title>
        <meta name="description" content="See who's leading the pack on Idolyst! Check out the top contributors and track your position on the Ascend leaderboard." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto pb-20 md:pb-0">
        <motion.div
          className="mb-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/ascend')}
                className="mr-2 md:mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold gradient-text flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                  Leaderboard
                </h1>
                <p className="text-muted-foreground">
                  See who's leading the way on Idolyst
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
              <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="week" className="text-xs px-2 h-7">Weekly</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs px-2 h-7">Monthly</TabsTrigger>
                  <TabsTrigger value="all" className="text-xs px-2 h-7">All Time</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-[400px] rounded-lg" />
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              {/* Second Place */}
              {topUsers.length > 1 ? (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="order-2 md:order-1"
                >
                  <Card className="relative overflow-hidden h-full">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div>
                    <CardContent className="pt-8 pb-6 text-center">
                      <div className="absolute top-3 left-3 flex items-center">
                        <Medal className="h-5 w-5 text-gray-400" />
                        <span className="ml-1 text-sm font-medium">2nd</span>
                      </div>
                      
                      <div className="flex justify-center mb-3">
                        <Avatar className="h-20 w-20 border-4 border-gray-400">
                          <AvatarImage 
                            src={topUsers[1]?.profile?.avatar_url || ""} 
                            alt={topUsers[1]?.profile?.username || "User"} 
                          />
                          <AvatarFallback className="text-lg">
                            {topUsers[1]?.profile?.username?.[0].toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <h3 className="font-bold truncate">
                        {topUsers[1]?.profile?.username || "User"}
                      </h3>
                      <p className="text-muted-foreground text-sm truncate">
                        {topUsers[1]?.profile?.full_name || ""}
                      </p>
                      
                      <div className="mt-4 flex justify-center items-center">
                        <div className="bg-gray-100 dark:bg-gray-800 py-1 px-3 rounded-full flex items-center">
                          <span className="font-semibold mr-2">Level {topUsers[1]?.profile?.level || 1}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                            {topUsers[1]?.xp.toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-center">
                        {getRankChangeElement(topUsers[1]?.weekly_change || 0)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="order-2 md:order-1">
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="py-8 text-center">
                      <Medal className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-medium text-muted-foreground">
                        No data for 2nd place
                      </h3>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* First Place */}
              {topUsers.length > 0 ? (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="order-1 md:order-2"
                >
                  <Card className="relative overflow-hidden h-full transform md:scale-110 shadow-lg border-2 border-yellow-500/50">
                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                    <CardContent className="pt-10 pb-8 text-center">
                      <div className="absolute top-3 left-3 flex items-center">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        <span className="ml-1 text-sm font-medium">1st</span>
                      </div>
                      
                      <div className="flex justify-center mb-3">
                        <Avatar className="h-24 w-24 border-4 border-yellow-500">
                          <AvatarImage 
                            src={topUsers[0]?.profile?.avatar_url || ""} 
                            alt={topUsers[0]?.profile?.username || "User"} 
                          />
                          <AvatarFallback className="text-xl">
                            {topUsers[0]?.profile?.username?.[0].toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <h3 className="text-lg font-bold truncate">
                        {topUsers[0]?.profile?.username || "User"}
                      </h3>
                      <p className="text-muted-foreground text-sm truncate">
                        {topUsers[0]?.profile?.full_name || ""}
                      </p>
                      
                      <div className="mt-4 flex justify-center items-center">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 py-1 px-4 rounded-full flex items-center">
                          <span className="font-semibold mr-2">Level {topUsers[0]?.profile?.level || 1}</span>
                          <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                            {topUsers[0]?.xp.toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-center">
                        {getRankChangeElement(topUsers[0]?.weekly_change || 0)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="order-1 md:order-2">
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="py-8 text-center">
                      <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-medium text-muted-foreground">
                        No data for 1st place
                      </h3>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Third Place */}
              {topUsers.length > 2 ? (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="order-3"
                >
                  <Card className="relative overflow-hidden h-full">
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-700"></div>
                    <CardContent className="pt-8 pb-6 text-center">
                      <div className="absolute top-3 left-3 flex items-center">
                        <Medal className="h-5 w-5 text-amber-700" />
                        <span className="ml-1 text-sm font-medium">3rd</span>
                      </div>
                      
                      <div className="flex justify-center mb-3">
                        <Avatar className="h-20 w-20 border-4 border-amber-700">
                          <AvatarImage 
                            src={topUsers[2]?.profile?.avatar_url || ""} 
                            alt={topUsers[2]?.profile?.username || "User"} 
                          />
                          <AvatarFallback className="text-lg">
                            {topUsers[2]?.profile?.username?.[0].toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <h3 className="font-bold truncate">
                        {topUsers[2]?.profile?.username || "User"}
                      </h3>
                      <p className="text-muted-foreground text-sm truncate">
                        {topUsers[2]?.profile?.full_name || ""}
                      </p>
                      
                      <div className="mt-4 flex justify-center items-center">
                        <div className="bg-amber-100/50 dark:bg-amber-900/30 py-1 px-3 rounded-full flex items-center">
                          <span className="font-semibold mr-2">Level {topUsers[2]?.profile?.level || 1}</span>
                          <span className="text-amber-700 dark:text-amber-500 font-bold">
                            {topUsers[2]?.xp.toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-center">
                        {getRankChangeElement(topUsers[2]?.weekly_change || 0)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="order-3">
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="py-8 text-center">
                      <Medal className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-medium text-muted-foreground">
                        No data for 3rd place
                      </h3>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
            
            {/* Leaderboard Table */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <Card>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          XP
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {remainingUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                            No users to display
                          </td>
                        </tr>
                      ) : (
                        remainingUsers.map((user: LeaderboardEntry, index: number) => (
                          <motion.tr 
                            key={user.id}
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 + (index * 0.03) }}
                            className="hover:bg-accent/50 cursor-pointer"
                            onClick={() => navigate(`/profile/${user.user_id}`)}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="font-medium text-sm">{index + 4}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage 
                                    src={user.profile?.avatar_url || ""} 
                                    alt={user.profile?.username || "User"} 
                                  />
                                  <AvatarFallback>
                                    {user.profile?.username?.[0].toUpperCase() || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.profile?.username || "User"}</div>
                                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                    {user.profile?.full_name || ""}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-medium">
                                {user.profile?.level || 1}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {user.xp.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              {getRankChangeElement(user.weekly_change)}
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AscendLeaderboard;
