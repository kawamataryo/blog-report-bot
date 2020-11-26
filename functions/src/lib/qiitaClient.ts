import axios from "axios";
import {Item, User} from "../types/qiitaTypes";

export class QiitaClient {
  private readonly BASE_URL = "https://qiita.com/api/v2";
  private readonly PER_PAGE = 100;

  constructor(private userName: string, private accessToken: string = '1df64276cf3c6b06f19a24b119b636254c80e152') {
    axios.defaults.baseURL = this.BASE_URL;
    axios.defaults.headers["Authorization"] = `Bearer ${this.accessToken}`
  }

  async fetchKpi() {
    const user = await this.fetchUser();
    const items = await this.fetchAllItems(user);
    const lgtmCount = this.tallyUpLgtmCount(items);
    const stockCount = await this.tallyUpStockCount(items);

    return {
      lgtmCount,
      stockCount,
      followersCount: user.followers_count,
      postCount: user.items_count,
    };
  }

  private async fetchUser() {
    const response = await axios.get<User>(`/users/${this.userName}`);
    return response.data
  }

  private async fetchAllItems(user: User) {
    // 最大ページ数
    const maxPage = Math.ceil(user.items_count / this.PER_PAGE);
    // 投稿一覧の取得
    let allItems = [] as Item[];
    await Promise.all(
        [...Array(maxPage).keys()].map(async i => {
          const items = await this.fetchItems(i + 1, this.PER_PAGE);
          allItems = [...allItems, ...items];
        })
    );
    return allItems;
  }

  private async fetchItems(page: number, perPage: number) {
    const response = await axios.get<Item[]>(`/authenticated_user/items?page=${page}&per_page=${perPage}`);
    return response.data;
  }

  private async fetchStockers(itemId: string) {
    const response = await axios.get<User[]>(`/items/${itemId}/stockers`);
    return response.data;
  }

  private tallyUpLgtmCount(items: Item[]) {
    const lgtmCount = items.reduce(
        (result, item) => result + item.likes_count,
        0
    );
    return lgtmCount;
  }

  private async tallyUpStockCount(items: Item[]) {
    let stockCount = 0;
    await Promise.all(
        items.map(async item => {
          const stockedUser = await this.fetchStockers(item.id);
          stockCount = stockCount + stockedUser.length;
        })
    );
    return stockCount;
  }
}
