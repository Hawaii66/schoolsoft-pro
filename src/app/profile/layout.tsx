"use client";

import { Avatar, AvatarFallback } from "@/components/shadcn/ui/avatar";
import { Separator } from "@/components/shadcn/ui/separator";
import Title from "@/components/utils/title";
import { UserContext } from "@/context/UserContext";
import { User } from "@/intefaces/User";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
  const [user, setUser] = useState<User | undefined>();
  const router = useRouter();

  const logout = async () => {};

  const singIn = async () => {
    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/auth");
      return;
    }

    const t = await fetch("/api/user", { headers: { token: token } });
    if (t.status === 200) {
      setUser(await t.json());
    }
  };

  useEffect(() => {
    singIn();
  }, []);

  if (user === undefined) {
    return <></>;
  }

  return (
    <UserContext.Provider
      value={{
        logout,
        user,
      }}
    >
      <div className="p-4 flex-grow">
        <div className="flex flex-row justify-between items-center">
          <Link href={"/profile"}>
            <Title>SchoolSoft Pro</Title>
          </Link>
          <Link href={"/profile/account"}>
            <Avatar>
              <AvatarFallback className="border-blue-500 font-bold text-blue-500 border-2 rounded-full p-2">
                {user.username
                  .split(" ")
                  .map((i) => i[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <Separator />
        {children}
      </div>
    </UserContext.Provider>
  );
}

export default layout;
