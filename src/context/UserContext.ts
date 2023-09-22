import { User } from "@/intefaces/User";
import { createContext } from "react";

interface IUserContext {
  user: User;
  logout: () => void;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);
