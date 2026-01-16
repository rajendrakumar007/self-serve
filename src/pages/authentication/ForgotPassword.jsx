import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  startPasswordReset,
  verifyResetOtp,
  clearResetFlow,
} from "../../utils/auth/auth";
import { FaShieldAlt, FaBullhorn, FaTools, FaFileAlt } from "react-icons/fa";
import insurance from "../../assets/insurance.png";
 
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
 
    const res = verifyResetOtp(otp);
    if (!res.ok) {
      return showToast("error", res.message || "Invalid OTP, please try again.");
    }
 
    setIsOtpVerified(true);
 
    // 1) Show "OTP successfully verified"
    setShowVerifiedBanner(true);
    setTimeout(() => {
      setShowVerifiedBanner(false);
      // 2) Then show "Redirecting…"
      setShowRedirectingBanner(true);
      // 3) Redirect to /reset
      setTimeout(() => {
        setShowRedirectingBanner(false);
        navigate("/reset");
      }, 5000);
    }, 1500);
  };
 
  return (
    <div className="min-h-screen w-full bg-bgBase dark:bg-secondary text-textPrimary dark:text-textInverted flex items-center justify-center p-4">
      {/* Shell (matches Login) */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl shadow-xl border border-borderDefault dark:border-borderStrong overflow-hidden bg-bgCard/70 dark:bg-secondary/80 backdrop-blur-sm">
 
        {/* LEFT: Form panel (brand + content) */}
        <div className="px-6 sm:px-8 py-8 bg-bgCard dark:bg-secondary min-h-[520px]">
          {/* Brand header */}
          <div className="flex items-center gap-4 mb-8">
            <FaShieldAlt className="text-primary text-2xl" />
            <span
              onClick={() => navigate("/")}
              className="tracking-tight text-2xl font-extrabold text-textPrimary dark:text-textInverted cursor-pointer"
            >
              SELFSERVE
            </span>
 
            {/* Toast inline (like Login) */}
            {toast.show && (
              <div
                className={`rounded-md shadow-md px-3 py-1.5 text-xs font-medium animate-slideDown ${
                  toast.type === "success"
                    ? "bg-success text-textInverted"
                    : toast.type === "error"
                    ? "bg-danger text-textInverted"
                    : "bg-primary text-textInverted"
                }`}
                role="alert"
              >
                {toast.message}
              </div>
            )}
          </div>
 
          {/* Status banners (OTP verified / redirecting) */}
          {showVerifiedBanner && (
            <div className="mb-4 rounded-md bg-success text-textInverted px-3 py-2 text-sm font-semibold">
              OTP successfully verified
            </div>
          )}
          {showRedirectingBanner && (
            <div className="mb-4 rounded-md bg-primaryDark text-textInverted px-3 py-2 text-sm font-semibold">
              Redirecting to Reset Password…
            </div>
          )}
 
          {/* Heading & subtitle */}
          <h2 className="text-2xl font-bold text-textPrimary dark:text-textInverted mb-2">
            Forgot Password
          </h2>
          <p className="text-sm text-textMuted dark:text-textSecondary mb-6">
            Choose Email or Mobile to receive a one-time password (OTP).
          </p>
 
          {/* Toggle buttons (match Login styles) */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setMethod("email");
                clearResetFlow();
                setError("");
                resetOtpUi();
              }}
              className={`flex-1 py-2 rounded-md transition ${
                method === "email"
                  ? "bg-primary shadow-md text-textInverted"
                  : "bg-bgMuted dark:bg-secondary text-textPrimary dark:text-textInverted hover:bg-bgHover dark:hover:bg-secondary/80"
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
              className={`flex-1 py-2 rounded-md transition ${
                method === "phone"
                  ? "bg-primary shadow-md text-textInverted"
                  : "bg-bgMuted dark:bg-secondary text-textPrimary dark:text-textInverted hover:bg-bgHover dark:hover:bg-secondary/80"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
            >
              Mobile
            </button>
          </div>
 
          {/* Form (unchanged logic) */}
          <form onSubmit={handleSendReset} className="flex flex-col" noValidate>
            {method === "email" ? (
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mb-3 rounded-md bg-bgMuted dark:bg-secondary/70 text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight"
              />
            ) : (
              <>
                {/* +91 capsule + number (consistent with Login) */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-2 rounded-md bg-bgMuted dark:bg-secondary text-textPrimary dark:text-textInverted border border-borderDefault dark:border-borderStrong select-none font-medium">
                    +91
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your 10 digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    maxLength={10}
                    className="flex-1 px-4 py-3 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight transition"
                  />
                </div>
              </>
            )}
 
            {error && (
              <p className="text-danger dark:text-textInverted text-xs sm:text-sm mb-2">
                {error}
              </p>
            )}
 
            <button
              type="submit"
              className="bg-primary hover:bg-primaryDark text-textInverted py-2.5 rounded-md font-semibold transition transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
            >
              Send OTP
            </button>
            <br/>
            <Link to={"/profile"} className="text-primary dark:text-textInverted text-xs sm:text-sm mb-2">
                Back to Login
              </Link>
          </form>
 
          {/* OTP entry + verify (shown after OTP generated) */}
          {generatedOtp && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                className="w-full px-4 py-3 mb-2 rounded-md bg-bgMuted dark:bg-secondary/70 text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight disabled:bg-bgMuted dark:disabled:bg-secondary/60 disabled:text-textMuted dark:disabled:text-textSecondary text-center tracking-widest text-lg font-semibold"
                disabled={isOtpVerified}
              />
              {!isOtpVerified && (
                <button
                  type="button"
                  className="bg-primary text-textInverted py-2.5 rounded-md hover:bg-primaryDark text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight w-full"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              )}
            </div>
          )}
        </div>
 
        {/* RIGHT: Info panel — identical to Login */}
        <div className="relative bg-bgMuted dark:bg-secondary p-8 md:p-10 border-l border-borderDefault dark:border-borderStrong hidden md:block">
          <div className="mx-auto max-w-sm">
            <div className="mt-8 flex items-center justify-center gap-4 mb-8">
              <img src={insurance} alt="insurance" />
            </div>
 
            <h3 className="text-xl font-semibold text-textPrimary dark:text-textInverted text-center">
              Take control of your policy
            </h3>
            <p className="text-sm text-textMuted dark:text-textSecondary text-center mt-2">
              Inside your account you can:
            </p>
 
            {/* Features row */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full grid place-items-center bg-bgCard dark:bg-secondary border border-borderDefault dark:border-borderStrong text-textPrimary dark:text-textInverted">
                  <FaBullhorn size={23} />
                </div>
                <span className="text-xs text-textPrimary dark:text-textInverted">File a claim</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full grid place-items-center bg-bgCard dark:bg-secondary border border-borderDefault dark:border-borderStrong text-textPrimary dark:text-textInverted">
                  <FaTools size={23} />
                </div>
                <span className="text-xs text-textPrimary dark:text-textInverted">Manage your policy</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full grid place-items-center bg-bgCard dark:bg-secondary border border-borderDefault dark:border-borderStrong text-textPrimary dark:text-textInverted">
                  <FaFileAlt size={23} />
                </div>
                <span className="text-xs text-textPrimary dark:text-textInverted">View policy docs</span>
              </div>
            </div>
 
            {/* Footer note */}
            <div className="mt-10 text-center text-xs text-textMuted dark:text-textSecondary">
              Safe • Secure • Hassle-free
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default ForgotPassword;