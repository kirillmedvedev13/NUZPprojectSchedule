import { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { AuthContext } from "./AuthContext";
import { rewriteURIForGET, useMutation } from "@apollo/client";
import { ReloginUser } from "./mutations";

function AuthProvider(props) {
  const [user, setUser] = useState("");
  const [token, setAccessToken] = useState("");
  const [reLogin, { data, error }] = useMutation(ReloginUser);
  const [cookies, setCookie, removeCookie] = useCookies(["token", ""]);

  const setToken = useCallback((accessToken) => {
    setAccessToken(accessToken);
    if (accessToken) {
      setCookie("token", accessToken);
    } else {
      removeCookie("token");
    }
  }, []);

  const logOut = useCallback(() => {
    setUser("");
    setToken("");
  }, [setToken]);

  const loadData = useCallback(async () => {
    const accessToken = cookies.token;
    setAccessToken(accessToken);
    if (accessToken) {
      let res = await reLogin({ variables: { accessToken } });
      return res.data.ReloginUser;
    } else {
      setToken("");
      return null;
    }
  }, [setToken]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      loadData,
      setUser,
      setToken,
      logOut,
    }),
    [user, token, loadData, setUser, setToken, logOut]
  );
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
