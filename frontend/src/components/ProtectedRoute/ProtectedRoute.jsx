import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

import { Loading } from "@/components/common/Loading/Loading.jsx";

export function ProtectedRoute({ roles }) {
  const { user, token, loading } = useSelector((state) => state.auth);

  if (!user && (loading || token)) {
    return <Loading/>;
  }

  if (!roles?.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet/>;
}