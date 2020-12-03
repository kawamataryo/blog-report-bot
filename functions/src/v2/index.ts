import * as Bolt from "./bolt/app";
import * as PostQueue from "./firestore/postQueue";

export const bolt = { ...Bolt };
export const firestore = { ...PostQueue };
