import {
  ZennArticle,
  Follower,
  ZennMyArticlesResponse,
  ZennMyFollowersResponse,
} from "../types/zennTypes";
import axios from "axios";

export class ZennClient implements ApiClient {
  private readonly BASE_API_URL = "https://api.zenn.dev";

  constructor(private userName: string) {
    axios.defaults.baseURL = this.BASE_API_URL;
  }

  async fetchIndex() {
    const articles = await this.fetchMyAllArticles();
    const followers = await this.fetchMyFollowers();

    return {
      postCount: articles.length,
      likeCount: this.tallyUpLikeCount(articles),
      followerCount: followers.length,
    };
  }

  private async fetchMyAllArticles(): Promise<ZennArticle[]> {
    const response = await axios.get<ZennMyArticlesResponse>(
      `/users/${this.userName}/articles`
    );
    return response.data.articles ?? [];
  }

  private async fetchMyFollowers(): Promise<Follower[]> {
    let followers = [] as Follower[];
    let hasNextPage = true;

    try {
      for (let page = 1; hasNextPage; page++) {
        const response = await axios.get<ZennMyFollowersResponse>(
          `/users/${this.userName}/followers?page=${page}`
        );
        hasNextPage = !!response.data.next_page;
        followers = [...followers, ...response.data.users];
      }
    } catch (e) {
      console.error(e);
    }

    return followers;
  }

  private tallyUpLikeCount(articles: ZennArticle[]): number {
    return articles.reduce<number>((count, article) => {
      return count + article.liked_count;
    }, 0);
  }
}
