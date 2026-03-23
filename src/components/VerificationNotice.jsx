// src/components/VerificationNotice.jsx
import React, { useState } from "react";
import { useGuestStore } from "../stores/guestStore";

const VerificationNotice = ({ email }) => {
  const { resendVerification, loading } = useGuestStore();
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");
    try {
      const result = await resendVerification(email);
      if (result.success) {
        setMessage("Verification email sent! Please check your inbox.");
        setTimeout(() => setMessage(""), 5000);
      } else {
        setMessage(result.error || "Failed to send verification email");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-amber-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-amber-800 mb-1">
            Email Not Verified
          </p>
          <p className="text-sm text-amber-700">
            Please verify your email address to activate your account. Check
            your inbox at <strong>{email}</strong> for the verification link.
          </p>
          {message && (
            <p
              className={`text-sm mt-2 font-medium ${
                message.includes("sent") ? "text-green-600" : "text-amber-700"
              }`}
            >
              {message}
            </p>
          )}
          <button
            onClick={handleResend}
            disabled={isResending}
            className="mt-2 text-sm font-medium text-amber-600 hover:text-amber-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
          >
            {isResending ? (
              <>
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
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationNotice;
