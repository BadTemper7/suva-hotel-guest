// src/app/routes.jsx
import React, { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute.jsx";
import GuestLayout from "../components/layout/GuestLayout.jsx";
import Loader from "../components/ui/Loader.jsx";
import NotFound from "../pages/NotFound.jsx";

// Guest Pages - Public (no authentication required)
const GuestHome = lazy(() => import("../pages/Home.jsx"));
const GuestRooms = lazy(() => import("../pages/Rooms.jsx"));
const GuestCottages = lazy(() => import("../pages/Cottages.jsx"));
const GuestContact = lazy(() => import("../pages/Contact.jsx"));
const GuestAbout = lazy(() => import("../pages/About.jsx"));
const GuestTerms = lazy(() => import("../pages/TermsConditions.jsx"));
const GuestPrivacy = lazy(() => import("../pages/Privacy.jsx"));
const GuestPolicy = lazy(() => import("../pages/GuestPolicy.jsx"));
const RoomPolicy = lazy(() => import("../pages/RoomPolicy.jsx"));
const GuestFAQ = lazy(() => import("../pages/FAQ.jsx"));
// const GuestGallery = lazy(() => import("../pages/Gallery.jsx"));

// Guest Pages - No Layout (auth pages without GuestLayout)
const GuestLogin = lazy(() => import("../pages/Login.jsx"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail.jsx"));
const GuestRegister = lazy(() => import("../pages/Register.jsx"));
const GuestForgotPassword = lazy(() => import("../pages/ForgotPassword.jsx"));
const GuestResetPassword = lazy(() => import("../pages/ResetPassword.jsx"));

// Guest Pages - Protected (require authentication)
const GuestProfile = lazy(() => import("../pages/Profile.jsx"));
const GuestBookings = lazy(() => import("../pages/Bookings.jsx"));
const GuestBookingProcess = lazy(
  () => import("../pages/ReservationProcess.jsx"),
);

const withLoader = (Component, label) => (
  <Suspense
    fallback={
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
        <Loader size={60} variant="primary" showText={true} text={label} />
      </div>
    }
  >
    <Component />
  </Suspense>
);

export default [
  // ==================== PUBLIC ROUTES WITH GUEST LAYOUT ====================
  // These routes use GuestLayout (header + footer)
  {
    element: <GuestLayout />,
    children: [
      { path: "/", element: withLoader(GuestHome, "Loading home...") },
      { path: "/rooms", element: withLoader(GuestRooms, "Loading rooms...") },
      {
        path: "/cottages",
        element: withLoader(GuestCottages, "Loading cottages..."),
      },
      {
        path: "/contact",
        element: withLoader(GuestContact, "Loading contact..."),
      },
      { path: "/about", element: withLoader(GuestAbout, "Loading about...") },
      { path: "/terms", element: withLoader(GuestTerms, "Loading terms...") },
      {
        path: "/privacy",
        element: withLoader(GuestPrivacy, "Loading privacy..."),
      },
      {
        path: "/guest-policy",
        element: withLoader(GuestPolicy, "Loading guest policy..."),
      },
      {
        path: "/room-policy",
        element: withLoader(RoomPolicy, "Loading room policy..."),
      },
      { path: "/faq", element: withLoader(GuestFAQ, "Loading FAQ...") },
    ],
  },

  { path: "/login", element: withLoader(GuestLogin, "Loading login...") },
  {
    path: "/register",
    element: withLoader(GuestRegister, "Loading register..."),
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: withLoader(GuestForgotPassword, "Loading..."),
  },
  {
    path: "/reset-password",
    element: withLoader(GuestResetPassword, "Loading..."),
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <GuestLayout />,
        children: [
          {
            path: "/profile",
            element: withLoader(GuestProfile, "Loading profile..."),
          },
          {
            path: "/bookings",
            element: withLoader(GuestBookings, "Loading bookings..."),
          },
          {
            path: "/booking-process",
            element: withLoader(
              GuestBookingProcess,
              "Loading booking process...",
            ),
          },
        ],
      },
    ],
  },

  // ==================== 404 NOT FOUND ====================
  { path: "*", element: withLoader(NotFound, "Loading...") },
];
