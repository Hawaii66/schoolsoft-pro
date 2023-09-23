"use client";

import React, { useEffect, useState } from "react";

const colors = [
  "bg-red-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-yellow-500",
];

type Lecture = {
  start: number;
  end: number;
  color: number;
};

const lectures: Lecture[] = [
  {
    color: 0,
    start: 8 * 60 + 30,
    end: 9 * 60 + 20,
  },
  {
    color: 1,
    start: 10 * 60 + 10,
    end: 10 * 60 + 50,
  },
  {
    color: 4,
    start: 13 * 60 + 30,
    end: 15 * 60 + 50,
  },
  {
    color: 3,
    start: 12 * 60 + 30,
    end: 15 * 60 + 0,
  },
  {
    color: 2,
    start: 8 * 60 + 30,
    end: 16 * 60 + 0,
  },
];

const overlapping = (lectures: Lecture[]) => {
  var max = 0;
  var lecturesOnTime: number[] = Array.from({ length: 17 * 60 }).map((_) => 0);

  for (var time = 0; time < 17 * 60; time += 1) {
    lectures.forEach((lecture) => {
      if (lecture.start <= time && lecture.end >= time) {
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

const settings = {
  start: 8 * 60,
  end: 17 * 60,
  splits: 500,
};

const range = settings.end - settings.start;

const toPercent = (time: number, sett: typeof settings) => {
  const zeroStart = time - sett.start;
  const percent = zeroStart / range;
  return percent;
};

const toSplit = (time: number, sett: typeof settings) => {
  return toPercent(time, sett) * settings.splits;
};

function page() {
  const [maxOverlapp, setMaxOverlap] = useState(0);

  const test = async () => {
    const result = await fetch("/api/user/schedule", {
      headers: {
        token: localStorage.getItem("token") || "",
      },
    });

    console.log(await result.json());
  };

  useEffect(() => {
    test();
  }, []);

  useEffect(() => {
    setMaxOverlap(overlapping(lectures));
  }, [...lectures]);

  return (
    <div className="px-4 py-2 h-1/2">
      <div
        className={`w-[1/2] h-full bg-blue-300 grid grid-rows-[repeat(${settings.splits},1fr)] grid-cols-${maxOverlapp}`}
      >
        {lectures.map((lecture) => (
          <div
            key={`${lecture.start}-${lecture.end}-${lecture.color}`}
            className={`${colors[lecture.color]} w-full`}
            style={{
              gridRowStart: Math.floor(toSplit(lecture.start, settings)),
              gridRowEnd: Math.floor(toSplit(lecture.end, settings)),
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default page;
