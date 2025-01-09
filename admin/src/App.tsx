import { useEffect, useState, Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/features/auth/auth-slice.ts";
import useAuthHttpClient from "@/hooks/use-auth.ts";
import { Loader } from "lucide-react";
import { router } from "@/router";

function App() {
  const dispatch = useDispatch();
  const authHttpClient = useAuthHttpClient();
  const [isLoading, setIsLoading] = useState(true);

  const getAdminDetails = () => {
    setIsLoading(true);
    authHttpClient
      .get("/api/admin")
      .then((res) => dispatch(setAdmin(res.data)))
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    let isMounted = true; // Flag to track component mount state

    // Avoid setting state after component unmounts
    if (isMounted) {
      getAdminDetails();
    }

    return () => {
      isMounted = false; // Cleanup: mark the component as unmounted
    };
  }, []); // This effect runs only once when the component mounts

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center">
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
