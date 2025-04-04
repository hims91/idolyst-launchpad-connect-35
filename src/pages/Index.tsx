
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Layout from "../components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import CategoryFilter from "@/components/launchpad/CategoryFilter";
import LaunchpadFeed from "@/components/launchpad/LaunchpadFeed";
import CreatePostModal from "@/components/launchpad/CreatePostModal";
import { FeedType } from "@/api/launchpad";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get params from URL or use defaults
  const initialTab = searchParams.get("tab") as FeedType || "trending";
  const initialCategory = searchParams.get("category") || "All";
  
  const [activeTab, setActiveTab] = useState<FeedType>(
    ["trending", "following", "latest"].includes(initialTab) ? initialTab as FeedType : "trending"
  );
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [refreshFeed, setRefreshFeed] = useState(0);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (activeCategory !== "All") {
      params.set("category", activeCategory);
    }
    setSearchParams(params, { replace: true });
  }, [activeTab, activeCategory, setSearchParams]);
  
  // Handle filter changes
  const handleTabChange = (value: string) => {
    if (value === "following" && !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view posts from people you follow",
        variant: "destructive",
      });
      return;
    }
    setActiveTab(value as FeedType);
  };
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  // Handle post creation
  const handlePostCreated = () => {
    toast({
      title: "Post created",
      description: "Your post has been published successfully",
    });
    
    // Refresh feed
    setRefreshFeed(prev => prev + 1);
    
    // If on following tab, switch to trending to see the new post
    if (activeTab === "following") {
      setActiveTab("trending");
    }
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Idolyst | Launchpad - Connect with the startup ecosystem</title>
        <meta name="description" content="Join Idolyst Launchpad to engage with posts from entrepreneurs, mentors, and innovators in the startup ecosystem." />
        <meta property="og:title" content="Idolyst Launchpad - Connect with the startup ecosystem" />
        <meta property="og:description" content="Join Idolyst to engage with posts from entrepreneurs, mentors, and innovators in the startup ecosystem." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Idolyst Launchpad - Connect with the startup ecosystem" />
        <meta name="twitter:description" content="Join Idolyst to engage with posts from entrepreneurs, mentors, and innovators in the startup ecosystem." />
      </Helmet>
      
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 px-4 lg:px-0">
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold gradient-text">Launchpad</h1>
          
          <CreatePostModal 
            trigger={
              <Button className="gradient-bg hover-scale">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            }
            onPostCreated={handlePostCreated}
          />
        </motion.div>
        
        <Tabs 
          defaultValue={activeTab} 
          value={activeTab}
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <div className="sticky top-12 md:top-0 bg-white z-10 pb-2">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="trending" className="data-[state=active]:gradient-bg">Trending</TabsTrigger>
              <TabsTrigger value="following" className="data-[state=active]:gradient-bg">Following</TabsTrigger>
              <TabsTrigger value="latest" className="data-[state=active]:gradient-bg">Latest</TabsTrigger>
            </TabsList>
            
            <CategoryFilter
              selectedCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          <TabsContent value="trending" className="mt-4">
            <LaunchpadFeed key={`trending-${activeCategory}-${refreshFeed}`} feedType="trending" category={activeCategory !== "All" ? activeCategory : undefined} />
          </TabsContent>
          
          <TabsContent value="following" className="mt-4">
            <LaunchpadFeed key={`following-${activeCategory}-${refreshFeed}`} feedType="following" category={activeCategory !== "All" ? activeCategory : undefined} />
          </TabsContent>
          
          <TabsContent value="latest" className="mt-4">
            <LaunchpadFeed key={`latest-${activeCategory}-${refreshFeed}`} feedType="latest" category={activeCategory !== "All" ? activeCategory : undefined} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
