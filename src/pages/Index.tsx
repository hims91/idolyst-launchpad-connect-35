
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { useAuth } from "@/hooks/useAuth";
import { Rocket, Users, Award } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <ResponsiveLayout showRightSidebar={true}>
      <Helmet>
        <title>Idolyst - Professional Networking Platform for Entrepreneurs</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Idolyst</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A professional networking platform for entrepreneurs launching ideas, seeking mentorship, and building connections.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/auth/signup">Create Your Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth/login">Sign In</Link>
              </Button>
            </div>
          )}
        </section>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
          
          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-8 focus-visible:outline-none">
            {/* Main Platform Services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PitchHub */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Link to="/pitch-hub" className="block">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-white">PitchHub</h3>
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <div className="p-6">
                      <p className="text-muted-foreground mb-4">
                        Launch your startup ideas and get feedback from entrepreneurs and investors.
                      </p>
                      <Button variant="outline" className="w-full">
                        Explore PitchHub
                      </Button>
                    </div>
                  </Link>
                </CardContent>
              </Card>
              
              {/* MentorSpace */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Link to="/mentor-space" className="block">
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-white">MentorSpace</h3>
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="p-6">
                      <p className="text-muted-foreground mb-4">
                        Connect with industry experts for guidance, feedback, and professional growth.
                      </p>
                      <Button variant="outline" className="w-full">
                        Find Mentors
                      </Button>
                    </div>
                  </Link>
                </CardContent>
              </Card>
              
              {/* Ascend */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Link to="/ascend" className="block">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-white">Ascend</h3>
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div className="p-6">
                      <p className="text-muted-foreground mb-4">
                        Level up your profile with engagement rewards and track your professional growth.
                      </p>
                      <Button variant="outline" className="w-full">
                        Start Ascending
                      </Button>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Featured Tab */}
          <TabsContent value="featured" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Featured Content</h3>
                <p className="text-muted-foreground">
                  Featured content will be displayed here. Check back soon!
                </p>
              </Card>
            </div>
          </TabsContent>
          
          {/* Trending Tab */}
          <TabsContent value="trending" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Trending Now</h3>
                <p className="text-muted-foreground">
                  Trending content will be displayed here. Check back soon!
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
