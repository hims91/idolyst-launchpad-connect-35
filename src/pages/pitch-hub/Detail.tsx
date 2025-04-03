import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import Layout from "@/components/layout/Layout";
import { 
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share2,
  User,
  Award,
  ChevronLeft,
  Loader2,
  Send,
  Calendar,
  LinkIcon,
  Eye,
  PieChart,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import UserAvatar from '@/components/shared/UserAvatar';
import FeedbackCard from '@/components/pitch-hub/FeedbackCard';
import { toast } from '@/hooks/use-toast';
import { usePitchIdea } from '@/hooks/usePitchHub';
import { useAuth } from '@/providers/AuthProvider';

// Chart components
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const PitchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [feedbackContent, setFeedbackContent] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const feedbackRef = useRef<HTMLDivElement>(null);
  
  const { 
    pitch, 
    isLoading, 
    isError,
    error,
    handleVote, 
    handleAddFeedback,
    isVoting,
    isAddingFeedback
  } = usePitchIdea(id || '');
  
  // Handle sharing
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Pitch idea link copied to clipboard!",
    });
  };
  
  // Handle submitting feedback
  const handleSubmitFeedback = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to add feedback",
        variant: "destructive",
      });
      return;
    }
    
    if (!feedbackContent.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please enter your feedback",
        variant: "destructive",
      });
      return;
    }
    
    handleAddFeedback(feedbackContent);
    setFeedbackContent('');
  };
  
  // Scroll to feedback section
  React.useEffect(() => {
    if (window.location.hash === '#feedback' && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth' });
        setActiveTab('feedback');
      }, 100);
    }
  }, []);
  
  // Format stage text
  const formatStage = (stage: string) => {
    switch (stage) {
      case 'ideation': return 'Ideation';
      case 'mvp': return 'MVP';
      case 'investment': return 'Investment';
      case 'pmf': return 'Product-Market Fit';
      case 'go_to_market': return 'Go-To-Market';
      case 'growth': return 'Growth';
      case 'maturity': return 'Maturity';
      default: return stage;
    }
  };
  
  // Generate chart data (simplified for demo)
  const generateChartData = () => {
    // In a real app, this would be actual data from the backend
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      name: day,
      views: Math.floor(Math.random() * 20) + 5,
      votes: Math.floor(Math.random() * 10)
    }));
  };
  
  const chartData = generateChartData();

  // If loading, show skeleton
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto pb-20 md:pb-0">
          <div className="mb-6 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-5 bg-slate-200 rounded w-1/2"></div>
          </div>
          
          <div className="space-y-6 animate-pulse">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // If there was an error fetching the pitch
  if (isError) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto pb-20 md:pb-0 text-center py-12">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Error Loading Pitch</h1>
          <p className="text-idolyst-gray mb-6">
            There was an error loading this pitch idea. This might be due to a database connection issue.
          </p>
          <Button onClick={() => navigate('/pitch-hub')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to PitchHub
          </Button>
        </div>
      </Layout>
    );
  }
  
  // If pitch not found
  if (!pitch) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto pb-20 md:pb-0 text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Pitch Not Found</h1>
          <p className="text-idolyst-gray mb-6">
            The pitch idea you're looking for does not exist or has been removed.
          </p>
          <Button onClick={() => navigate('/pitch-hub')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to PitchHub
          </Button>
        </div>
      </Layout>
    );
  }
  
  const createdDate = new Date(pitch.created_at);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <Layout>
      <Helmet>
        <title>{`${pitch.title} | PitchHub | Idolyst`}</title>
        <meta name="description" content={pitch.problem_statement} />
        <meta property="og:title" content={`${pitch.title} | PitchHub | Idolyst`} />
        <meta property="og:description" content={pitch.problem_statement} />
        <meta property="og:type" content="article" />
        {pitch.media_urls && pitch.media_urls.length > 0 && (
          <meta property="og:image" content={pitch.media_urls[0]} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${pitch.title} | PitchHub | Idolyst`} />
        <meta name="twitter:description" content={pitch.problem_statement} />
        {pitch.media_urls && pitch.media_urls.length > 0 && (
          <meta name="twitter:image" content={pitch.media_urls[0]} />
        )}
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
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">{pitch.title}</h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
              <div className="flex items-center text-idolyst-gray text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Published {timeAgo}
                </span>
              </div>
              
              <span className="text-idolyst-gray">•</span>
              
              <div className="flex items-center text-idolyst-gray text-sm">
                <Eye className="h-4 w-4 mr-1" />
                <span>{pitch.views_count} views</span>
              </div>
              
              {pitch.is_premium && (
                <>
                  <span className="text-idolyst-gray">•</span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                    <Award className="mr-1 h-3 w-3" />
                    Premium
                  </Badge>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Link to={`/profile/${pitch.author?.id}`}>
              <Button variant="secondary" size="sm">
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Main content with tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feedback" onClick={() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Feedback ({pitch.feedback?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            {/* Media carousel */}
            {pitch.media_urls && pitch.media_urls.length > 0 && (
              <div className="rounded-lg overflow-hidden border">
                <Carousel className="w-full">
                  <CarouselContent>
                    {pitch.media_urls.map((url, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="overflow-hidden rounded-md">
                            <img
                              src={url}
                              alt={`${pitch.title} - image ${index + 1}`}
                              className="w-full aspect-video object-cover"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}
            
            {/* Author info */}
            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
              <UserAvatar
                user={{
                  id: pitch.author?.id || '',
                  name: pitch.author?.full_name || 'Unknown',
                  image: pitch.author?.avatar_url
                }}
                showStatus={false}
                size="lg"
              />
              
              <div>
                <Link to={`/profile/${pitch.author?.id}`} className="font-medium hover:text-idolyst-purple transition-colors">
                  {pitch.author?.full_name || 'Unknown'}
                </Link>
                {pitch.author?.username && (
                  <p className="text-idolyst-gray text-sm">@{pitch.author.username}</p>
                )}
                {pitch.author?.bio && (
                  <p className="text-sm mt-1 line-clamp-2">{pitch.author.bio}</p>
                )}
              </div>
            </div>
            
            {/* Tags and stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {pitch.tags && pitch.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Development Stage</h3>
                <Badge variant="outline" className="text-sm py-1 px-3">
                  {formatStage(pitch.stage)}
                </Badge>
                <p className="text-xs text-idolyst-gray mt-2">
                  {pitch.stage === 'ideation' && 'Early concept phase'}
                  {pitch.stage === 'mvp' && 'Building minimum viable product'}
                  {pitch.stage === 'investment' && 'Seeking or secured investment'}
                  {pitch.stage === 'pmf' && 'Achieved product-market fit'}
                  {pitch.stage === 'go_to_market' && 'Developing market strategy'}
                  {pitch.stage === 'growth' && 'Scaling the business'}
                  {pitch.stage === 'maturity' && 'Established business'}
                </p>
              </div>
            </div>
            
            {/* Target Group */}
            <div>
              <h3 className="font-medium mb-2">Target Group</h3>
              <p className="text-idolyst-gray-dark">{pitch.target_group}</p>
            </div>
            
            {/* Problem Statement */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Problem Statement</h2>
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-idolyst-gray-dark whitespace-pre-wrap">{pitch.problem_statement}</p>
              </div>
            </div>
            
            {/* Solution */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Solution</h2>
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-idolyst-gray-dark whitespace-pre-wrap">{pitch.solution}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="feedback" ref={feedbackRef} className="space-y-6">
            {/* Feedback and voting section */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Voting panel */}
              <div className="flex md:flex-col items-center justify-center gap-2 p-4 border rounded-lg md:w-32">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleVote('upvote')}
                  disabled={isVoting}
                  className={`${pitch.user_vote === 'upvote' ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
                >
                  <ArrowUp className="h-6 w-6" />
                </Button>
                
                <div className="text-xl font-bold text-center min-w-[40px]">
                  {isVoting ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : pitch.vote_count || 0}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleVote('downvote')}
                  disabled={isVoting}
                  className={`${pitch.user_vote === 'downvote' ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                >
                  <ArrowDown className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Add feedback form */}
              <div className="flex-1 p-4 border rounded-lg">
                <h3 className="font-medium mb-3">Add Your Feedback</h3>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts about this pitch idea..."
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitFeedback}
                      disabled={!feedbackContent.trim() || isAddingFeedback}
                      className="gradient-bg hover-scale"
                    >
                      {isAddingFeedback ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Submit Feedback
                    </Button>
                  </div>
                  {!isAuthenticated && (
                    <p className="text-xs text-idolyst-gray text-center">
                      Please <Link to="/auth/login" className="text-idolyst-purple">log in</Link> to leave feedback
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Feedback list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Feedback & Comments
                  <Badge variant="outline" className="ml-2">
                    {pitch.feedback?.length || 0}
                  </Badge>
                </h3>
                
                {pitch.feedback && pitch.feedback.length > 0 && (
                  <Badge variant="secondary" className="flex items-center">
                    <Award className="mr-1 h-3 w-3" />
                    {pitch.mentor_feedback_count} Mentor Feedback
                  </Badge>
                )}
              </div>
              
              {(!pitch.feedback || pitch.feedback.length === 0) ? (
                <div className="text-center py-8 border rounded-lg">
                  <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <h4 className="font-medium mb-1">No Feedback Yet</h4>
                  <p className="text-idolyst-gray text-sm">
                    Be the first to provide feedback on this pitch idea
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mentor feedback first */}
                  {pitch.feedback
                    .filter(feedback => feedback.is_mentor_feedback)
                    .map(feedback => (
                      <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))}
                  
                  {/* Then regular feedback */}
                  {pitch.feedback
                    .filter(feedback => !feedback.is_mentor_feedback)
                    .map(feedback => (
                      <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-8">
            {/* Analytics and metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-white text-center">
                <p className="text-idolyst-gray text-sm mb-1">Views</p>
                <div className="flex items-center justify-center">
                  <Eye className="h-5 w-5 text-idolyst-purple mr-2" />
                  <span className="text-2xl font-bold">{pitch.views_count || 0}</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-white text-center">
                <p className="text-idolyst-gray text-sm mb-1">Net Votes</p>
                <div className="flex items-center justify-center">
                  <ArrowUp className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-2xl font-bold">{pitch.vote_count || 0}</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-white text-center">
                <p className="text-idolyst-gray text-sm mb-1">Feedback</p>
                <div className="flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-2xl font-bold">{pitch.feedback?.length || 0}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Activity Over Time</h3>
              <div className="border rounded-lg p-4 bg-white h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stackId="1"
                      stroke="#9b87f5" 
                      fill="#9b87f580" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="votes" 
                      stackId="2"
                      stroke="#4caf50" 
                      fill="#4caf5080" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-xs text-idolyst-gray mt-2">
                Last 7 days activity (views and votes)
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-white">
              <h3 className="font-medium mb-3">Engagement Metrics</h3>
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-2 border-b">
                  <span className="text-idolyst-gray">Feedback per view ratio:</span>
                  <span className="font-medium">{pitch.views_count ? ((pitch.feedback?.length || 0) / pitch.views_count * 100).toFixed(1) : 0}%</span>
                </li>
                <li className="flex items-center justify-between p-2 border-b">
                  <span className="text-idolyst-gray">Voting engagement:</span>
                  <span className="font-medium">{pitch.views_count ? (Math.abs(pitch.vote_count || 0) / pitch.views_count * 100).toFixed(1) : 0}%</span>
                </li>
                <li className="flex items-center justify-between p-2">
                  <span className="text-idolyst-gray">Mentor feedback:</span>
                  <span className="font-medium">{pitch.mentor_feedback_count || 0}</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Related ideas could go here in a real app */}
      </div>
    </Layout>
  );
};

export default PitchDetail;
