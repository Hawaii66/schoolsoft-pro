import { WeekDay, Lecture } from "@/intefaces/School";
import { ReturnError } from "@/utils/ErrorUtils";
import { SchoolsoftFetch } from "@/utils/SchoolSoftFetch";
import { GetToken } from "@/utils/Token";
import { NextRequest, NextResponse } from "next/server";
import { HTMLElement, parse } from "node-html-parser";

type NodeInfo = {
  name: string;
  start: number;
  end: number;
  sal: string;
  href: string;
  color: string;
};

const nodeToInfo = (node: HTMLElement | null): NodeInfo | undefined => {
  const text = node?.text;
  if (text === undefined) return undefined;
  return {
    ...textToInfo(text),
    color: node?.getAttribute("style")?.split(";")[0].split(":")[1] || "",
    href: node?.parentNode.getAttribute("href") || "",
  };
};

const textToInfo = (text: string) => {
  const splitted = text.replaceAll("\r", "").split("\n");

  const startText = splitted[1].split("-")[0].split(":");
  const start = parseInt(startText[0]) * 60 + parseInt(startText[1]);
  const endText = splitted[1].split("-")[1].split(":");
  const end = parseInt(endText[0]) * 60 + parseInt(endText[1]);
  return {
    name: splitted[0],
    start,
    end,
    sal: splitted[2],
  };
};

const isCleanLecture = (lecture: NodeInfo | undefined): lecture is NodeInfo => {
  return lecture !== undefined;
};

const GetMoreInfo = async (
  lecture: NodeInfo,
  token: string
): Promise<{ day: WeekDay; teacher: string }> => {
  const params = new URL(`http://what.com${lecture.href}`).searchParams;
  const parsedTest = `right_student_schedule_ajax.jsp?term=${params.get(
    "term"
  )}&lesson=${params.get("lesson")}&requestid=0`;
  const url = `https://sms.schoolsoft.se/nykopingsenskilda/jsp/student/${parsedTest}`;
  const result = await SchoolsoftFetch(url, token);

  const decoder = new TextDecoder("iso-8859-1");
  const text = decoder.decode(await result.arrayBuffer());

  const tree = parse(text);
  var info = tree.querySelector("#hiddenheader")?.text || "";

  const getTeacher = () => {
    const text = tree.querySelector("td")?.text || "";
    return text.split("\n")[0];
  };

  const getDay = () => {
    if (info.includes("mån")) return "mon";
    if (info.includes("tis")) return "tue";
    if (info.includes("ons")) return "wed";
    if (info.includes("tor")) return "thu";
    if (info.includes("fre")) return "fri";
    if (info.includes("lör")) return "sat";
    if (info.includes("sön")) return "sat";

    return "mon";
  };

  return {
    day: getDay(),
    teacher: getTeacher(),
  };
};

export const GET = async (request: NextRequest) => {
  const token = GetToken(request);
  if (!token) return NextResponse.json(ReturnError("No token"));

  const result = await SchoolsoftFetch(
    "https://sms.schoolsoft.se/nykopingsenskilda/jsp/student/right_student_schedule.jsp",
    token
  );

  const decoder = new TextDecoder("iso-8859-1");
  const text = decoder.decode(await result.arrayBuffer());

  const tree = parse(text);
  const allLectures = tree
    .querySelector("#schedule_cont_content")
    ?.querySelector("table")
    ?.querySelectorAll(".schedulecell :not(.light)")
    .filter((i) => i.classNames !== "")
    .map((lecture) => lecture.querySelector("span"))
    .map(nodeToInfo);

  const cleanLectures =
    allLectures?.filter(isCleanLecture).filter((i) => i.href !== "") || [];

  const promises: ReturnType<typeof GetMoreInfo>[] = [];
  cleanLectures.forEach((i) => promises.push(GetMoreInfo(i, token)));
  const moreInfo = await Promise.all(promises);

  const lectures: Lecture[] = cleanLectures.map((node, idx) => ({
    class: {
      color: node.color,
      name: node.name,
      teacher: moreInfo[idx].teacher,
    },
    end: node.end,
    sal: node.sal,
    start: node.start,
    weekday: moreInfo[idx].day,
  }));

  return NextResponse.json(lectures);
};
