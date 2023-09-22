import { NextRequest } from "next/server";

export const GetToken = (request: NextRequest): string | undefined => {
  const token = request.headers.get("token");
  return token ? token : undefined;
};
