// KLASS shared types

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  banner_url: string | null;
  owner_id: string;
  created_at: string;
}

export interface Program {
  id: string;
  community_id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Resource {
  id: string;
  community_id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export interface Event {
  id: string;
  community_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string | null;
  is_virtual: boolean;
  meeting_url: string | null;
  created_at: string;
}

export interface Member {
  id: string;
  user_id: string;
  community_id: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  display_name: string;
  avatar_url: string | null;
  joined_at: string;
}

export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  content: string;
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}
