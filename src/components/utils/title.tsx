import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: "h1" | "h2";
}

function Title({ children, className, variant = "h1" }: Props) {
  return (
    <h1
      className={cn(
        "font-extrabold ",
        variant === "h1" ? "text-6xl text-blue-500" : "text-4xl ",
        className
      )}
    >
      {children}
    </h1>
  );
}

export default Title;
