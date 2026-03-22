// src/components/layout/GuestHeader.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGuestStore } from "../../stores/guestStore.js";
import Logo from "./Logo.jsx";

export default function GuestHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, currentGuest, logoutGuest, loading, initialize } =
    useGuestStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Initialize guest store on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src="/images/small-logo.png"
                  alt="Suva's Place Resort"
                  className="h-12 w-12 object-contain select-none transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                />
                {isHovered && (
                  <div className="absolute inset-0 -z-10 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200/30 to-rose-200/30 rounded-full blur-md"></div>
                  </div>
                )}
              </div>
              <div className="text-center mt-1">
                <h1 className="font-dancing text-xl font-bold text-amber-900 leading-none">
                  Suva's Place
                </h1>
                <p className="font-serif text-xs text-amber-700 mt-0.5">
                  Resort Antipolo
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-8">
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
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-100 transition-all duration-300">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    {getInitials()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {getFullName()}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-500"
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
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate">
                          {getFullName()}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {currentGuest?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/bookings"
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
                  className={`
                    px-4 py-2 text-sm font-medium transition-colors rounded-lg
                    ${
                      location.pathname === item.path
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-gray-100">
                {loading ? (
                  <div className="px-4 py-3">
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                ) : isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 mb-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {getInitials()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {getFullName()}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {currentGuest?.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 mt-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-all duration-300"
                    >
                      Book Now
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
