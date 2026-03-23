// src/components/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGuestStore } from "../stores/guestStore";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { verifyEmail, resendVerification, loading, authError } =
    useGuestStore();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [showResendForm, setShowResendForm] = useState(false);

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setStatus("no-token");
      setMessage("No verification token provided");
      setShowResendForm(true);
    }
  }, [token]);

  const handleVerification = async () => {
    try {
      const result = await verifyEmail(token);

      if (result.success) {
        setStatus("success");
        setMessage(result.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(result.error || "Verification failed");
        setShowResendForm(true);
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "An error occurred");
      setShowResendForm(true);
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;

    try {
      const result = await resendVerification(resendEmail);
      if (result.success) {
        setMessage("Verification email sent! Please check your inbox.");
        setStatus("resent");
      } else {
        setMessage(result.error || "Failed to resend verification");
      }
    } catch (error) {
      setMessage(error.message || "Failed to resend verification");
    }
  };

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-800">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-amber-800 mb-2">
            Email Verified!
          </h1>
          <p className="text-amber-700 mb-6">{message}</p>
          <p className="text-amber-600 mb-4">Redirecting to login...</p>
          <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "no-token" || (status === "error" && showResendForm)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-6xl mb-4 text-center">📧</div>
          <h1 className="text-2xl font-bold text-amber-800 mb-2 text-center">
            Verify Your Email
          </h1>
          <p className="text-amber-700 mb-6 text-center">
            {message ||
              "Please verify your email address to activate your account."}
          </p>

          <form onSubmit={handleResendVerification} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Resend Verification Email"}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-amber-600">
              Didn't receive the email? Check your spam folder.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="text-amber-600 hover:text-amber-700 text-sm"
            >
              Create a new account →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-amber-800 mb-2">
            Verification Failed
          </h1>
          <p className="text-amber-700 mb-6">{message}</p>
          <div className="space-y-3">
            <button
              onClick={() => setShowResendForm(true)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition"
            >
              Request New Verification Email
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full border border-amber-500 text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmail;
