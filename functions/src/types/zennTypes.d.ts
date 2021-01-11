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
  total_liked_count: number;
  articles_count: number;
  books_count: number;
  scraps_count: number;
  follower_count: number;
  following_count: number;
}

export interface ZennUserResponse {
  user: ZennUser
}
