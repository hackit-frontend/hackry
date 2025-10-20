import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
    token: string | null;
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("authToken");
  console.log("ProtectedRoute token:", token);

  if (!token) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
