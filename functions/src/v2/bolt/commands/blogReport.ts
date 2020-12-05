import { App } from "@slack/bolt";
import { DateTime } from "luxon";
import { db } from "../../lib/db";

const VIEW_ID = "report";

const findPreviousPost = async (userId: string) => {
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

export const useBlogReportCommand = (app: App) => {
  app.command("/report", async ({ ack, body, context, command }) => {
    await ack();

    // 過去投稿内容の取得
    const previousPost = await findPreviousPost(body.user_id);

    try {
      await app.client.views.open({
        token: context.botToken,
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          callback_id: VIEW_ID,
          title: {
            type: "plain_text",
            text: "📄 Blog Report",
          },
          blocks: [
            {
              type: "input",
              block_id: "twitter_block",
              optional: true,
              label: {
                type: "plain_text",
                text: "Twitter",
              },
              element: {
                type: "plain_text_input",
                action_id: "twitter_user",
                placeholder: {
                  type: "plain_text",
                  text: "twitterのユーザーID（@を除く)",
                },
                initial_value: previousPost.twitterUser || "",
              },
            },
            {
              type: "input",
              block_id: "qiita_block",
              optional: true,
              label: {
                type: "plain_text",
                text: "Qiita",
              },
              element: {
                type: "plain_text_input",
                action_id: "qiita_user",
                initial_value: previousPost.qiitaUser || "",
                placeholder: {
                  type: "plain_text",
                  text: "QiitaのユーザーID（@を除く)",
                },
              },
            },
            {
              type: "input",
              block_id: "zenn_block",
              optional: true,
              label: {
                type: "plain_text",
                text: "Zenn",
              },
              element: {
                type: "plain_text_input",
                action_id: "zenn_user",
                initial_value: previousPost.zennUser || "",
                placeholder: {
                  type: "plain_text",
                  text: "ZennのユーザーID",
                },
              },
            },
            {
              type: "input",
              block_id: "note_block",
              optional: true,
              label: {
                type: "plain_text",
                text: "note",
              },
              element: {
                type: "plain_text_input",
                action_id: "note_user",
                initial_value: previousPost.noteUser || "",
                placeholder: {
                  type: "plain_text",
                  text: "noteのユーザーID",
                },
              },
            },
            {
              type: "input",
              block_id: "comment_block",
              optional: true,
              label: {
                type: "plain_text",
                text: "コメント",
              },
              element: {
                type: "plain_text_input",
                action_id: "comment",
                multiline: true,
                placeholder: {
                  type: "plain_text",
                  text: "振り返り、投稿記事のリンク等",
                },
              },
            },
          ],
          private_metadata: command.channel_id,
          submit: {
            type: "plain_text",
            text: "投稿",
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

  app.view(VIEW_ID, async ({ ack, view, context, body }) => {
    await ack();
    const values = view.state.values;
    const channelId = view.private_metadata;

    const qiitaUser = values.qiita_block.qiita_user.value;
    const zennUser = values.zenn_block.zenn_user.value;
    const noteUser = values.note_block.note_user.value;
    const twitterUser = values.twitter_block.twitter_user.value;
    const comment = values.comment_block.comment.value;

    await db.collection("post-queue").add({
      userId: body.user.id,
      createdAt: DateTime.local()
        .setZone("Asia/Tokyo")
        .toFormat("yyyy/MM/dd HH:mm"),
      channelId,
      qiitaUser,
      zennUser,
      twitterUser,
      noteUser,
      comment,
    });
  });
};
