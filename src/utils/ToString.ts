import { WeekDay } from "@/intefaces/School";

export const WeekDayString = (weekday: WeekDay) => {
  switch (weekday) {
    case "mon":
      return "Måndag";
    case "tue":
      return "Tisdag";
    case "wed":
      return "Onsdag";
    case "thu":
      return "Torsdag";
    case "fri":
      return "Fredag";
    case "sat":
      return "Lördag";
    case "sun":
      return "Söndag";
    default:
      const _: never = weekday;
      break;
  }
};

export const WeekDayStringShort = (weekday: WeekDay) => {
  return WeekDayString(weekday)?.substring(0, 3);
};

export const FormatTime = (time: number) => {
  return `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toString().padEnd(2, "0")}`;
};

export const FormatTimeRange = (start: number, end: number) => {
  return FormatTime(end - start);
};
