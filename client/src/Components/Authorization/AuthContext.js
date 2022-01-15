import { createContext } from "react";

export const AuthContext = createContext({
  userId: "",
  userEmail: "",
  token: "",
  loadData: () => {},
  setUser: () => {},
  setToken: () => {},
  logOut: () => {},
});
