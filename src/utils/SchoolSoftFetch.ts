export const SchoolsoftFetch = async (url: string, token: string) => {
  const headers = new Headers();
  headers.append("cookie", `JSESSIONID=${token};`);

  return await fetch(url, {
    method: "GET",
    headers,
  });
};
