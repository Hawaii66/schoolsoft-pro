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

export const useApiFetch = async <T>(
  url: string,
  method: "GET" | "POST",
  body?: T
) => {
  const router = useRouter();
  var token = localStorage.getItem("token");

  var result = await apiFetchToken(url, method, token || "", body);

  if (result.status === 401) {
    const username = localStorage.get("username");
    const password = localStorage.get("password");

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

  const data = await result.json();

  return data;
};
