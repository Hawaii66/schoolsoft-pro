export type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Lecture = {
  start: number;
  end: number;
  class: Class;
  weekday: WeekDay;
  sal: string;
};

export type Class = {
  name: string;
  color: string;
  teacher: string;
};

export type ScheduleSettings = {
  start: number;
  end: number;
  splits: number;
};
