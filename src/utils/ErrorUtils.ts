import { Errors } from "./Errrors";

type Title = (typeof Errors)[keyof typeof Errors]["title"];

export const TitleToCode = (
  title: (typeof Errors)[keyof typeof Errors]["title"]
): keyof typeof Errors => {
  for (const [key, val] of Object.entries(Errors)) {
    console.log(val, title);
    if (val.title === title) {
      return parseInt(key) as any;
    }
  }

  return 0;
};

export const ReturnError = (identifier: keyof typeof Errors | Title) => {
  if (typeof identifier === "number") {
    return Errors[identifier];
  }

  return Errors[TitleToCode(identifier)];
};

export const ErrorTitle = (title: Title) => {
  return title;
};

export class TitleError extends Error {
  constructor(title: Title) {
    super(title);
  }
}
