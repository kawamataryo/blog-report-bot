import { App } from "@slack/bolt";
import { QiitaClient } from "../../../lib/qiitaClient";
import { ZennClient } from "../../../lib/zennClient";
import { TwitterClient } from "../../../lib/twitterClient";
import { NoteClient } from "../../../lib/noteClient";

const VIEW_ID = "dialog_1";

export const useBlogReportCommand = (app: App) => {
  app.command("/blog-report", async ({ ack, body, context, command }) => {
    await ack();
    try {
      await app.client.views.open({
        token: context.botToken,
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          callback_id: VIEW_ID,
          title: {
            type: "plain_text",
            text: "blog一覧",
          },
          blocks: [
            {
              type: "input",
              block_id: "qiita_block",
              optional: true,
              label: {
                type: "plain_text",
                text: "qiita",
              },
              element: {
                type: "plain_text_input",
                action_id: "qiita_user",
              },
            },
            {
              type: "input",
              block_id: "zenn_block",
              optional: true,
              label: {
                type: "plain_text",
                text: "zenn",
              },
              element: {
                type: "plain_text_input",
                action_id: "zenn_user",
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
              },
            },
            {
              type: "input",
              block_id: "twitter_block",
              optional: true,
              label: {
                type: "plain_text",
                text: "twitter",
              },
              element: {
                type: "plain_text_input",
                action_id: "twitter_user",
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

    // 指標の取得
    const qiitaIndex = await new QiitaClient(qiitaUser).fetchIndex();
    const zennIndex = await new ZennClient(zennUser).fetchIndex();
    const noteIndex = await new NoteClient(noteUser).fetchIndex();
    const twitterIndex = await new TwitterClient(twitterUser).fetchIndex();

    // TODO: 投稿のblock形式への整形.
    const text = JSON.stringify({
      qiitaIndex,
      zennIndex,
      noteIndex,
      twitterIndex,
    });

    await app.client.chat.postMessage({
      token: context.botToken,
      channel: channelId,
      text: text,
    });
  });
};
