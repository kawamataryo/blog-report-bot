import * as functions from "firebase-functions";
import { QiitaClient } from "../lib/qiitaClient";
import { ZennClient } from "../lib/zennClient";
import { NoteClient } from "../lib/noteClient";
import { responseHandler } from "../lib/responseHandler";
import { TwitterClient } from "../lib/twitterClient";

const REGION = "asia-northeast1";

export const qiita = functions
  .region(REGION)
  .https.onRequest(async (request, response) => {
    await responseHandler(request, response, QiitaClient);
  });

export const zenn = functions
  .region(REGION)
  .https.onRequest(async (request, response) => {
    await responseHandler(request, response, ZennClient);
  });

export const note = functions
  .region(REGION)
  .https.onRequest(async (request, response) => {
    await responseHandler(request, response, NoteClient);
  });

export const twitter = functions
  .region(REGION)
  .https.onRequest(async (request, response) => {
    await responseHandler(request, response, TwitterClient);
  });
