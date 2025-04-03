import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/launchpad/PostCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { getPostById, Comment, addComment, getComments } from '@/api/launchpad';
import { useAuth } from '@/hooks/useAuth';
import UserAvatar from '@/components/shared/UserAvatar';

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedPost = await getPostById(id);
        
        if (fetchedPost) {
          setPost(fetchedPost);
          setError(null);
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch post'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      try {
        setCommentsLoading(true);
        const fetchedComments = await getComments(id);
        setComments(fetchedComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    };
    
    fetchComments();
  }, [id]);
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newComment.trim() || !id) return;
    
    try {
      setSubmitting(true);
      
      const comment = await addComment(
        id, 
        newComment, 
        replyingTo || undefined
      );
      
      if (comment) {
        if (replyingTo) {
          setComments(prevComments => 
            prevComments.map(c => 
              c.id === replyingTo
                ? { ...c, replies: [...(c.replies || []), comment] }
                : c
            )
          );
        } else {
          setComments(prev => [comment, ...prev]);
        }
        
        setNewComment('');
        setReplyingTo(null);
        
        if (post) {
          setPost({
            ...post,
            comments_count: (post.comments_count || 0) + 1
          });
        }
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const renderComment = (comment: Comment) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mb-4 last:mb-0"
    >
      <div className="flex gap-3">
        <UserAvatar
          user={{
            id: comment.user_id,
            name: comment.author?.full_name || "User",
            image: comment.author?.avatar_url
          }}
          className="h-8 w-8"
        />
        
        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex justify-between">
              <p className="font-medium text-sm">
                {comment.author?.full_name || "User"}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm mt-1 whitespace-pre-line">{comment.content}</p>
          </div>
          
          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs mt-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              onClick={() => setReplyingTo(comment.id)}
            >
              Reply
            </Button>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
              {comment.replies.map(renderComment)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 text-idolyst-purple animate-spin" />
        </div>
      </Layout>
    );
  }
  
  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-10">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-red-500 mb-4">
              {error?.message || "Post not found"}
            </h1>
            <Button 
              onClick={() => navigate('/')} 
              className="gradient-bg hover-scale"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>{`${post.author?.full_name}'s Post on ${post.category} | Idolyst`}</title>
        <meta 
          name="description" 
          content={post.content.substring(0, 160)} 
        />
        <meta property="og:title" content={`${post.author?.full_name}'s Post | Idolyst`} />
        <meta 
          property="og:description" 
          content={post.content.substring(0, 160)}
        />
        {post.media_url && (
          <meta property="og:image" content={post.media_url} />
        )}
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`${window.location.origin}/launchpad/post/${post.id}`} />
      </Helmet>
      
      <div className="max-w-2xl mx-auto pb-20 md:pb-10">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        
        <PostCard post={post} onUpdate={setPost} isDetail={true} />
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Comments ({post.comments_count || 0})
            </h2>
          </div>
          
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              {replyingTo && (
                <div className="mb-2 flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">
                    Replying to comment
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setReplyingTo(null)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
              )}
              
              <div className="flex gap-3">
                <UserAvatar
                  user={{
                    id: user.id,
                    name: user.profile?.full_name || user.email || "User",
                    image: user.profile?.avatar_url
                  }}
                  className="h-10 w-10"
                />
                
                <div className="relative flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="pr-10 min-h-[80px] resize-none"
                    disabled={submitting}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full gradient-bg hover-scale"
                    disabled={submitting || !newComment.trim()}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between p-4 mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm">Sign in to join the conversation</p>
              <Button
                onClick={() => navigate('/auth/login')}
                className="gradient-bg hover-scale"
                size="sm"
              >
                Sign In
              </Button>
            </div>
          )}
          
          <AnimatePresence mode="popLayout">
            {commentsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 text-idolyst-purple animate-spin" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map(renderComment)}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default PostPage;
