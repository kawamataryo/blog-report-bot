import { DateTime } from "luxon";

export const DATE_TIME_FORMAT = "yyyy/MM/dd HH:mm";
export const DATE_FORMAT = "yyyy/MM/dd";
export const TIME_ZONE = "Asia/Tokyo";

export const currentDateTime = () => DateTime.local().setZone(TIME_ZONE);

export const currentDateTimeWithFormat = () =>
  DateTime.local().setZone(TIME_ZONE).toFormat(DATE_TIME_FORMAT);

export const formattedDateTimeToFormattedDate = (datetime: string) => {
  const d = DateTime.fromFormat(datetime, DATE_TIME_FORMAT);
  return d.isValid ? d.toFormat(DATE_FORMAT) : datetime;
};
