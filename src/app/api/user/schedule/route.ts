import { ReturnError } from "@/utils/ErrorUtils";
import { SchoolsoftFetch } from "@/utils/SchoolSoftFetch";
import { GetToken } from "@/utils/Token";
import { NextRequest, NextResponse } from "next/server";
import { HTMLElement, parse } from "node-html-parser";

const nodeToInfo = (node: HTMLElement | null) => {
  const text = node?.text;
  if (text === undefined) return null;
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

export const GET = async (request: NextRequest) => {
  const token = GetToken(request);
  if (!token) return NextResponse.json(ReturnError("No token"));

  const result = await SchoolsoftFetch(
    "https://sms.schoolsoft.se/nykopingsenskilda/jsp/student/right_student_schedule.jsp",
    token
  );

  const text = await result.text();

  const tree = parse(text);
  console.log(
    tree
      .querySelector("#schedule_cont_content")
      ?.querySelector("table")
      ?.querySelectorAll(".schedulecell :not(.light)")
      .filter((i) => i.classNames !== "")
      .map((lecture) => lecture.querySelector("span"))
      .map(nodeToInfo)
  );

  return NextResponse.json({});
};
