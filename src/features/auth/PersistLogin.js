import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false); // React 18 Strict Mode. Only for development mode

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [
    refresh,
    {
      isUninitialized, // it means refresh has been not called yet
      isLoading,
      isSuccess, // isSuccess can be true before setCredentials (apiSlice) run (no metter dispatch from this component or inside aithApiSlice onQueryStarted) so we use one peace of local state 'trueSuccess' here
      isError,
      error,
    },
  ] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          //const response =
          await refresh();
          //const { accessToken } = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token && persist) verifyRefreshToken();
      // why do we verify when there is no token?
      // it happens when we refresh the page and the state is wiped. We don't have accessToken or any other state at that point
      // we need verify refreshToken and when we call verifyRefreshToken() it make request that send cookie back.
      // cookie contains our refreshToken and then it gives us access to all state buecause we get a new accessToken
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    // persist: no
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no. If we reload the page and the state with token is wiped. (403)
    console.log("loading");
    content = <p>Loading...</p>;
  } else if (isError) {
    //persist: yes, token: no. When our refreshToken expires and we get 403
    console.log("error");
    content = (
      <p className="errmsg">
        {error.data?.message} - <Link to="/login">Please login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
