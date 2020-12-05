import {
  NoteIndex,
  PreviousReport,
  QiitaIndex,
  TwitterIndex,
  ZennIndex,
} from "../../types/types";

export const createReportBlock = ({
  createdAt,
  zennUser,
  qiitaUser,
  noteUser,
  twitterUser,
  zennIndex,
  qiitaIndex,
  noteIndex,
  twitterIndex,
  comment,
  previousReport,
}: {
  createdAt: string;
  zennUser: string | null;
  qiitaUser: string | null;
  noteUser: string | null;
  twitterUser: string | null;
  zennIndex: ZennIndex | null;
  qiitaIndex: QiitaIndex | null;
  noteIndex: NoteIndex | null;
  twitterIndex: TwitterIndex | null;
  comment: string | null;
  previousReport: PreviousReport;
}) => {
  const block = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `\n :bar_chart: Report ${createdAt} ${
          previousReport.postedAt ? `(比較対象 ${previousReport.postedAt})` : ""
        }`,
      },
    },
    {
      type: "divider",
    },
  ];

  if (twitterUser && twitterIndex) {
    block.push(
      ...createTwitterIndexBlock(
        twitterUser,
        twitterIndex,
        previousReport.twitterIndex
      )
    );
  }
  if (qiitaUser && qiitaIndex) {
    block.push(
      ...createQiitaIndexBlock(qiitaUser, qiitaIndex, previousReport.qiitaIndex)
    );
  }
  if (zennUser && zennIndex) {
    block.push(
      ...createZennIndexBlock(zennUser, zennIndex, previousReport.zennIndex)
    );
  }
  if (noteUser && noteIndex) {
    block.push(
      ...createNoteIndexBlock(noteUser, noteIndex, previousReport.noteIndex)
    );
  }
  if (comment) {
    block.push(...createCommentBlock(comment));
  }

  return block;
};

const createQiitaIndexBlock = (
  user: string,
  index: QiitaIndex,
  previousIndex: QiitaIndex | null
) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `https://qiita.com/${user}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Qiita記事数:*\n${indexWithDifferent(
            index.postCount,
            previousIndex?.postCount
          )}`,
        },
        {
          type: "mrkdwn",
          text: `*Qiita LGTM数:*\n${indexWithDifferent(
            index.lgtmCount,
            previousIndex?.lgtmCount
          )}`,
        },
        {
          type: "mrkdwn",
          text: `*Qiita フォロワー数:*\n${indexWithDifferent(
            index.followerCount,
            previousIndex?.followerCount
          )}`,
        },
      ],
      accessory: {
        type: "image",
        image_url:
          "https://drive.google.com/uc?id=1bWoYzU4Jy0h3K_vpm84UcYPBGrxEVdgQ",
        alt_text: "qiita thumbnail",
      },
    },
    {
      type: "divider",
    },
  ];
};

const createZennIndexBlock = (
  user: string,
  index: ZennIndex,
  previousIndex: ZennIndex | null
) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `https://zenn.dev/${user}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Zenn 記事数:*\n${indexWithDifferent(
            index.postCount,
            previousIndex?.postCount
          )}`,
        },
        {
          type: "mrkdwn",
          text: `*Zenn LIKE数:*\n${indexWithDifferent(
            index.likeCount,
            previousIndex?.likeCount
          )}`,
        },
        {
          type: "mrkdwn",
          text: `*Zenn フォロワー数:*\n${indexWithDifferent(
            index.followerCount,
            previousIndex?.followerCount
          )}`,
        },
      ],
      accessory: {
        type: "image",
        image_url:
          "https://drive.google.com/uc?id=11WFXbNo0pB5-HnlqFDsfg7c01xCoPTMo",
        alt_text: "zenn thumbnail",
      },
    },
    {
      type: "divider",
    },
  ];
};

const createNoteIndexBlock = (
  user: string,
  index: NoteIndex,
  previousIndex: NoteIndex | null
) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `https://note.com/${user}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*note 記事数:*\n${indexWithDifferent(
            index.postCount,
            previousIndex?.postCount
          )}`,
        },
        {
          type: "mrkdwn",
          text: `*note Like数:*\n${indexWithDifferent(
            index.likeCount,
            previousIndex?.likeCount
          )}`,
        },
        {
          type: "mrkdwn",
          text: `*note フォロワー数:*\n${indexWithDifferent(
            index.followerCount,
            previousIndex?.followerCount
          )}`,
        },
      ],
      accessory: {
        type: "image",
        image_url:
          "https://drive.google.com/uc?id=1_R0p9YWUo3UsyjbyhzN6knKYYBnnJqJ1",
        alt_text: "note thumbnail",
      },
    },
    {
      type: "divider",
    },
  ];
};

const createTwitterIndexBlock = (
  user: string,
  index: TwitterIndex,
  previousIndex: TwitterIndex | null
) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `https://mobile.twitter.com/${user}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Twitterツイート数:*\n${indexWithDifferent(
            index.tweetCount,
            previousIndex?.tweetCount
          )}`,
        },
        {
          type: "mrkdwn",
          text: `*Twitterフォロー数:*\n${indexWithDifferent(
            index.followingCount,
            previousIndex?.followingCount
          )}`,
        },
        {
          type: "mrkdwn",
          text: `*Twitterフォロワー数:*\n${indexWithDifferent(
            index.followersCount,
            previousIndex?.followersCount
          )}`,
        },
      ],
      accessory: {
        type: "image",
        image_url:
          "https://drive.google.com/uc?id=1R5__uM39n1cCOnIODr20WkK66x2UszYb",
        alt_text: "twitter thumbnail",
      },
    },
    {
      type: "divider",
    },
  ];
};

const createCommentBlock = (comment: string) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `💬 *コメント*\n${comment}`,
      },
    },
    {
      type: "divider",
    },
  ];
};

const indexWithDifferent = (current: number, previous: number | undefined) => {
  return previous
    ? `${current} (${numWithSign(current - previous)})`
    : `${current}`;
};

const numWithSign = (num: number) => {
  return num >= 0 ? `+${num}` : num;
};
