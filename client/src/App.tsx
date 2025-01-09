import { RouterProvider } from "react-router-dom";

import { useDispatch } from "react-redux";
import useAuthHttpClient from "@/hooks/use-auth.ts";
import { setUser } from "@/features/auth/auth-slice.ts";
import { useEffect, useState } from "react";

import { Loader } from "lucide-react";
import { router } from "@/router";

function App() {
  const dispatch = useDispatch();
  const authHttpClient = useAuthHttpClient();

  const [isLoading, setIsLoading] = useState(true);

  const getUserDetail = () => {
    setIsLoading(true);
    authHttpClient
      .get("/api/user")
      .then((res) => dispatch(setUser(res.data)))
      .catch((e) => e)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getUserDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className={"w-screen h-screen items-center flex justify-center"}>
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
