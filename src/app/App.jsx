// src/app/App.jsx
import React from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

export default function App() {
  const element = useRoutes(routes);

  return (
    <>
      <ScrollToTop />
      {element}
    </>
  );
}
