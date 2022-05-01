import { createContext, useContext } from "react";
import IUser from "../interfaces/IUser";

export interface IAuthContext {
  user: IUser;
  onSignOut: () => void;
}

export const authContext = createContext<IAuthContext>({
  user: { email: "", password: "" },
  onSignOut: () => {},
});

export function useAuthContext() {
  return useContext(authContext);
}
