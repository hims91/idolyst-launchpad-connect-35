
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ArrowUp, 
  ArrowDown, 
  MessageSquare,
  Share2,
  Award,
  TagIcon,
  Calendar,
  Eye
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import UserAvatar from '@/components/shared/UserAvatar';
import FeedbackCard from '@/components/pitch-hub/FeedbackCard';
import { usePitchIdea, usePitchAnalytics } from '@/hooks/usePitchHub';
import { useAuth } from '@/providers/AuthProvider';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';

const PitchHubDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [feedback, setFeedback] = useState('');
  
  // Ensure id is defined before using it
  const pitchId = id || '';
  
  const { 
    pitch, 
    isLoading,
    handleVote,
    handleAddFeedback,
    isVoting,
    isAddingFeedback
  } = usePitchIdea(pitchId);
  
  const { analytics } = usePitchAnalytics(pitch);
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: pitch?.title || 'Checkout this startup idea',
          text: pitch?.problem_statement || 'An interesting startup idea on Idolyst',
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          description: "Share this link with others",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleSubmitFeedback = () => {
    if (!feedback.trim()) return;
    
    handleAddFeedback(feedback);
    setFeedback('');
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto pb-20 md:pb-0">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-64 w-full bg-gray-200 rounded"></div>
            <div className="h-32 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!pitch) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Pitch Not Found</h2>
          <p className="text-idolyst-gray-dark mb-6">The pitch idea you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/pitch-hub')}>
            Back to PitchHub
          </Button>
        </div>
      </Layout>
    );
  }
  
  const createdDate = new Date(pitch.created_at);
  const formattedDate = format(createdDate, 'PPP');
  
  return (
    <Layout>
      <Helmet>
        <title>{pitch.title} | PitchHub | Idolyst</title>
        <meta name="description" content={pitch.problem_statement} />
        <meta property="og:title" content={`${pitch.title} | PitchHub | Idolyst`} />
        <meta property="og:description" content={pitch.problem_statement} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pitch.title} />
        <meta name="twitter:description" content={pitch.problem_statement} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <div className="max-w-3xl mx-auto pb-20 md:pb-0">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="mr-4"
              onClick={() => navigate('/pitch-hub/index')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">{pitch.title}</h1>
              {pitch.is_premium && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 mt-1">
                  <Award className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Share2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>
                  Share Pitch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <Link 
              to={`/profile/${pitch.user_id}`}
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            >
              <UserAvatar
                user={{
                  id: pitch.user_id,
                  name: pitch.author?.full_name || 'Unknown',
                  image: pitch.author?.avatar_url
                }}
                showStatus={false}
              />
              
              <div>
                <div className="font-medium">
                  {pitch.author?.full_name || 'Unknown'}
                </div>
                {pitch.author?.username && (
                  <div className="text-sm text-idolyst-gray">
                    @{pitch.author.username}
                  </div>
                )}
              </div>
            </Link>
            
            <div className="flex items-center space-x-3 text-idolyst-gray text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formattedDate}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {pitch.views_count} views
              </div>
            </div>
          </div>
          
          <Separator />
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Voting sidebar */}
          <div className="md:col-span-1 flex md:flex-col items-center justify-center md:justify-start space-x-4 md:space-x-0 md:space-y-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => handleVote('upvote')}
              disabled={isVoting || !user}
            >
              <ArrowUp className={`h-6 w-6 ${pitch.user_vote === 'upvote' ? 'text-green-600 fill-green-600' : ''}`} />
            </Button>
            
            <div className="text-lg font-semibold">{pitch.vote_count || 0}</div>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10"
              onClick={() => handleVote('downvote')}
              disabled={isVoting || !user}
            >
              <ArrowDown className={`h-6 w-6 ${pitch.user_vote === 'downvote' ? 'text-red-600 fill-red-600' : ''}`} />
            </Button>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-11 space-y-6">
            {/* Media carousel if available */}
            {pitch.media_urls && pitch.media_urls.length > 0 && (
              <Carousel className="w-full max-w-md mx-auto">
                <CarouselContent>
                  {pitch.media_urls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="flex items-center justify-center p-1">
                        <img 
                          src={url} 
                          alt={`${pitch.title} image ${index + 1}`}
                          className="max-h-80 w-auto object-contain rounded-md"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </Carousel>
            )}
            
            {/* Problem and solution */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Problem</h2>
                <div className="p-4 bg-gray-50 rounded-lg text-idolyst-gray-dark">
                  {pitch.problem_statement}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Target Audience</h2>
                  <div className="p-4 bg-gray-50 rounded-lg text-idolyst-gray-dark">
                    {pitch.target_group}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-2">Development Stage</h2>
                  <div className="p-4 bg-gray-50 rounded-lg text-idolyst-gray-dark flex items-center">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 capitalize">
                      {pitch.stage.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Solution</h2>
                <div className="p-4 bg-gray-50 rounded-lg text-idolyst-gray-dark">
                  {pitch.solution}
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <div className="flex items-center mb-2">
                  <TagIcon className="h-5 w-5 mr-2 text-idolyst-gray" />
                  <h2 className="text-xl font-semibold">Tags</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pitch.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Analytics Card */}
            {analytics && (
              <Card className="mt-8 bg-gray-50 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pitch Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-2">
                      <div className="text-idolyst-gray text-sm">Views</div>
                      <div className="text-2xl font-bold">{analytics.views}</div>
                    </div>
                    <div className="text-center p-2">
                      <div className="text-idolyst-gray text-sm">Votes</div>
                      <div className="text-2xl font-bold">{analytics.votes}</div>
                    </div>
                    <div className="text-center p-2">
                      <div className="text-idolyst-gray text-sm">Feedback</div>
                      <div className="text-2xl font-bold">{analytics.feedbackCount}</div>
                    </div>
                    <div className="text-center p-2">
                      <div className="text-idolyst-gray text-sm">Mentor Feedback</div>
                      <div className="text-2xl font-bold">{analytics.mentorFeedbackCount}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Feedback section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <MessageSquare className="h-5 w-5 mr-2" />
                Feedback and Comments ({pitch.feedback_count || 0})
              </h2>
              
              {user ? (
                <div className="space-y-4 mb-6">
                  <Textarea
                    placeholder="Share your thoughts or feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmitFeedback}
                      disabled={!feedback.trim() || isAddingFeedback}
                      className="gradient-bg"
                    >
                      {isAddingFeedback ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className="mb-6">
                  <CardContent className="p-4 text-center">
                    <p className="mb-4">Sign in to leave feedback on this pitch</p>
                    <Link to="/auth/login">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
              
              {/* Mentor feedback section */}
              {pitch.feedback && pitch.feedback.some(f => f.is_mentor_feedback) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center mb-4">
                    <Award className="h-5 w-5 mr-2" />
                    Mentor Feedback
                  </h3>
                  
                  <div className="space-y-4">
                    {pitch.feedback
                      .filter(f => f.is_mentor_feedback)
                      .map((feedback) => (
                        <FeedbackCard key={feedback.id} feedback={feedback} />
                      ))}
                  </div>
                </div>
              )}
              
              {/* Community comments */}
              {pitch.feedback && pitch.feedback.some(f => !f.is_mentor_feedback) ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Community Comments</h3>
                  
                  {pitch.feedback
                    .filter(f => !f.is_mentor_feedback)
                    .map((feedback) => (
                      <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-idolyst-gray-dark">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PitchHubDetail;
