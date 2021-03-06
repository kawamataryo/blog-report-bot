import * as functions from "firebase-functions";
import axios from "axios";
import { QiitaItem, QiitaUser } from "../types/qiitaTypes";
import { ApiClient, QiitaIndex } from "../types/types";

export class QiitaClient implements ApiClient {
  private readonly BASE_URL = "https://qiita.com/api/v2";
  private readonly PER_PAGE = 100;

  constructor(private userName: string) {
    axios.defaults.baseURL = this.BASE_URL;
    axios.defaults.headers["Authorization"] = `Bearer ${
      functions.config().token.qiita
    }`;
  }

  async fetchIndex(): Promise<QiitaIndex> {
    const user = await this.fetchUser();
    const items = await this.fetchAllItems(user);
    const lgtmCount = this.tallyUpLgtmCount(items);

    return {
      postCount: user.items_count ?? 0,
      lgtmCount: lgtmCount,
      followerCount: user.followers_count ?? 0,
    };
  }

  private async fetchUser() {
    const response = await axios.get<QiitaUser>(`/users/${this.userName}`);
    return response.data;
  }

  private async fetchAllItems(user: QiitaUser | null) {
    if (!user) {
      return [];
    }
    // 最大ページ数
    const maxPage = Math.ceil(user.items_count / this.PER_PAGE);
    // 投稿一覧の取得
    let allItems = [] as QiitaItem[];
    await Promise.all(
      [...Array(maxPage).keys()].map(async (i) => {
        const items = await this.fetchItems(i + 1, this.PER_PAGE);
        allItems = [...allItems, ...items];
      })
    );
    return allItems;
  }

  private async fetchItems(page: number, perPage: number) {
    const response = await axios.get<QiitaItem[]>(
      `/items?page=${page}&per_page=${perPage}&query=user:${this.userName}`
    );
    return response.data;
  }

  private tallyUpLgtmCount(items: QiitaItem[]) {
    const lgtmCount = items.reduce(
      (result, item) => result + item.likes_count,
      0
    );
    return lgtmCount;
  }
}
