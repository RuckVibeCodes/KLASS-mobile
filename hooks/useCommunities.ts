import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth, useUser } from '@clerk/clerk-expo';

export interface UserCommunity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  role: string;
  tier: string;
  member_count: number;
}

export function useCommunities() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [communities, setCommunities] = useState<UserCommunity[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<UserCommunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = useCallback(async () => {
    if (!user) {
      setCommunities([]);
      setLoading(false);
      return;
    }

    try {
      const token = await getToken({ template: 'supabase' });
      
      if (token) {
        supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });
      }

      // Get user's profile(s) with community info
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select(`
          community_id,
          role,
          tier,
          community:communities (
            id,
            name,
            slug,
            description,
            logo_url,
            banner_url
          )
        `)
        .eq('clerk_user_id', user.id);

      if (profileError) {
        console.error('Error fetching communities:', profileError);
        setError(profileError.message);
        return;
      }

      // Transform and add member counts
      const userCommunities: UserCommunity[] = await Promise.all(
        (profiles || []).map(async (profile: any) => {
          // Get member count for this community
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', profile.community_id);

          return {
            id: profile.community.id,
            name: profile.community.name,
            slug: profile.community.slug,
            description: profile.community.description,
            logo_url: profile.community.logo_url,
            banner_url: profile.community.banner_url,
            role: profile.role,
            tier: profile.tier,
            member_count: count || 0,
          };
        })
      );

      setCommunities(userCommunities);
      
      // Auto-select first community if none selected
      if (userCommunities.length > 0 && !selectedCommunity) {
        setSelectedCommunity(userCommunities[0]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error in fetchCommunities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  }, [user, getToken, selectedCommunity]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const selectCommunity = useCallback((community: UserCommunity) => {
    setSelectedCommunity(community);
  }, []);

  return {
    communities,
    selectedCommunity,
    selectCommunity,
    loading,
    error,
    refresh: fetchCommunities,
  };
}
