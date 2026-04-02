import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
}
