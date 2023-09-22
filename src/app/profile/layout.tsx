"use client";

import { Avatar, AvatarFallback } from "@/components/shadcn/ui/avatar";
import { Separator } from "@/components/shadcn/ui/separator";
import Title from "@/components/utils/title";
import Link from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
  return (
    <div className="p-4">
      <div className="flex flex-row justify-between items-center">
        <Link href={"/profile"}>
          <Title>SchoolSoft Pro</Title>
        </Link>
        <Link href={"/profile/account"}>
          <Avatar>
            <AvatarFallback className="border-blue-500 font-bold text-blue-500 border-2 rounded-full p-2">
              SA
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <Separator />
      {children}
    </div>
  );
}

export default layout;
