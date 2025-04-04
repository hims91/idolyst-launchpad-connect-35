
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrendingTopic {
  id: string;
  topic: string;
  post_count: number;
  category?: string;
  is_featured: boolean;
}

export const useTrendingTopics = (limit = 10) => {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        
        // For now, we'll get the top tags from posts table since the migration failed
        const { data, error } = await supabase
          .from('posts')
          .select('tags, category')
          .not('tags', 'is', null)
          .limit(100);
        
        if (error) throw error;
        
        // Process the tags to find trending ones
        const tagCounts: Record<string, {count: number, category?: string}> = {};
        
        data.forEach(post => {
          if (!post.tags || !Array.isArray(post.tags)) return;
          
          post.tags.forEach((tag: string) => {
            if (!tag) return;
            if (!tagCounts[tag]) {
              tagCounts[tag] = { count: 0, category: post.category };
            }
            tagCounts[tag].count++;
          });
        });
        
        // Convert to array and sort by count
        const trendingTopics = Object.entries(tagCounts)
          .map(([topic, { count, category }]) => ({
            id: topic,
            topic,
            post_count: count,
            category,
            is_featured: count > 5
          }))
          .sort((a, b) => b.post_count - a.post_count)
          .slice(0, limit);
        
        setTopics(trendingTopics);
      } catch (err) {
        console.error('Error fetching trending topics:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch trending topics'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopics();
  }, [limit]);

  return { topics, isLoading, error };
};

export default useTrendingTopics;
