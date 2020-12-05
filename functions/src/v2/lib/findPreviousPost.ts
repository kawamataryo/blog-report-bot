import { db } from "./db";

export const findPreviousPost = async (userId: string) => {
  const previousPost = {
    qiitaUser: "",
    zennUser: "",
    twitterUser: "",
    noteUser: "",
  };

  try {
    const snapShot = await db
      .collection("post-queue")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    snapShot.forEach((d) => {
      previousPost.qiitaUser = d.data().qiitaUser;
      previousPost.zennUser = d.data().zennUser;
      previousPost.twitterUser = d.data().twitterUser;
      previousPost.noteUser = d.data().noteUser;
    });
  } catch (e) {
    console.error("get previous post error", e);
  }
  return previousPost;
};
