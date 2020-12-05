import { db } from "./db";

export const findPreviousReport = async (userId: string) => {
  const previousReport = {
    postedAt: null,
    qiitaIndex: null,
    noteIndex: null,
    twitterIndex: null,
    zennIndex: null,
  };

  try {
    const snapShot = await db
      .collection("versions")
      .doc("v1")
      .collection("reports")
      .where("userId", "==", userId)
      .orderBy("postedAt", "desc")
      .limit(1)
      .get();

    snapShot.forEach((d) => {
      previousReport.postedAt = d.data().postedAt;
      previousReport.qiitaIndex = d.data().qiitaIndex;
      previousReport.noteIndex = d.data().noteIndex;
      previousReport.twitterIndex = d.data().twitterIndex;
      previousReport.zennIndex = d.data().zennIndex;
    });
  } catch (e) {
    console.error("get previous report error", e);
  }
  return previousReport;
};
