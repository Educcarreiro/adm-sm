import { Outlet } from "react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";

export function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </LanguageProvider>
  );
}
