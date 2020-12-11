import { App } from "@slack/bolt";
import { db } from "../../lib/db";
import { findPreviousPost } from "../../lib/findPreviousPost";
import * as functions from "firebase-functions";
import { currentDateTimeWithFormat } from "../../lib/dateTime";

const VIEW_ID = "report";

const config = functions.config();

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
      await app.client.chat.postEphemeral({
        token: config.slack.bot_token,
        channel: body.channel_id,
        user: body.user.id,
        text:
          "⚠️ モーダルの表示に失敗しました。アプリ管理者にお問い合わせてください。",
      });
    }
  });

  app.view(VIEW_ID, async ({ ack, view, context, body }) => {
    await ack();
    const values = view.state.values;
    const channelId = view.private_metadata;
    const user = body.user;

    const qiitaUser = values.qiita_block.qiita_user.value;
    const zennUser = values.zenn_block.zenn_user.value;
    const noteUser = values.note_block.note_user.value;
    const twitterUser = values.twitter_block.twitter_user.value;
    const comment = values.comment_block.comment.value;

    // post-queueへの保存
    // post-queueへの保存をフックにFunctionsが起動して指標を集計、結果をPostする
    try {
      await db.collection("post-queue").add({
        userId: user.id,
        userName: user.name,
        createdAt: currentDateTimeWithFormat(),
        channelId,
        qiitaUser,
        zennUser,
        twitterUser,
        noteUser,
        comment,
      });
    } catch (e) {
      console.log(e);
      await app.client.chat.postEphemeral({
        token: config.slack.bot_token,
        channel: channelId,
        user: user.id,
        text:
          "⚠️ データの送信に失敗しました。アプリ管理者にお問い合わせてください。",
      });
    }
  });
};
