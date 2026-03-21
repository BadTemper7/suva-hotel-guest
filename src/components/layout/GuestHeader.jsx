// src/components/layout/GuestHeader.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGuestStore } from "../../stores/guestStore.js";
import Logo from "./Logo.jsx";
import { isAuthed } from "../../app/auth.js";

export default function GuestHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, currentGuest, logoutGuest, loading } =
    useGuestStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/rooms", label: "Rooms" },
    { path: "/cottages", label: "Cottages" },
    { path: "/contact", label: "Contact" },
    { path: "/about", label: "About" },
  ];

  const handleLogout = async () => {
    await logoutGuest();
    setIsMenuOpen(false);
    navigate("/");
  };

  const getInitials = () => {
    if (!currentGuest) return "G";
    return `${currentGuest.firstName?.charAt(0) || ""}${
      currentGuest.lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getFullName = () => {
    if (!currentGuest) return "Guest";
    return `${currentGuest.firstName || ""} ${currentGuest.lastName || ""}`.trim();
  };

  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white/80 backdrop-blur-sm"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center md:grid md:grid-cols-3 py-4">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center group">
            <Logo
              compactMode={false}
              collapsed={false}
              showFullBrand={false}
              className="!flex-row !gap-3"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  text-sm font-medium transition-all duration-200
                  ${
                    location.pathname === item.path
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex justify-end items-center space-x-4">
            {loading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-100 transition-all duration-300">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    {getInitials()}
                  </div>
                  <span className="text-sm font-medium">{getFullName()}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {getFullName()}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                          {currentGuest?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Bookings
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all duration-300"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    px-4 py-2 text-sm font-medium transition-colors
                    ${
                      location.pathname === item.path
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 mb-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {getInitials()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            {getFullName()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {currentGuest?.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors mt-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm bg-blue-600 text-white rounded-lg text-center mt-2 hover:bg-blue-700 transition"
                    >
                      Book Now
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
