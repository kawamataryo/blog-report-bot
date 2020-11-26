export interface ZennTopic {
  id: number;
  name: string;
  display_name: string;
  taggings_count: number;
  image_url: string;
}

export interface ZennUser {
  id: number;
  username: string;
  name: string;
  avatar_url: string;
}

export interface ZennArticle {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  comments_count: number;
  liked_count: number;
  body_letters_count: number;
  reading_time: number;
  is_tech_badged: boolean;
  is_idea_badged: boolean;
  article_type: string;
  emoji: string;
  is_suspending_private: boolean;
  excluded_from_list: boolean;
  published_at: string;
  body_updated_at?: string;
  source_repo_updated_at: string;
  created_at: string;
  topics: ZennTopic[];
  user?: null;
}

export interface ZennMyArticlesResponse {
  articles: ZennArticle[];
}

export interface Follower {
  id: number;
  username: string;
  name: string;
  avatar_url: string;
}

export interface ZennMyFollowersResponse {
  users: ZennUser[];
  next_page: number | null;
}
