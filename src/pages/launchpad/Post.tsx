
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/launchpad/PostCard";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getPostById, getComments, addComment, Post, Comment } from "@/api/launchpad";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);
        
        if (fetchedPost) {
          // Load comments
          setLoadingComments(true);
          const fetchedComments = await getComments(fetchedPost.id);
          setComments(fetchedComments);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load the post. It may have been deleted or is unavailable.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
        setLoadingComments(false);
      }
    };
    
    fetchPost();
  }, [id, navigate]);
  
  const handlePostUpdate = (updatedPost: Post) => {
    setPost(updatedPost);
  };
  
  const handleAddComment = async () => {
    if (!comment.trim() || !post || !user) return;
    
    try {
      setSubmitting(true);
      
      const newComment = await addComment(
        post.id,
        comment,
        replyTo?.id
      );
      
      if (newComment) {
        toast({
          title: "Comment added",
          description: replyTo ? "Your reply has been posted" : "Your comment has been posted",
        });
        
        setComment("");
        setReplyTo(null);
        
        // Update comment count on post
        setPost(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            comments_count: (prev.comments_count || 0) + 1
          };
        });
        
        // Refresh comments
        const updatedComments = await getComments(post.id);
        setComments(updatedComments);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-idolyst-purple" />
        </div>
      </Layout>
    );
  }
  
  if (!post) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Post not found</h2>
            <p className="text-idolyst-gray mb-6">The post you're looking for doesn't exist or has been deleted.</p>
            <Button asChild className="gradient-bg">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>{post.author?.full_name || "User"}'s Post on Idolyst Launchpad</title>
        <meta name="description" content={post.content.substring(0, 160)} />
        <meta property="og:title" content={`${post.author?.full_name || "User"}'s Post on Idolyst`} />
        <meta property="og:description" content={post.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        {post.media_url && <meta property="og:image" content={post.media_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.author?.full_name || "User"}'s Post on Idolyst`} />
        <meta name="twitter:description" content={post.content.substring(0, 160)} />
        {post.media_url && <meta name="twitter:image" content={post.media_url} />}
      </Helmet>
      
      <div className="max-w-2xl mx-auto pb-20 md:pb-0">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Post</h1>
        </div>
        
        <PostCard post={post} onUpdate={handlePostUpdate} isDetail />
        
        {/* Comments section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">
            {post.comments_count || 0} {(post.comments_count === 1) ? "Comment" : "Comments"}
          </h2>
          
          {/* Add comment form */}
          <div className="mb-6">
            {replyTo && (
              <div className="bg-gray-50 p-3 rounded-t-md flex justify-between items-start">
                <div className="flex items-start">
                  <span className="text-sm text-idolyst-gray mr-2">Replying to:</span>
                  <div>
                    <span className="text-sm font-medium">{replyTo.author?.full_name || "User"}</span>
                    <p className="text-xs text-idolyst-gray line-clamp-1">{replyTo.content}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel
                </Button>
              </div>
            )}
            
            <div className="flex items-start gap-3 mb-1">
              {user ? (
                <UserAvatar 
                  user={{
                    id: user.id,
                    name: user.profile?.full_name || user.email || "User",
                    image: user.profile?.avatar_url
                  }}
                  size="sm"
                />
              ) : (
                <UserAvatar user={{ id: "guest", name: "Guest" }} size="sm" />
              )}
              
              <div className="flex-1">
                <Textarea
                  placeholder={user ? "Add a comment..." : "Sign in to comment"}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={!user || submitting}
                  className="resize-none min-h-[80px]"
                />
                
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleAddComment}
                    disabled={!user || !comment.trim() || submitting}
                    className="gradient-bg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {replyTo ? "Reply" : "Comment"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {!user && (
              <div className="text-center mt-2">
                <Button asChild variant="link" className="text-idolyst-purple">
                  <Link to="/auth/login">Sign in to comment</Link>
                </Button>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Comments list */}
          <div className="mt-6 space-y-6">
            {loadingComments ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-idolyst-purple" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-idolyst-gray">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <AnimatePresence>
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="mb-6"
                  >
                    <CommentItem 
                      comment={comment} 
                      onReply={() => setReplyTo(comment)}
                    />
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-12 mt-3 space-y-4">
                        {comment.replies.map((reply) => (
                          <CommentItem 
                            key={reply.id} 
                            comment={reply}
                            onReply={() => setReplyTo(reply)}
                            isReply
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface CommentItemProps {
  comment: Comment;
  onReply: () => void;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, isReply = false }) => {
  const { user } = useAuth();
  
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };
  
  return (
    <div className="flex gap-3">
      <Link to={`/profile/${comment.user_id}`}>
        <UserAvatar
          user={{
            id: comment.user_id,
            name: comment.author?.full_name || "Unknown",
            image: comment.author?.avatar_url
          }}
          size="sm"
        />
      </Link>
      
      <div className="flex-1">
        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex justify-between">
            <Link 
              to={`/profile/${comment.user_id}`}
              className="font-medium text-idolyst-gray-dark hover:text-idolyst-purple"
            >
              {comment.author?.full_name || "Unknown"}
            </Link>
            <span className="text-xs text-idolyst-gray">
              {formatDateTime(comment.created_at)}
            </span>
          </div>
          
          <p className="text-idolyst-gray-dark mt-1 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
        
        {/* Reply button */}
        {user && !isReply && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs mt-1"
            onClick={onReply}
          >
            Reply
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostPage;
