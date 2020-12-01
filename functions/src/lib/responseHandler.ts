import * as functions from "firebase-functions";

export const responseHandler = async (
  request: functions.Request,
  response: functions.Response,
  client: ApiClientConstructor
): Promise<void> => {
  if (!request.query.user) {
    response.status(400).send("Bad request. user parameter is required");
    return;
  }
  try {
    const index = await new client(request.query.user as string).fetchIndex();
    response.status(200).send(index);
  } catch (_e) {
    response.status(400).send("Bad request");
  }
};
