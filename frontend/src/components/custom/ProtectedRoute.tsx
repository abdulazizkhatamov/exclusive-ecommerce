import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;
