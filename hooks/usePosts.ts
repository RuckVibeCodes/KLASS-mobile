import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/clerk-expo';

export interface PostWithAuthor {
  id: string;
  community_id: string;
  content: string;
  media_urls: string[];
  visibility: 'public' | 'members' | 'paid';
  pinned: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    role: string;
  };
  liked_by_me: boolean;
}

interface UsePostsOptions {
  communityId?: string;
  limit?: number;
}

export function usePosts({ communityId, limit = 20 }: UsePostsOptions = {}) {
  const { getToken } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!communityId) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      // Get Clerk token for Supabase auth
      const token = await getToken({ template: 'supabase' });
      
      if (token) {
        // Set the auth header for this request
        supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });
      }

      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          id,
          community_id,
          content,
          media_urls,
          visibility,
          pinned,
          likes_count,
          comments_count,
          created_at,
          author:profiles!author_profile_id (
            id,
            display_name,
            avatar_url,
            role
          )
        `)
        .eq('community_id', communityId)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) {
        console.error('Error fetching posts:', fetchError);
        setError(fetchError.message);
        return;
      }

      // Transform data to match our interface
      const transformedPosts: PostWithAuthor[] = (data || []).map((post: any) => ({
        ...post,
        author: post.author || {
          id: '',
          display_name: 'Unknown',
          avatar_url: null,
          role: 'member',
        },
        liked_by_me: false, // TODO: Check user likes
      }));

      setPosts(transformedPosts);
      setError(null);
    } catch (err) {
      console.error('Error in fetchPosts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [communityId, limit, getToken]);

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [fetchPosts]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
  }, [fetchPosts]);

  const likePost = useCallback(async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked_by_me: !p.liked_by_me,
              likes_count: p.liked_by_me ? p.likes_count - 1 : p.likes_count + 1,
            }
          : p
      )
    );

    // TODO: API call to toggle like
    try {
      const token = await getToken({ template: 'supabase' });
      if (token) {
        supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });
      }

      // Call the toggle_post_like function
      const { error: likeError } = await supabase.rpc('toggle_post_like', {
        p_post_id: postId,
      });

      if (likeError) {
        console.error('Error toggling like:', likeError);
        // Revert on error
        await fetchPosts();
      }
    } catch (err) {
      console.error('Error in likePost:', err);
      await fetchPosts();
    }
  }, [getToken, fetchPosts]);

  return {
    posts,
    loading,
    error,
    refreshing,
    refresh,
    likePost,
  };
}
