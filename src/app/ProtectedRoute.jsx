// src/app/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthed } from "./auth.js";

export default function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthed()) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}
