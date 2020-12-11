import { DateTime } from "luxon";

export const DATE_FORMAT = "yyyy/MM/dd HH:mm";
export const TIME_ZONE = "Asia/Tokyo";

export const currentDateTime = () => DateTime.local().setZone(TIME_ZONE);
export const currentDateTimeWithFormat = () =>
  DateTime.local().setZone(TIME_ZONE).toFormat(DATE_FORMAT);
