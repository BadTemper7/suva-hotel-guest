// src/app/App.jsx
import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import { useGuestStore } from "../stores/guestStore.js";

export default function App() {
  const element = useRoutes(routes);
  const { initialize, isAuthenticated, currentGuest } = useGuestStore();

  useEffect(() => {
    // Initialize guest store on app load
    initialize();
  }, [initialize]);

  return (
    <>
      <ScrollToTop />
      {element}
    </>
  );
}
