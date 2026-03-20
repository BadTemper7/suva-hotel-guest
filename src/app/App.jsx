// src/app/App.jsx
import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes.jsx";
import { useGuestStore } from "../stores/guestStore.js";

export default function App() {
  const element = useRoutes(routes);
  const { initialize, isAuthenticated, currentGuest } = useGuestStore();

  useEffect(() => {
    // Initialize guest store on app load
    initialize();
  }, [initialize]);

  // Optional: Log authentication status for debugging
  useEffect(() => {
    console.log("App auth status:", { isAuthenticated, currentGuest });
  }, [isAuthenticated, currentGuest]);

  return <>{element}</>;
}
