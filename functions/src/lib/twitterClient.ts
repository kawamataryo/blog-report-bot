import axios from "axios";
import { PublicMetrics, UsersResponse } from "../types/twitterTypes";
import * as functions from "firebase-functions";
import { ApiClient, TwitterIndex } from "../types/types";

export class TwitterClient implements ApiClient {
  private readonly BASE_URL = "https://api.twitter.com/2";

  constructor(private userName: string) {
    axios.defaults.baseURL = this.BASE_URL;
    axios.defaults.headers["Authorization"] = `Bearer ${
      functions.config().token.twitter
    }`;
  }

  async fetchIndex(): Promise<TwitterIndex> {
    const metrics = await this.fetchUserMetrics();

    return {
      tweetCount: metrics.tweet_count,
      followersCount: metrics.followers_count,
      followingCount: metrics.following_count,
    };
  }

  private async fetchUserMetrics(): Promise<PublicMetrics> {
    const response = await axios.get<UsersResponse>(
      `/users/by/username/${this.userName}?user.fields=public_metrics`
    );
    return response.data.data.public_metrics;
  }
}
