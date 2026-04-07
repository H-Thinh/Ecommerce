import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Ho_Chi_Minh";

export const parseDateRange = (query: any) => {
  const { day, month, year } = query;

  let start: Date;
  let end: Date;

  if (day && month && year) {
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    const date = dayjs.tz(`${y}-${m}-${d}`, TZ);

    start = date.startOf("day").toDate();
    end = date.endOf("day").toDate();
  } else if (month && year) {
    const m = Number(month);
    const y = Number(year);

    const date = dayjs.tz(`${y}-${m}-01`, TZ);

    start = date.startOf("month").toDate();
    end = date.endOf("month").toDate();
  } else if (year) {
    const y = Number(year);

    const date = dayjs.tz(`${y}-01-01`, TZ);

    start = date.startOf("year").toDate();
    end = date.endOf("year").toDate();
  } else {
    throw new Error("Missing date parameters");
  }

  return { start, end };
};
