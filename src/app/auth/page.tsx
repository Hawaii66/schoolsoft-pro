"use client";

import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Separator } from "@/components/shadcn/ui/separator";
import { useToast } from "@/components/shadcn/ui/use-toast";
import { Icons } from "@/components/utils/icon";
import Title from "@/components/utils/title";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Page() {
  const router = useRouter();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = async () => {
    setLoading(true);

    const t = await fetch(`/api/auth`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (t.status === 500) {
      const error = await t.json();
      toast({
        description: `${error.description}. Try again in a few seconds`,
        title: error.title,
        variant: "destructive",
      });
    }

    const token = (await t.json()).token;

    localStorage.setItem("token", token);
    localStorage.setItem("password", password);
    localStorage.setItem("username", username);

    setLoading(false);

    router.back();
  };

  return (
    <div className="w-full h-screen flex-col flex justify-center items-center">
      <div className="w-1/3 flex justify-center items-center flex-col">
        <Title>SchoolSoft Pro</Title>
        <Separator className="my-2" />
        <p>Kan endast användas av elever i SchoolSoft</p>
      </div>
      <div className="flex gap-4 flex-col mt-4">
        <Input
          disabled={loading}
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          disabled={loading}
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant={loading ? "ghost" : "default"}
          onClick={auth}
          disabled={username.length < 3 || password.length < 3}
        >
          {loading ? <Icons.spinner className="animate-spin" /> : "Logga in"}
        </Button>
      </div>
    </div>
  );
}

export default Page;
