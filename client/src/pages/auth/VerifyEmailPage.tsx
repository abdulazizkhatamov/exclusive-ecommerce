import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import { postVerifyAccount } from "@/features/auth/reqests.ts";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import HeaderNavigation from "@/components/custom/header-navigation/HeaderNavigation.tsx";
import Footer from "@/components/custom/Footer.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";

const VerifyEmailPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const token = params.get("token");

  if (user) {
    navigate("/");
  }

  const mutation = useMutation(postVerifyAccount, {
    onSuccess: () => {
      console.log("Verification successful");
    },
    onError: () => {
      console.log("Verification failed");
    },
  });

  React.useEffect(() => {
    if (token) {
      mutation.mutate({ token });
    }
  }, [token]);

  return (
    <>
      <HeaderNavigation />
      <div className="max-w-md w-full my-40 mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <div className="relative flex flex-col items-center gap-4">
          {mutation.isLoading && (
            <div>
              <Loader className={"animate-spin h-10 w-10 mx-auto"} />
              <p className="text-[1rem] font-medium mt-2">
                Verifying your email...
              </p>
            </div>
          )}
          {mutation.isSuccess && (
            <div>
              <div className="bg-green-100 text-green-600 rounded-full p-3 inline-block mb-2">
                <CircleCheck className={"h-8 w-8"} />
              </div>
              <p className="text-[1rem] font-medium">
                🎉 Your email has been successfully verified!
              </p>
            </div>
          )}
          {mutation.isError && (
            <div>
              <div className="bg-red-100 text-red-600 rounded-full p-3 inline-block mb-2">
                <CircleX className={"h-8 w-8"} />
              </div>
              <p className="text-[1rem] font-medium">
                Verification failed. Please try again.
              </p>
            </div>
          )}
          {!token && (
            <div>
              <div className="bg-yellow-100 text-yellow-600 rounded-full p-3 inline-block mb-2">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9 9-4.03 9-9z"
                  ></path>
                </svg>
              </div>
              <p className="text-lg font-medium text-yellow-600">
                Token is missing. Please check the verification link.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VerifyEmailPage;
