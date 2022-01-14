import { createContext } from "react";

export const AuthContext = createContext({
  user: "",
  token: "",
  loadData: () => {},
  setUser: () => {},
  setToken: () => {},
  logOut: () => {},
});
