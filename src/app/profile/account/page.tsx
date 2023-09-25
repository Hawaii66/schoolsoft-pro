"use client";

import { Button } from "@/components/shadcn/ui/button";
import { useToast } from "@/components/shadcn/ui/use-toast";
import { Icons } from "@/components/utils/icon";
import Title from "@/components/utils/title";
import { useRouter } from "next/navigation";
import React from "react";

function Page() {
  const router = useRouter();
  const { toast } = useToast();

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("password");
    localStorage.removeItem("username");

    router.push("/");
    toast({
      title: "Utloggad",
      description: "Du har blivit helt utloggad",
      variant: "default",
    });
  };

  return (
    <div>
      <div className="mt-4 gap-2 flex flex-row justify-start items-center">
        <Icons.user />
        <Title variant="h2">User</Title>
      </div>
      <Button variant={"destructive"} onClick={signOut}>
        Logga ut
      </Button>
    </div>
  );
}

export default Page;
