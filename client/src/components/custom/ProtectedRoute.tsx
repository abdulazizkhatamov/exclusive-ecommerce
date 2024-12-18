import React, {ReactNode} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user ? children : <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;
