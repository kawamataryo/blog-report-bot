import * as functions from "firebase-functions";
import { REGION } from "../../lib/constants";
const config = functions.config();
import { App, ExpressReceiver } from "@slack/bolt";
import { useBlogReportCommand } from "./commands/blogReport";

const expressReceiver = new ExpressReceiver({
  signingSecret: config.slack.signin_secret,
  endpoints: "/events",
  processBeforeResponse: true,
});

const app = new App({
  receiver: expressReceiver,
  token: config.slack.bot_token,
  processBeforeResponse: true,
});

app.error(async (e) => {
  console.log(e);
});

useBlogReportCommand(app);

export const slack = functions
  .region(REGION)
  .https.onRequest(expressReceiver.app);
