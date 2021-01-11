import { ZennUser, ZennUserResponse } from "../types/zennTypes";
import axios from "axios";
import { ApiClient, ZennIndex } from "../types/types";

export class ZennClient implements ApiClient {
  private readonly BASE_API_URL = "https://api.zenn.dev";

  constructor(private userName: string) {
    axios.defaults.baseURL = this.BASE_API_URL;
  }

  async fetchIndex(): Promise<ZennIndex> {
    const user = await this.fetchUser();
    return {
      postCount: user.articles_count + user.books_count + user.scraps_count,
      likeCount: user.total_liked_count,
      followerCount: user.follower_count,
    };
  }

  async fetchUser(): Promise<ZennUser> {
    const response = await axios.get<ZennUserResponse>(
      `/users/${this.userName}`
    );
    return response.data.user;
  }
}
