// src/pages/guest/ForgotPassword.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGuestStore } from "../stores/guestStore";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { requestPasswordReset, loading } = useGuestStore();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(
          result.error || "Failed to send reset email. Please try again.",
        );
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-amber-800 mb-3">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-4">
              We've sent a password reset link to:
            </p>
            <p className="font-medium text-amber-700 mb-6 bg-amber-50 p-2 rounded-lg">
              {email}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please check your inbox and click the link to reset your password.
              The link will expire in 1 hour.
            </p>
            <div className="bg-blue-50 rounded-lg p-3 mb-6">
              <p className="text-xs text-blue-700">
                💡 Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  try again
                </button>
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block w-full py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl"
        >
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </div>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-600 hover:text-amber-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
