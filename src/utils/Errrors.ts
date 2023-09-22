import { APIError } from "@/intefaces/Error";

export const Errors = {
  0: {
    title: "Error missing",
    description: "Error code cant be found",
  },
  1: {
    title: "Wrong credentials",
    description: "Wrong password or username",
  },
  2: {
    title: "No cookie",
    description: "No cookies found",
  },
  3: {
    title: "No token",
    description: "No token found",
  },
  4: {
    title: "Captcha behövs",
    description: "Kan inte logga in just nu",
  },
} as const satisfies APIError;
