// src/pages/guest/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGuestStore } from "../stores/guestStore";

export default function GuestProfile() {
  const navigate = useNavigate();
  const loc = useLocation();
  const {
    currentGuest,
    isAuthenticated,
    updateGuest,
    changePassword,
    authLoading,
    error,
    clearError,
    initialize,
  } = useGuestStore();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    spaces: false,
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: `${loc.pathname}${loc.search}` },
      });
      return;
    }

    if (currentGuest) {
      setProfileForm({
        firstName: currentGuest.firstName || "",
        lastName: currentGuest.lastName || "",
        contactNumber: currentGuest.contactNumber || "",
        email: currentGuest.email || "",
      });
    }
  }, [currentGuest, isAuthenticated, navigate, loc.pathname, loc.search]);

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    clearError();

    // Validate and trim first name
    const firstNameValidation = validateAndTrim(
      profileForm.firstName,
      "First name",
    );
    if (!firstNameValidation.isValid) {
      setMessage({ type: "error", text: firstNameValidation.error });
      setSubmitting(false);
      return;
    }

    // Validate and trim last name
    const lastNameValidation = validateAndTrim(
      profileForm.lastName,
      "Last name",
    );
    if (!lastNameValidation.isValid) {
      setMessage({ type: "error", text: lastNameValidation.error });
      setSubmitting(false);
      return;
    }

    // Validate contact number (no whitespace allowed)
    const contactTrimmed = profileForm.contactNumber?.trim();
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

    try {
      const updatedGuest = await updateGuest(currentGuest._id, {
        firstName: firstNameValidation.value,
        lastName: lastNameValidation.value,
        contactNumber: contactTrimmed,
      });

      if (updatedGuest) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update profile",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    clearError();

    // Trim passwords (remove whitespace)
    const newPasswordTrimmed = passwordForm.newPassword?.trim();
    const confirmPasswordTrimmed = passwordForm.confirmPassword?.trim();

    if (!newPasswordTrimmed) {
      setMessage({ type: "error", text: "New password cannot be empty" });
      setSubmitting(false);
      return;
    }

    if (!confirmPasswordTrimmed) {
      setMessage({ type: "error", text: "Please confirm your password" });
      setSubmitting(false);
      return;
    }

    if (newPasswordTrimmed !== confirmPasswordTrimmed) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setSubmitting(false);
      return;
    }

    // Validate password strength
    const isValid = validatePassword(newPasswordTrimmed);

    if (!isValid) {
      setMessage({
        type: "error",
        text: "Password does not meet all requirements. Please check the requirements below.",
      });
      setSubmitting(false);
      return;
    }

    try {
      const result = await changePassword(
        newPasswordTrimmed,
        confirmPasswordTrimmed,
      );

      if (result.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordForm({
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({
          length: false,
          uppercase: false,
          specialChar: false,
          spaces: false,
        });
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to change password",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    if (name === "newPassword") {
      validatePassword(value);
    }
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    if (message.text) setMessage({ type: "", text: "" });
  };

  if (!currentGuest) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => {
              setActiveTab("profile");
              setMessage({ type: "", text: "" });
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => {
              setActiveTab("password");
              setMessage({ type: "", text: "" });
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "password"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Error from store */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
            {error}
            <button
              onClick={() => clearError()}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Profile Information Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileForm.firstName}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileForm.lastName}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={profileForm.contactNumber}
                onChange={handleProfileChange}
                required
                pattern="^09\d{9}$"
                title="Must start with 09 and be 11 digits (no spaces)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="09123456789"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 09XXXXXXXXX (11 digits, no spaces)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profileForm.email}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email address cannot be changed. Contact support if you need to
                update it.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || authLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-100"
            >
              {submitting || authLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Updating...
                </div>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter new password"
              />

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your new password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || authLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-100"
            >
              {submitting || authLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Changing Password...
                </div>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        )}

        {/* Account Info Card */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Account Information
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              Account Type:{" "}
              {currentGuest.accountType === "registered"
                ? "Registered Guest"
                : "Walk-in Guest"}
            </p>
            <p>
              Member Since:{" "}
              {new Date(currentGuest.createdAt).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              Account Status:{" "}
              <span className="text-green-600 font-medium">Active</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
