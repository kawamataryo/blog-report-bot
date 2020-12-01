export interface PublicMetrics {
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
}

export interface UserData {
  username: string;
  name: string;
  id: string;
  public_metrics: PublicMetrics;
}

export interface UsersResponse {
  data: UserData;
}

