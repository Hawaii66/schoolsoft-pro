import { Lecture, ScheduleSettings, WeekDay } from "@/intefaces/School";
import { GetTime } from "@/utils/Functions";
import { FormatTime, WeekDayStringShort } from "@/utils/ToString";
import React, { useEffect, useState } from "react";

interface Props {
  lectures: Lecture[];
  settings: ScheduleSettings;
  day: WeekDay;
  padding?: "px-2" | "pl-2" | "pr-2";
}

const overlapping = (lectures: Lecture[]) => {
  var max = 0;
  var lecturesOnTime: number[] = Array.from({ length: 17 * 60 }).map((_) => 0);

  for (var time = 0; time < 17 * 60; time += 1) {
    lectures.forEach((lecture) => {
      if (lecture.start <= time && lecture.end > time) {
        lecturesOnTime[time] += 1;
      }
    });
  }

  lecturesOnTime.forEach((time) => {
    if (time > max) {
      max = time;
    }
  });

  return max;
};

function Day({ day, lectures, settings, padding = "px-2" }: Props) {
  const [maxOverlapp, setMaxOverlap] = useState(0);
  const [clock, setClock] = useState(0);
  const range = settings.end - settings.start;

  const toPercent = (time: number, sett: typeof settings) => {
    const zeroStart = time - sett.start;
    const percent = zeroStart / range;
    return percent;
  };

  const toSplit = (time: number, sett: typeof settings) => {
    return toPercent(time, sett) * settings.splits;
  };

  useEffect(() => {
    setMaxOverlap(overlapping(lectures));
  }, [lectures]);

  useEffect(() => {
    const t = setInterval(() => {
      const time = GetTime();
      console.log(time);
    }, 100);

    () => clearInterval(t);
  }, []);

  return (
    <div className={`flex-grow h-full flex flex-col ${padding}`}>
      <h1 className="text-center font-bold text-2xl">
        {WeekDayStringShort(day)}
      </h1>
      <div
        className={`flex-grow relative border grid grid-rows-[repeat(${settings.splits},1fr)] grid-cols-${maxOverlapp}`}
      >
        <div
          className="absolute left-0 right-0 h-1 bg-red-800 z-50"
          style={{
            top: `${
              ((settings.end - settings.start) * (clock * 100) +
                settings.start) /
              (settings.end - settings.start)
            }%`,
          }}
        ></div>
        {lectures.map((lecture) => (
          <div
            key={`${lecture.start}-${lecture.end}-${lecture.class.color}`}
            className={`w-full ${lecture.class.color}`}
            style={{
              gridRowStart: Math.floor(toSplit(lecture.start, settings)),
              gridRowEnd: Math.floor(toSplit(lecture.end, settings)),
              position: "relative",
            }}
          >
            <div
              onClick={() => alert("Show more info")}
              className="hover:cursor-pointer absolute top-0 right-0 bottom-0 left-0 overflow-y-auto text-center flex justify-center items-center flex-col"
            >
              <p className="font-bold text-sm">
                {lecture.class.name.charAt(0).toUpperCase()}
                {lecture.class.name.substring(1)}
              </p>
              <p className="text-sm">
                {FormatTime(lecture.start)} - {FormatTime(lecture.end)}
              </p>
              <p className="text-sm">{lecture.sal}</p>
            </div>
          </div>
        ))}
        <div
          key={``}
          className={`w-full`}
          style={{
            gridRowStart: Math.floor(toSplit(settings.end, settings)),
            gridRowEnd: Math.floor(toSplit(settings.end, settings)),
          }}
        />
      </div>
    </div>
  );
}

export default Day;
