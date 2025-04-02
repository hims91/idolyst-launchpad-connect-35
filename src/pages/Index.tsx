
import { useState } from "react";
import Layout from "../components/layout/Layout";
import PostCard from "../components/launchpad/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Mock data for the posts
const MOCK_POSTS = [
  {
    id: "post1",
    content: "Just closed a Series A funding round for my startup! Excited for the next phase of growth. Any advice from founders who've been through this stage?",
    author: {
      id: "user1",
      name: "Alex Johnson",
      username: "alexj",
      roles: ["Entrepreneur", "Mentor"]
    },
    createdAt: "2023-06-15T14:30:00Z",
    likesCount: 42,
    commentsCount: 8,
    repostsCount: 5,
    category: "Funding",
    isTrending: true
  },
  {
    id: "post2",
    content: "Looking for co-founders for my new fintech venture. I have the tech background but need someone with financial expertise. DM if interested!",
    author: {
      id: "user2",
      name: "Sarah Williams",
      username: "sarahw",
      roles: ["Entrepreneur"]
    },
    createdAt: "2023-06-15T12:45:00Z",
    likesCount: 18,
    commentsCount: 15,
    repostsCount: 2,
    category: "Networking"
  },
  {
    id: "post3",
    content: "5 User Acquisition Strategies That Actually Work for Early-Stage Startups:\n\n1. Content marketing focused on pain points\n2. Community building in niche forums\n3. Strategic partnerships\n4. Limited-time free trials\n5. Referral programs\n\nWhat would you add to this list?",
    author: {
      id: "user3",
      name: "Michael Chen",
      username: "mikec",
      roles: ["Mentor"]
    },
    createdAt: "2023-06-15T10:15:00Z",
    likesCount: 87,
    commentsCount: 23,
    repostsCount: 19,
    category: "Growth",
    isTrending: true
  },
  {
    id: "post4",
    content: "Just launched our new product on Product Hunt! Check it out and let me know what you think.",
    author: {
      id: "user4",
      name: "Emma Davis",
      username: "emmad",
      roles: ["Entrepreneur"]
    },
    createdAt: "2023-06-15T08:20:00Z",
    likesCount: 31,
    commentsCount: 7,
    repostsCount: 4,
    category: "Product Launch",
    mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
  }
];

// Category filters
const CATEGORIES = [
  "All",
  "Funding",
  "Startup News",
  "Growth",
  "Networking",
  "Product Launch",
  "Tech"
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Filter posts based on active tab and category
  const filteredPosts = MOCK_POSTS.filter(post => {
    if (activeTab === "trending") {
      return activeCategory === "All" || post.category === activeCategory;
    } else {
      // In a real app, this would filter for followed users
      return (activeCategory === "All" || post.category === activeCategory);
    }
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold gradient-text">Launchpad</h1>
          
          <Button className="gradient-bg hover-scale">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
        
        <Tabs defaultValue="trending" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="following">My Following</TabsTrigger>
          </TabsList>
          
          <div className="mb-4 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 pb-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`whitespace-nowrap ${activeCategory === category ? 'gradient-bg' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <TabsContent value="trending" className="space-y-4">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>
          
          <TabsContent value="following" className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-idolyst-gray mb-4">Follow users to see their posts here</p>
                <Button className="gradient-bg hover-scale">
                  Find People to Follow
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
