import { Icons } from "@/components/utils/icon";
import Title from "@/components/utils/title";
import React from "react";

function page() {
  return (
    <div>
      <div className="mt-4 gap-2 flex flex-row justify-start items-center">
        <Icons.user />
        <Title variant="h2">User</Title>
      </div>
    </div>
  );
}

export default page;
