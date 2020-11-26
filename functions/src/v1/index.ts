import * as functions from 'firebase-functions';
import {QiitaClient} from "../lib/qiitaClient";

export const qiita = functions.https.onRequest(async (_request, response) => {
  const index = await new QiitaClient('ryo2132').fetchKpi()
  response.send(index)
});
