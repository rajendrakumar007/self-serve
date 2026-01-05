
// src/Pages/Authentication/forgotpassword.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  startPasswordReset,
  verifyResetOtp,
  clearResetFlow,
} from "../../utils/auth";

function ForgotPassword() {
  const navigate = useNavigate();

  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // OTP states
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // UI states
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, type: "info", message: "" });
  const [showVerifiedBanner, setShowVerifiedBanner] = useState(false);
  const [showRedirectingBanner, setShowRedirectingBanner] = useState(false);

  const showToast = (type, message, ms = 8000) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePhone = (val) => /^[0-9]{10}$/.test(val);

  const resetOtpUi = () => {
    setIsOtpVerified(false);
    setOtp("");
    setGeneratedOtp("");
    setShowVerifiedBanner(false);
    setShowRedirectingBanner(false);
  };

  const handleSendReset = async (e) => {
    e.preventDefault();
    setError("");
    resetOtpUi();

    if (method === "email") {
      if (!email) return setError("Enter your email address.");
      if (!validateEmail(email)) return setError("Invalid email format.");

      const res = await startPasswordReset({ method: "email", value: email.trim() });
      if (!res.ok) return setError(res.message || "Unable to start reset.");

      // Show generated OTP (demo banner like SignUp)
      setGeneratedOtp(res.otp);
      showToast("info", `The OTP is : ${res.otp}`, 15000);
    } else {
      if (!phone) return setError("Enter your mobile number.");
      if (!validatePhone(phone)) return setError("Mobile number must be exactly 10 digits.");

      const res = await startPasswordReset({ method: "phone", value: phone.trim() });
      if (!res.ok) return setError(res.message || "Unable to start reset.");

      setGeneratedOtp(res.otp);
      showToast("info", `The OTP is : ${res.otp}`, 15000);
    }
  };

  const handleVerifyOtp = () => {
    if (!otp) return showToast("error", "Please enter the OTP first");
    if (!/^\d{6}$/.test(otp)) return showToast("error", "OTP must be 6 digits");

    // Verify against localStorage stored OTP (via startPasswordReset)
    const res = verifyResetOtp(otp);
    if (!res.ok) {
      return showToast("error", res.message || "Invalid OTP, please try again.");
    }

    setIsOtpVerified(true);

    // 1) Show "OTP successfully verified" banner briefly
    setShowVerifiedBanner(true);
    setTimeout(() => {
      setShowVerifiedBanner(false);
      // 2) Then show "Redirecting…" banner
      setShowRedirectingBanner(true);
      // 3) After a small delay, redirect to Reset Password page
      setTimeout(() => {
        setShowRedirectingBanner(false);
        navigate("/reset");
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-secondary bg-gradient-to-br from-secondary to-primaryDark text-textInverted flex justify-center items-center p-4">
      {/* Card */}
      <div className="w-full max-w-md bg-bgCard/95 backdrop-blur-sm rounded-card shadow-lg p-6 sm:p-8 border border-borderDefault relative">
        {/* Toast banner (OTP/info/error) */}
        {toast.show && (
          <div
            className={`absolute -top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] rounded-md shadow-md p-3 flex items-center justify-between ${
              toast.type === "success"
                ? "bg-success text-textInverted"
                : toast.type === "error"
                ? "bg-danger text-textInverted"
                : "bg-primary text-textInverted"
            }`}
          >
            <span className="font-semibold">{toast.message}</span>
            <span className="text-xs opacity-80">&nbsp;</span>
          </div>
        )}

        {/* Verified banner */}
        {showVerifiedBanner && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] bg-success text-textInverted rounded-md shadow-md p-3 flex items-center justify-between">
            <span className="font-semibold">OTP successfully verified</span>
            <span className="text-xs opacity-80">&nbsp;</span>
          </div>
        )}

        {/* Redirecting banner */}
        {showRedirectingBanner && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] bg-accent text-textInverted rounded-md shadow-md p-3 flex items-center justify-between">
            <span className="font-semibold">Redirecting to Reset Password…</span>
            <span className="text-xs opacity-80">&nbsp;</span>
          </div>
        )}

        <h2 className="text-center text-2xl font-semibold text-textPrimary mb-6">
          Forgot Password
        </h2>

        {/* Toggle buttons */}
        <div className="flex justify-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => {
              setMethod("email");
              clearResetFlow();
              setError("");
              resetOtpUi();
            }}
            className={`flex-1 px-4 py-2 rounded-md transition ${
              method === "email"
                ? "bg-primaryDark shadow-md text-textInverted"
                : "bg-bgMuted text-textPrimary hover:bg-primaryLight hover:text-textInverted"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod("phone");
              clearResetFlow();
              setError("");
              resetOtpUi();
            }}
            className={`flex-1 px-4 py-2 rounded-md transition ${
              method === "phone"
                ? "bg-primaryDark shadow-md text-textInverted"
                : "bg-bgMuted text-textPrimary hover:bg-primaryLight hover:text-textInverted"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
          >
            Mobile
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSendReset} className="flex flex-col" noValidate>
          {method === "email" ? (
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter your 10 digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                className="w-full p-3 mb-2 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </>
          )}

        {error && <p className="text-danger text-xs sm:text-sm mb-2 text-center">{error}</p>}

          <button
            type="submit"
            className="bg-primary hover:bg-primaryDark text-textInverted py-2.5 rounded-md font-semibold transition transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          >
            Send OTP
          </button>
        </form>

        {/* OTP input + verify (shown when OTP is generated) */}
        {generatedOtp && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="w-full p-3 mb-2 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-bgMuted disabled:text-textMuted"
              disabled={isOtpVerified}
            />
            {!isOtpVerified && (
              <button
                type="button"
                className="bg-accent text-textInverted py-2.5 rounded-md hover:bg-success text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight w-full"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            )}
          </div>
        )}

        {/* Link */}
        {/* <div className="mt-5 text-center">
          <Link
            to="/login"
            className="text-primaryLight transition-colors hover:text-primary hover:underline"
          >
            Back to Login
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default ForgotPassword;
