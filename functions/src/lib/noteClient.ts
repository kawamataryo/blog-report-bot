import axios from "axios";
import {
  NoteContent,
  NoteContentsResponse,
  NoteUserResponse,
} from "../types/noteTypes";

export class NoteClient implements ApiClient {
  private readonly BASE_URL = "https://note.com/api/v2";

  constructor(private userName: string) {
    axios.defaults.baseURL = this.BASE_URL;
  }

  async fetchIndex(): Promise<NoteIndex> {
    const user = await this.fetchUser();
    const contents = await this.fetchAllContent();

    return {
      postCount: user.noteCount ?? 0,
      likeCount: this.tallyUpLikeCount(contents),
      followerCount: user.followerCount ?? 0,
    };
  }

  private async fetchUser() {
    const response = await axios.get<NoteUserResponse>(
      `/creators/${this.userName}`
    );
    return response.data.data;
  }

  private async fetchAllContent() {
    let contents = [] as NoteContent[];
    let isLastPage = false;

    try {
      for (let page = 1; !isLastPage; page++) {
        const responseData = await this.fetchContents(page);
        isLastPage = responseData.isLastPage;
        contents = [...contents, ...responseData.contents];
      }
    } catch (e) {
      console.log(e);
    }

    return contents;
  }

  private async fetchContents(page: number) {
    const response = await axios.get<NoteContentsResponse>(
      `/creators/${this.userName}/contents?kind=note&page=${page}`
    );
    return response.data.data;
  }

  private tallyUpLikeCount(contents: NoteContent[]) {
    const likeCount = contents.reduce(
      (result, content) => result + content.likeCount,
      0
    );
    return likeCount;
  }
}
