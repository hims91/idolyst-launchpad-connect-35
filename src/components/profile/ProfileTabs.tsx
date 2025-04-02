
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExtendedProfile } from "@/types/profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

interface ProfileTabsProps {
  profile: ExtendedProfile;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

const ProfileTabs = ({ profile, onFollowersClick, onFollowingClick }: ProfileTabsProps) => {
  const [currentTab, setCurrentTab] = useState("posts");
  
  // We'd normally fetch these from API endpoints
  const placeholderPosts = [
    {
      id: "1",
      title: "Starting My Entrepreneurial Journey",
      excerpt: "Excited to share my experience as a first-time entrepreneur and the lessons I've learned along the way...",
      created_at: "2023-08-15T14:30:00Z",
      likes: 24,
      comments: 8
    },
    {
      id: "2",
      title: "Market Research Techniques That Actually Work",
      excerpt: "After months of trial and error, I've found these market research methods to be most effective...",
      created_at: "2023-09-02T09:15:00Z",
      likes: 42,
      comments: 15
    }
  ];
  
  const placeholderIdeas = [
    {
      id: "1",
      title: "EcoTrack: Sustainability Monitoring for Small Businesses",
      status: "In Review",
      category: "Sustainability",
      created_at: "2023-07-10T11:20:00Z",
      votes: 18
    },
    {
      id: "2",
      title: "MentoMatch: AI-Powered Mentor-Mentee Matching",
      status: "Approved",
      category: "Education",
      created_at: "2023-08-22T16:40:00Z",
      votes: 31
    }
  ];
  
  const placeholderMentorships = [
    {
      id: "1",
      title: "Product Market Fit Workshop",
      mentee: "Alex Johnson",
      date: "2023-09-15T13:00:00Z",
      status: "Completed",
      rating: 4.8
    },
    {
      id: "2",
      title: "Fundraising Strategy Session",
      mentee: "Taylor Smith",
      date: "2023-09-25T15:30:00Z",
      status: "Scheduled"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay: 0.4 }}
    >
      <Tabs defaultValue="posts" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          {profile.roles.some(role => role.role === "entrepreneur") && (
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
          )}
          {profile.roles.some(role => role.role === "mentor") && (
            <TabsTrigger value="mentorships">Mentorships</TabsTrigger>
          )}
          <TabsTrigger value="following" onClick={onFollowingClick}>Following</TabsTrigger>
          <TabsTrigger value="followers" onClick={onFollowersClick}>Followers</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent value="posts" className="mt-0">
            <motion.div 
              key="posts"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {placeholderPosts.length > 0 ? (
                placeholderPosts.map(post => (
                  <motion.div key={post.id} variants={staggerItem}>
                    <Card>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{post.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center text-sm">
                              <svg className="h-4 w-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {post.likes}
                            </span>
                            <span className="flex items-center text-sm">
                              <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {post.comments}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No posts yet</p>
                </div>
              )}
            </motion.div>
          </TabsContent>
          
          {profile.roles.some(role => role.role === "entrepreneur") && (
            <TabsContent value="ideas" className="mt-0">
              <motion.div 
                key="ideas"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {placeholderIdeas.length > 0 ? (
                  placeholderIdeas.map(idea => (
                    <motion.div key={idea.id} variants={staggerItem}>
                      <Card>
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{idea.title}</h3>
                            <Badge className={
                              idea.status === "Approved" ? "bg-green-100 text-green-800" :
                              idea.status === "In Review" ? "bg-amber-100 text-amber-800" :
                              "bg-blue-100 text-blue-800"
                            }>
                              {idea.status}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="mb-3">{idea.category}</Badge>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{formatDate(idea.created_at)}</span>
                            <span className="flex items-center text-sm">
                              <svg className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              {idea.votes} Votes
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No ideas submitted yet</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          )}
          
          {profile.roles.some(role => role.role === "mentor") && (
            <TabsContent value="mentorships" className="mt-0">
              <motion.div 
                key="mentorships"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {placeholderMentorships.length > 0 ? (
                  placeholderMentorships.map(session => (
                    <motion.div key={session.id} variants={staggerItem}>
                      <Card>
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{session.title}</h3>
                            <Badge className={
                              session.status === "Completed" ? "bg-green-100 text-green-800" :
                              session.status === "Scheduled" ? "bg-blue-100 text-blue-800" :
                              "bg-amber-100 text-amber-800"
                            }>
                              {session.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            With {session.mentee}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{formatDate(session.date)}</span>
                            {session.rating && (
                              <span className="flex items-center text-sm">
                                <svg className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                {session.rating}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No mentorship sessions yet</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          )}
          
          <TabsContent value="following" className="mt-0">
            <div className="text-center py-10 text-gray-500">
              <p>Following list will appear here</p>
              <Button className="mt-4" onClick={onFollowingClick}>
                Show Following
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="followers" className="mt-0">
            <div className="text-center py-10 text-gray-500">
              <p>Followers list will appear here</p>
              <Button className="mt-4" onClick={onFollowersClick}>
                Show Followers
              </Button>
            </div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default ProfileTabs;
