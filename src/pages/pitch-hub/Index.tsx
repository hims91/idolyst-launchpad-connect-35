

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  Clock, 
  Flame, 
  Award, 
  Tag as TagIcon,
  Plus
} from 'lucide-react';
import Layout from "@/components/layout/Layout";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PitchCard from '@/components/pitch-hub/PitchCard';
import LeaderboardCard from '@/components/pitch-hub/LeaderboardCard';
import { usePitchIdeas, useLeaderboard, usePitchTags } from '@/hooks/usePitchHub';
import { FilterType, TimeRange } from '@/api/pitch';
import { Helmet } from 'react-helmet-async';

const PitchHubIndex = () => {
  const navigate = useNavigate();
  const { popularTags } = usePitchTags();
  
  // Filters and search state
  const [activeFilter, setActiveFilter] = useState<FilterType>('new');
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>('all');
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch pitch ideas based on active filters
  const { 
    ideas, 
    isLoading, 
    handleLoadMore,
    page
  } = usePitchIdeas(activeFilter, activeTimeRange, selectedTag, searchQuery);
  
  // Fetch leaderboard ideas
  const { 
    leaderboard, 
    isLoading: isLeaderboardLoading 
  } = useLeaderboard('week');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be triggered by state change via usePitchIdeas hook
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? undefined : tag);
  };
  
  const handleNewPitch = () => {
    navigate('/pitch-hub/new');
  };

  return (
    <Layout>
      <Helmet>
        <title>PitchHub - Startup Idea Validation | Idolyst</title>
        <meta name="description" content="Submit your startup ideas, get feedback from mentors, and validate your concepts with the community." />
        <meta property="og:title" content="PitchHub - Startup Idea Validation | Idolyst" />
        <meta property="og:description" content="Submit your startup ideas, get feedback from mentors, and validate your concepts with the community." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PitchHub - Startup Idea Validation | Idolyst" />
        <meta name="twitter:description" content="Submit your startup ideas, get feedback from mentors, and validate your concepts with the community." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="max-w-4xl mx-auto pb-20 md:pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">PitchHub</h1>
            <p className="text-idolyst-gray-dark mt-1">
              Submit your startup ideas, get feedback and validation
            </p>
          </div>
          
          <Button 
            className="gradient-bg hover-scale w-full md:w-auto"
            onClick={handleNewPitch}
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Your Idea
          </Button>
        </div>
        
        {/* Search and Filters Row */}
        <div className="mb-6 space-y-3">
          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search" 
                placeholder="Search ideas..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel className="text-xs text-idolyst-gray">Sort By</DropdownMenuLabel>
                <DropdownMenuRadioGroup 
                  value={activeFilter} 
                  onValueChange={(value) => setActiveFilter(value as FilterType)}
                >
                  <DropdownMenuRadioItem value="new">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Newest</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="top">
                    <Flame className="mr-2 h-4 w-4" />
                    <span>Top Voted</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="mentor">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Mentor Reviewed</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel className="text-xs text-idolyst-gray">Time Range</DropdownMenuLabel>
                <DropdownMenuRadioGroup 
                  value={activeTimeRange} 
                  onValueChange={(value) => setActiveTimeRange(value as TimeRange)}
                >
                  <DropdownMenuRadioItem value="all">All Time</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="month">This Month</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="week">This Week</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Tags Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <TagIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filter by Tags</SheetTitle>
                  <SheetDescription>
                    Select tags to filter pitch ideas
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6">
                  {selectedTag && (
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Selected Tag:</div>
                      <div className="flex">
                        <Badge className="flex items-center mr-2 bg-idolyst-purple text-white">
                          {selectedTag}
                          <SheetClose asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 p-0 ml-1 text-white hover:text-white hover:bg-transparent"
                              onClick={() => setSelectedTag(undefined)}
                            >
                              <span className="sr-only">Clear</span>
                              &times;
                            </Button>
                          </SheetClose>
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm font-medium mb-2">Popular Tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <SheetClose key={tag} asChild>
                        <Badge 
                          variant={selectedTag === tag ? "default" : "outline"}
                          className={`cursor-pointer ${selectedTag === tag ? 'bg-idolyst-purple text-white' : ''}`}
                          onClick={() => handleTagSelect(tag)}
                        >
                          {tag}
                        </Badge>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </form>
          
          {/* Active filters display */}
          {(activeFilter !== 'new' || activeTimeRange !== 'all' || selectedTag) && (
            <div className="flex flex-wrap gap-2 animate-fade-in">
              {activeFilter !== 'new' && (
                <Badge variant="secondary" className="flex items-center">
                  {activeFilter === 'top' ? 'Top Voted' : 'Mentor Reviewed'}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setActiveFilter('new')}
                  >
                    <span className="sr-only">Clear</span>
                    &times;
                  </Button>
                </Badge>
              )}
              
              {activeTimeRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center">
                  {activeTimeRange === 'week' ? 'This Week' : 'This Month'}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setActiveTimeRange('all')}
                  >
                    <span className="sr-only">Clear</span>
                    &times;
                  </Button>
                </Badge>
              )}
              
              {selectedTag && (
                <Badge variant="secondary" className="flex items-center">
                  Tag: {selectedTag}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSelectedTag(undefined)}
                  >
                    <span className="sr-only">Clear</span>
                    &times;
                  </Button>
                </Badge>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={() => {
                  setActiveFilter('new');
                  setActiveTimeRange('all');
                  setSelectedTag(undefined);
                  setSearchQuery('');
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
        
        {/* Main Content with Tabs */}
        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="ideas">Pitch Ideas</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ideas" className="space-y-4">
            {isLoading && page === 1 ? (
              <div className="py-12 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-slate-200 h-10 w-10 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                </div>
              </div>
            ) : ideas.length === 0 ? (
              <div className="py-12 text-center border rounded-lg">
                <div className="flex flex-col items-center">
                  <Filter className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No ideas found</h3>
                  <p className="text-idolyst-gray mb-6 max-w-sm mx-auto">
                    {searchQuery 
                      ? `No ideas match "${searchQuery}"` 
                      : selectedTag 
                        ? `No ideas found with the tag "${selectedTag}"` 
                        : "We couldn't find any ideas with the current filters"}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setActiveFilter('new');
                      setActiveTimeRange('all');
                      setSelectedTag(undefined);
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {ideas.map((idea) => (
                    <PitchCard key={idea.id} pitch={idea} />
                  ))}
                </div>
                
                {/* Load more button */}
                {ideas.length >= page * 10 && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Top Ideas This Week</h2>
            </div>
            
            {isLeaderboardLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center p-3 border rounded-md">
                    <div className="h-8 w-8 bg-slate-200 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 w-12 bg-slate-200 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-12 text-center border rounded-lg">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No leaderboard data yet</h3>
                <p className="text-idolyst-gray mb-4">
                  Be the first to submit and vote on ideas!
                </p>
                <Button onClick={handleNewPitch}>Submit an Idea</Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {leaderboard.map((idea, index) => (
                    <LeaderboardCard 
                      key={idea.id} 
                      pitch={idea} 
                      rank={index + 1} 
                    />
                  ))}
                </div>
                
                <div className="mt-6">
                  <Separator className="mb-4" />
                  <div className="text-sm text-center text-idolyst-gray">
                    Leaderboard is updated daily based on votes and engagement
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PitchHubIndex;
