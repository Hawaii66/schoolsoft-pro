"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Slider } from "@/components/shadcn/ui/slider";
import Day from "@/components/utils/schedule/day";
import { Class, Lecture, WeekDay } from "@/intefaces/School";
import React, { useEffect, useState } from "react";

const settings = {
  start: 8 * 60,
  end: 18 * 60,
  splits: 300,
};

const colors = [
  "bg-blue-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-lime-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-pink-500",
];

const days: WeekDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const getClasses = (lectures: Lecture[]) => {
  const map = new Map<string, Class>();
  lectures.forEach((lectures) => {
    if (map.has(lectures.class.name)) {
      return;
    }
    map.set(lectures.class.name, lectures.class);
  });
  return Array.from(map).map((i) => i[1]);
};

function page() {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  const classes = getClasses(lectures);

  const getLectures = async () => {
    const result = await fetch("/api/user/schedule", {
      headers: {
        token: localStorage.getItem("token") || "",
      },
    });

    const lectures: Lecture[] = await result.json();

    setLectures(
      lectures.map((i) => ({
        ...i,
        class: {
          ...i.class,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      }))
    );
  };

  const setColor = (className: string, color: string) => {
    setLectures((lectures) =>
      lectures.map((lecture) => {
        if (lecture.class.name === className) {
          return { ...lecture, class: { ...lecture.class, color: color } };
        }
        return lecture;
      })
    );
  };

  useEffect(() => {
    getLectures();
  }, []);

  return (
    <div className="px-4 py-2 h-full">
      <div className="px-4 py-2 h-4/5 flex flex-row justify-evenly items-start">
        <div className="h-full flex flex-col">
          <h1 className="text-center font-bold text-2xl">Tid</h1>
          <div
            className={`flex flex-col justify-between items-center flex-grow`}
          >
            {Array.from({ length: (settings.end - settings.start) / 30 })
              .map((_, idx) => idx)
              .map((i) => (
                <div className="flex-grow flex justify-center items-center m-0 py-0 border w-full">
                  <p className=" px-2 font-extralight text-sm">
                    {(Math.floor((i * 30) / 60) + settings.start / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{((i * 30) % 60).toString().padEnd(2, "0")}
                  </p>
                </div>
              ))}
          </div>
        </div>
        {days
          .filter((day) => {
            const lecturesToday = lectures.filter((i) => i.weekday === day);
            if (lecturesToday.length === 0) return false;
            return true;
          })
          .map((day, idx) => {
            const lecturesToday = lectures.filter((i) => i.weekday === day);
            return (
              <Day
                padding={idx === 0 ? "pr-2" : undefined}
                day={day}
                lectures={lecturesToday}
                settings={settings}
              />
            );
          })}
      </div>
      <div className="w-1/5 px-4">
        {classes.map((schoolClass) => (
          <div className="grid grid-cols-2 w-full gap-4">
            <h1 className="">{schoolClass.name}</h1>
            <div className="flex flex-grow flex-row gap-4">
              {colors.map((c) => (
                <div
                  onClick={() => setColor(schoolClass.name, c)}
                  className={`rounded-full aspect-square h-4 ${c}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
