import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/clerk-expo';

export interface ProgramWithProgress {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  visibility: 'public' | 'members' | 'paid';
  lessons_count: number;
  completed_lessons: number;
  created_at: string;
}

interface UseProgramsOptions {
  communityId?: string;
}

export function usePrograms({ communityId }: UseProgramsOptions = {}) {
  const { getToken } = useAuth();
  const [programs, setPrograms] = useState<ProgramWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrograms = useCallback(async () => {
    if (!communityId) {
      setPrograms([]);
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

      const { data, error: fetchError } = await supabase
        .from('programs')
        .select(`
          id,
          community_id,
          title,
          description,
          thumbnail_url,
          is_published,
          visibility,
          created_at,
          lessons:lessons(count)
        `)
        .eq('community_id', communityId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching programs:', fetchError);
        setError(fetchError.message);
        return;
      }

      // Transform data to include lesson counts
      const transformedPrograms: ProgramWithProgress[] = (data || []).map(
        (program: any) => ({
          ...program,
          lessons_count: program.lessons?.[0]?.count || 0,
          completed_lessons: 0, // TODO: Fetch from lesson_progress
        })
      );

      setPrograms(transformedPrograms);
      setError(null);
    } catch (err) {
      console.error('Error in fetchPrograms:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [communityId, getToken]);

  useEffect(() => {
    setLoading(true);
    fetchPrograms();
  }, [fetchPrograms]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPrograms();
  }, [fetchPrograms]);

  return {
    programs,
    loading,
    error,
    refreshing,
    refresh,
  };
}
