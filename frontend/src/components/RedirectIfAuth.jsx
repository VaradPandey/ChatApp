import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";

export function RedirectIfAuth({ children }) {
  const { user,loading }=useAuth();

  if (loading) return <LoadingSpinner></LoadingSpinner>;

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}
