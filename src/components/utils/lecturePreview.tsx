import { Lecture as LecturePreview } from "@/intefaces/School";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../shadcn/ui/sheet";
import { FormatTime, FormatTimeRange } from "@/utils/ToString";

interface Props {
  lecture: LecturePreview;
  children: React.ReactNode;
}

function LecturePreview({ children, lecture }: Props) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="underline-offset-4 underline font-bold">
            {lecture.class.name}
          </SheetTitle>
          <div
            className="h-4 w-full rounded-full"
            style={{ backgroundColor: lecture.class.color }}
          />
          <SheetDescription>
            {FormatTime(lecture.start)} - {FormatTime(lecture.end)} (
            {FormatTimeRange(lecture.start, lecture.end)})
          </SheetDescription>
          <SheetDescription>{lecture.sal}</SheetDescription>
          <SheetDescription>{lecture.class.teacher}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default LecturePreview;
