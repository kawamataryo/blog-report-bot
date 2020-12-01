interface ApiClientConstructor {
  new (property: string): ApiClient;
}

interface ApiClient {
  fetchIndex: () => Promise<QiitaIndex | TwitterIndex | ZennIndex | NoteIndex>;
}

interface TwitterIndex {
  tweetCount: number;
  followersCount: number;
  followingCount: number;
}

interface QiitaIndex {
  postCount: number;
  lgtmCount: number;
  followerCount: number;
}

interface ZennIndex {
  postCount: number;
  likeCount: number;
  followerCount: number;
}

interface NoteIndex {
  postCount: number;
  likeCount: number;
  followerCount: number;
}
