// src/pages/guest/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGuestStore } from "../stores/guestStore";
import Logo from "../components/layout/Logo.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function GuestRegister() {
  const navigate = useNavigate();
  const {
    registerGuest,
    findGuestByEmail,
    upgradeToAccount,
    authLoading,
    authError,
    clearError,
    isAuthenticated,
  } = useGuestStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [existingGuest, setExistingGuest] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  // Password strength validation
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    spaces: false,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Validate password strength
  const validatePassword = (password) => {
    const errors = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      spaces: !/\s/.test(password),
    };
    setPasswordErrors(errors);
    return (
      errors.length && errors.uppercase && errors.specialChar && errors.spaces
    );
  };

  // Trim whitespace from string and check if empty
  const validateAndTrim = (value, fieldName) => {
    const trimmed = value?.trim();
    if (!trimmed) {
      return {
        isValid: false,
        error: `${fieldName} cannot be empty or only whitespace`,
      };
    }
    return { isValid: true, value: trimmed };
  };

  // Debounced email check
  useEffect(() => {
    const checkEmail = async () => {
      if (!formData.email || formData.email.length < 5) return;

      setIsCheckingEmail(true);
      try {
        const result = await findGuestByEmail(formData.email);
        if (result.exists && result.guest && !result.hasAccount) {
          // Existing walk-in guest without account
          setExistingGuest(result.guest);
        } else {
          setExistingGuest(null);
        }
      } catch (error) {
        console.error("Error checking email:", error);
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const timer = setTimeout(() => {
      checkEmail();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [formData.email, findGuestByEmail]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) clearError();
    if (message.text) setMessage({ type: "", text: "" });
    // Reset upgrade modal when email changes
    if (e.target.name === "email") {
      setShowUpgradeModal(false);
      setExistingGuest(null);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") {
      validatePassword(value);
    }
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    clearError();

    // Validate and trim first name
    const firstNameValidation = validateAndTrim(
      formData.firstName,
      "First name",
    );
    if (!firstNameValidation.isValid) {
      setMessage({ type: "error", text: firstNameValidation.error });
      setSubmitting(false);
      return;
    }

    // Validate and trim last name
    const lastNameValidation = validateAndTrim(formData.lastName, "Last name");
    if (!lastNameValidation.isValid) {
      setMessage({ type: "error", text: lastNameValidation.error });
      setSubmitting(false);
      return;
    }

    // Validate name fields (only letters and spaces, but no leading/trailing spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(firstNameValidation.value)) {
      setMessage({
        type: "error",
        text: "First name can only contain letters and spaces",
      });
      setSubmitting(false);
      return;
    }

    if (!nameRegex.test(lastNameValidation.value)) {
      setMessage({
        type: "error",
        text: "Last name can only contain letters and spaces",
      });
      setSubmitting(false);
      return;
    }

    // Validate contact number (no whitespace allowed)
    const contactTrimmed = formData.contactNumber?.trim();
    if (!contactTrimmed) {
      setMessage({ type: "error", text: "Contact number cannot be empty" });
      setSubmitting(false);
      return;
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(contactTrimmed)) {
      setMessage({
        type: "error",
        text: "Contact number must start with 09 and be 11 digits (no spaces)",
      });
      setSubmitting(false);
      return;
    }

    // Validate email
    const emailTrimmed = formData.email?.trim();
    if (!emailTrimmed) {
      setMessage({ type: "error", text: "Email cannot be empty" });
      setSubmitting(false);
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address",
      });
      setSubmitting(false);
      return;
    }

    // Check if this email belongs to an existing walk-in guest
    if (existingGuest) {
      // Show upgrade modal instead of creating new account
      setShowUpgradeModal(true);
      setSubmitting(false);
      return;
    }

    // Validate password
    const passwordTrimmed = formData.password?.trim();
    if (!passwordTrimmed) {
      setMessage({ type: "error", text: "Password cannot be empty" });
      setSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setSubmitting(false);
      return;
    }

    // Validate password strength
    const isValid = validatePassword(passwordTrimmed);
    if (!isValid) {
      setMessage({
        type: "error",
        text: "Password does not meet all requirements. Please check the requirements below.",
      });
      setSubmitting(false);
      return;
    }

    // No existing guest, proceed with normal registration
    const { confirmPassword, ...registerData } = formData;
    registerData.firstName = firstNameValidation.value;
    registerData.lastName = lastNameValidation.value;
    registerData.contactNumber = contactTrimmed;
    registerData.email = emailTrimmed;
    registerData.password = passwordTrimmed;

    const result = await registerGuest(registerData);

    if (result.success) {
      // Check if verification is required
      if (result.requiresVerification) {
        // Show verification success page instead of navigating to home
        setShowVerificationSuccess(true);
        setRegisteredEmail(emailTrimmed);
      } else {
        // Old flow - navigate to home
        navigate("/");
      }
    } else {
      setMessage({
        type: "error",
        text: result.error || "Registration failed",
      });
    }
    setSubmitting(false);
  };

  const handleUpgradeAccount = async () => {
    if (!existingGuest) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    // Validate password for upgrade
    const passwordTrimmed = formData.password?.trim();
    if (!passwordTrimmed) {
      setMessage({ type: "error", text: "Password cannot be empty" });
      setSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setSubmitting(false);
      return;
    }

    // Validate password strength
    const isValid = validatePassword(passwordTrimmed);
    if (!isValid) {
      setMessage({
        type: "error",
        text: "Password does not meet all requirements. Please check the requirements below.",
      });
      setSubmitting(false);
      return;
    }

    try {
      const result = await upgradeToAccount(
        existingGuest._id,
        formData.email.trim().toLowerCase(),
        passwordTrimmed,
      );

      if (result.success) {
        setShowUpgradeModal(false);
        navigate("/");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to upgrade account",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to upgrade account",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo
              compactMode={false}
              collapsed={false}
              showFullBrand={true}
              className="scale-110"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Suva's Place and start your journey
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Error Message */}
            {(message.text || authError) && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === "success" || (!message.text && authError)
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className={`h-5 w-5 ${
                        message.type === "success"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          message.type === "success"
                            ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        }
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{message.text || authError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Check Indicator */}
            {isCheckingEmail && formData.email && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Checking email availability...</span>
              </div>
            )}

            {/* Walk-in Guest Warning */}
            {existingGuest && !showUpgradeModal && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      This email is already associated with a walk-in guest:{" "}
                      <strong>
                        {existingGuest.firstName} {existingGuest.lastName}
                      </strong>
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      You can upgrade this existing profile to a registered
                      account by setting a password.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  existingGuest
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-300"
                }`}
                placeholder="you@example.com"
              />
            </div>

            {/* Contact Number Field */}
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contact Number *
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                required
                value={formData.contactNumber}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="09123456789"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 09XXXXXXXXX (11 digits, no spaces)
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handlePasswordInputChange}
                  className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="•••••••• (min. 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Requirements List */}
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Password Requirements:
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${passwordErrors.length ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span
                      className={`text-xs ${passwordErrors.length ? "text-green-600" : "text-gray-500"}`}
                    >
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${passwordErrors.uppercase ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span
                      className={`text-xs ${passwordErrors.uppercase ? "text-green-600" : "text-gray-500"}`}
                    >
                      At least 1 uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${passwordErrors.specialChar ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span
                      className={`text-xs ${passwordErrors.specialChar ? "text-green-600" : "text-gray-500"}`}
                    >
                      At least 1 special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${passwordErrors.spaces ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span
                      className={`text-xs ${passwordErrors.spaces ? "text-green-600" : "text-gray-500"}`}
                    >
                      No spaces allowed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || authLoading || isCheckingEmail}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {submitting || authLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {existingGuest
                    ? "Upgrading account..."
                    : "Creating account..."}
                </div>
              ) : existingGuest ? (
                "Upgrade to Account"
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-xs text-gray-500 leading-relaxed">
              By creating an account, you consent to the collection, use, and
              processing of your personal information in accordance with the
              Philippines Data Privacy Act of 2012 (RA 10173){" "}
              <a
                href="https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-2"
              >
                (view law)
              </a>{" "}
              and our{" "}
              <Link
                to="/privacy"
                className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              . You also agree to our{" "}
              <Link
                to="/terms"
                className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-2"
              >
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Upgrade Confirmation Modal */}
      <AnimatePresence>
        {showUpgradeModal && existingGuest && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                <div className="relative px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm" />
                      <div className="relative p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V6a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">
                        Upgrade Existing Profile
                      </h3>
                      <p className="text-sm text-white/80 mt-0.5">
                        Create an account from your walk-in profile
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-sm text-gray-700">
                      An existing walk-in profile was found for{" "}
                      <strong className="text-blue-600">
                        {formData.email}
                      </strong>
                    </p>
                    <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Name:</span>{" "}
                        {existingGuest.firstName} {existingGuest.lastName}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-medium text-gray-700">
                          Contact:
                        </span>{" "}
                        {existingGuest.contactNumber}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      By upgrading, you'll be able to log in with your email and
                      password, and all your past and future reservations will
                      be linked to this account.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 h-11 px-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpgradeAccount}
                    disabled={submitting}
                    className="flex-1 h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Upgrading...
                      </div>
                    ) : (
                      "Upgrade Account"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showVerificationSuccess && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
          >
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600" />
              <div className="relative px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm" />
                    <div className="relative p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      Check Your Email
                    </h3>
                    <p className="text-sm text-white/80 mt-0.5">
                      Verification link sent
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Verify Your Email Address
                </h4>
                <p className="text-gray-600">
                  We've sent a verification email to{" "}
                  <strong className="text-green-600">{registeredEmail}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please check your inbox and click the verification link to
                  activate your account.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">What's next?</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Open your email inbox</li>
                      <li>Click the "Activate My Account" button</li>
                      <li>Login to your account</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="flex-1 h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium transition-all duration-200"
                >
                  Go to Login
                </button>
                <button
                  type="button"
                  onClick={() => setShowVerificationSuccess(false)}
                  className="flex-1 h-11 px-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
