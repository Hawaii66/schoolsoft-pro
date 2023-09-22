import { ReturnError, TitleError, TitleToCode } from "@/utils/ErrorUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("action", "login");
  urlencoded.append("usertype", "1");
  urlencoded.append("ssusername", body.username);
  urlencoded.append("sspassword", body.password);
  urlencoded.append("button", "Logga in");

  var requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "manual",
  };

  const response = await fetch(
    "https://sms.schoolsoft.se/nykopingsenskilda/jsp/Login.jsp",
    requestOptions
  );

  try {
    const text = await response.text();
    const isWrong = text.includes("Varning");
    if (isWrong) {
      if (text.includes("vänligen bocka i rutan nedan också")) {
        throw new TitleError("Captcha behövs");
      }

      throw new TitleError("Wrong credentials");
    }

    const cookies = response.headers.get("set-cookie")?.split(";");
    if (cookies === undefined) {
      throw new TitleError("No cookie");
    }
    const ids = cookies
      .filter((i) => i.includes("JSESSIONID="))
      .map((i) => i.split("=")[i.split("=").length - 1]);
    if (ids === undefined || ids.length !== 1) {
      throw new TitleError("No token");
    }
    const sessionID = ids[0];
    return NextResponse.json({
      token: sessionID,
    });
  } catch (e: any) {
    return NextResponse.json({ ...ReturnError(e.message) }, { status: 500 });
  }
}
