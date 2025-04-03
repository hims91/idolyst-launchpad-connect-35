
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { 
  useMentor, 
  useMentorStatus, 
  useAvailableTimeSlots 
} from "@/hooks/use-mentors";
import { motion } from "framer-motion";
import { pageTransition, fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { 
  ArrowLeft, 
  Calendar, 
  Star, 
  Clock, 
  Users, 
  MessageSquare,
  Award, 
  CheckCircle2, 
  Link2, 
  MapPin, 
  ExternalLink 
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookingForm from "@/components/mentorspace/BookingForm";
import { Skeleton } from "@/components/ui/skeleton";
import { MentorCertification, SessionReview } from "@/types/mentor";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const MentorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const aboutRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLDivElement>(null);
  
  const { data: mentor, isLoading } = useMentor(id || "");
  const { data: mentorStatus } = useMentorStatus();
  
  const handleBookSession = () => {
    setShowBookingDialog(true);
  };
  
  const handleBookingComplete = () => {
    setShowBookingDialog(false);
    navigate('/mentor-space/sessions');
  };
  
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (activeTab === "about" && aboutRef.current) {
      scrollToSection(aboutRef);
    } else if (activeTab === "reviews" && reviewsRef.current) {
      scrollToSection(reviewsRef);
    } else if (activeTab === "availability" && availabilityRef.current) {
      scrollToSection(availabilityRef);
    }
  }, [activeTab]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto pb-20 md:pb-0 px-4">
          <MentorDetailSkeleton />
        </div>
      </Layout>
    );
  }
  
  if (!mentor) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto pb-20 md:pb-0 px-4 text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Mentor Not Found</h1>
          <p className="text-gray-500 mb-6">
            The mentor you're looking for doesn't exist or is no longer available.
          </p>
          <Button onClick={() => navigate('/mentor-space/directory')}>
            Return to Directory
          </Button>
        </div>
      </Layout>
    );
  }
  
  const { 
    profile, 
    expertise, 
    bio, 
    hourly_rate, 
    years_experience, 
    avg_rating, 
    total_sessions,
    total_reviews,
    certifications,
    reviews,
    availability
  } = mentor;
  
  const isOwnProfile = user?.id === mentor.id;
  
  return (
    <Layout>
      <Helmet>
        <title>{`${profile.full_name || profile.username} | Mentor Profile`}</title>
        <meta 
          name="description" 
          content={`Connect with ${profile.full_name || profile.username}, a mentor with expertise in ${expertise.join(', ')}. Book a session to accelerate your professional growth.`} 
        />
        <meta 
          name="keywords" 
          content={`${profile.full_name || profile.username}, mentor, ${expertise.join(', ')}, professional mentorship`} 
        />
        <link rel="canonical" href={`/mentor-space/${mentor.id}`} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${profile.full_name || profile.username} | Mentor Profile`} />
        <meta 
          property="og:description" 
          content={`Connect with ${profile.full_name || profile.username}, a mentor with expertise in ${expertise.join(', ')}.`} 
        />
        <meta property="og:url" content={`/mentor-space/${mentor.id}`} />
        <meta property="og:image" content={profile.avatar_url || ''} />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": profile.full_name || profile.username,
            "description": bio,
            "image": profile.avatar_url || '',
            "jobTitle": "Mentor",
            "knowsAbout": expertise,
            "makesOffer": {
              "@type": "Offer",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": hourly_rate,
                "priceCurrency": "USD",
                "unitText": "hour"
              },
              "itemOffered": {
                "@type": "Service",
                "name": "Mentorship Session",
                "description": `Professional mentorship with ${profile.full_name || profile.username}`
              }
            },
            "review": reviews?.slice(0, 5).map((review: SessionReview) => ({
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": 5
              },
              "author": {
                "@type": "Person",
                "name": review.reviewer?.full_name || review.reviewer?.username || "Anonymous"
              },
              "reviewBody": review.comment || ""
            }))
          })}
        </script>
      </Helmet>
      
      <motion.div 
        className="max-w-4xl mx-auto pb-20 md:pb-0 px-4"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/mentor-space/directory')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Mentor Profile</h1>
          </div>
        </div>
        
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm md:hidden py-2 -mx-4 px-4 mb-6">
          <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="availability">Book</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <motion.div variants={fadeInUp}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-2 ring-offset-2 ring-offset-background ring-purple-200 dark:ring-purple-800">
                  <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || profile.username || ''} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                    {getInitials(profile.full_name || profile.username || '')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {profile.full_name || profile.username}
                    {mentor.is_featured && (
                      <Badge className="ml-2 bg-amber-500 hover:bg-amber-600">Featured</Badge>
                    )}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="font-medium">{avg_rating.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({total_reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-blue-500 mr-1" />
                      <span>{total_sessions} sessions</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-green-500 mr-1" />
                      <span>{years_experience} years experience</span>
                    </div>
                    
                    {profile.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {expertise.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div ref={aboutRef} className="scroll-mt-20">
              <motion.div variants={fadeInUp} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">About</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{bio}</p>
                </div>
              </motion.div>
            </div>
            
            {certifications && certifications.length > 0 && (
              <motion.div variants={fadeInUp} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                <motion.div 
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  {certifications.map((cert: MentorCertification) => (
                    <CertificationCard key={cert.id} certification={cert} />
                  ))}
                </motion.div>
              </motion.div>
            )}
            
            <div ref={reviewsRef} className="scroll-mt-20">
              <motion.div variants={fadeInUp} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                
                {reviews && reviews.length > 0 ? (
                  <motion.div 
                    variants={staggerContainer}
                    className="space-y-4"
                  >
                    {reviews.map((review: SessionReview) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </motion.div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div ref={availabilityRef} className="scroll-mt-20">
              <motion.div 
                variants={fadeInUp}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-4 sticky top-6"
              >
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">${hourly_rate}</div>
                  <div className="text-gray-500 text-sm">per hour</div>
                </div>
                
                <div className="space-y-4">
                  {!isOwnProfile ? (
                    <Button className="w-full" onClick={handleBookSession}>
                      Book a Session
                    </Button>
                  ) : (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md text-center">
                      <p className="text-sm text-purple-800 dark:text-purple-300">
                        This is your profile
                      </p>
                    </div>
                  )}
                  
                  {profile.social_links && profile.social_links.length > 0 && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <h4 className="font-medium mb-2">Connect</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.social_links.map((link: any) => (
                          <Button 
                            key={link.id} 
                            variant="outline" 
                            size="sm"
                            asChild
                            className="text-xs"
                          >
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {link.platform}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="font-medium mb-2">Availability</h4>
                    <div className="space-y-2 text-sm">
                      {availability && availability.length > 0 ? (
                        availability.map((slot: any) => {
                          // Convert day of week to string
                          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                          const day = days[slot.day_of_week];
                          
                          return (
                            <div key={slot.id} className="flex justify-between items-center">
                              <span>{day}</span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {slot.start_time} - {slot.end_time}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 text-center">No regular availability set</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Booking Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book a Session with {profile.full_name || profile.username}</DialogTitle>
            </DialogHeader>
            <BookingForm mentor={mentor} onComplete={handleBookingComplete} />
          </DialogContent>
        </Dialog>
      </motion.div>
    </Layout>
  );
};

// Certification Card Component
const CertificationCard = ({ certification }: { certification: MentorCertification }) => {
  return (
    <motion.div 
      variants={staggerItem}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{certification.title}</h4>
          <p className="text-gray-600 dark:text-gray-400">{certification.issuer}</p>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Issued {format(parseISO(certification.issue_date), "MMMM yyyy")}</span>
            {certification.expiry_date && (
              <span className="ml-2">
                • Expires {format(parseISO(certification.expiry_date), "MMMM yyyy")}
              </span>
            )}
          </div>
        </div>
        
        {certification.credential_url && (
          <Button variant="ghost" size="icon" asChild>
            <a href={certification.credential_url} target="_blank" rel="noopener noreferrer">
              <Link2 className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// Review Card Component
const ReviewCard = ({ review }: { review: SessionReview }) => {
  return (
    <motion.div 
      variants={staggerItem}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.reviewer?.avatar_url || ''} alt={review.reviewer?.full_name || review.reviewer?.username || ''} />
          <AvatarFallback className="bg-purple-100 text-purple-800 text-sm">
            {getInitials(review.reviewer?.full_name || review.reviewer?.username || '')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">
                {review.reviewer?.full_name || review.reviewer?.username}
              </div>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < review.rating 
                        ? "text-amber-500 fill-amber-500" 
                        : "text-gray-300 dark:text-gray-600"
                    }`} 
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {review.session && review.session.session_date && (
                    format(parseISO(review.session.session_date), "MMM d, yyyy")
                  )}
                </span>
              </div>
            </div>
          </div>
          
          {review.comment && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">{review.comment}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton for loading state
const MentorDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="h-20 w-20 md:h-24 md:w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        
        <div className="flex-1">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-8">
            <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          
          <div>
            <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
};

export default MentorDetail;
