import { User } from "@/intefaces/User";
import { ReturnError, TitleError } from "@/utils/ErrorUtils";
import { SchoolsoftFetch } from "@/utils/SchoolSoftFetch";
import { GetToken } from "@/utils/Token";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const token = GetToken(request);
  if (!token) return NextResponse.json(ReturnError("No token"));

  const result = await SchoolsoftFetch(
    "https://sms.schoolsoft.se/nykopingsenskilda/rest-api/session",
    token
  );

  if (result.status === 401) {
    console.log("return early");
    return NextResponse.json({}, { status: 401 });
  }

  const t = await result.json();

  const user: User = {
    email: t.user.email,
    username: `${t.user.firstName} ${t.user.lastName}`,
    school: {
      class: "",
      name: t.organization.name,
    },
  };

  return NextResponse.json(user);
};
