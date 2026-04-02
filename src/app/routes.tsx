import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Clients } from "./pages/Clients";
import { ClientDetail } from "./pages/ClientDetail";
import { ServiceDesk } from "./pages/ServiceDesk";
import { TicketDetail } from "./pages/TicketDetail";
import { Upsells } from "./pages/Upsells";
import { Users } from "./pages/Users";
import { Contracts } from "./pages/Contracts";
import { Pricing } from "./pages/Pricing";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <ProtectedLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/clients",
        element: <Clients />,
      },
      {
        path: "/clients/:id",
        element: <ClientDetail />,
      },
      {
        path: "/service-desk",
        element: <ServiceDesk />,
      },
      {
        path: "/service-desk/:id",
        element: <TicketDetail />,
      },
      {
        path: "/upsells",
        element: <Upsells />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/contracts",
        element: <Contracts />,
      },
      {
        path: "/settings",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);