import { useRouter } from "next/navigation";

const apiFetchToken = async <T>(
  url: string,
  method: "GET" | "POST",
  token: string,
  data?: T
) => {
  if (method === "GET") {
    return await fetch(url, {
      method: "GET",
      headers: {
        token: token,
      },
    });
  } else {
    return await fetch(url, {
      method: "POST",
      headers: {
        token: token,
      },
      body: JSON.stringify(data),
    });
  }
};

export const useApiFetch = () => {
  const router = useRouter();

  const fetchSchoolSoft = async <T>(
    url: string,
    method: "GET" | "POST",
    body?: T
  ) => {
    var token = localStorage.getItem("token");

    var result = await apiFetchToken(url, method, token || "", body);

    if (result.status === 401) {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");

      const t = await fetch(`/api/auth`, {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (t.status === 500) {
        router.push("/auth");
        return undefined;
      }

      token = (await t.json()).token;
      if (token === null) {
        router.push("/auth");
        return undefined;
      }
      localStorage.setItem("token", token);

      result = await apiFetchToken(url, method, token || "", body);
    }

    return result;
  };

  return fetchSchoolSoft;
};
