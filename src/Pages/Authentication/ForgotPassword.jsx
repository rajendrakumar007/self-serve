
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, type: "info", message: "" });

  const showToast = (type, message, ms = 2200) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (method === "email") {
      if (!email) {
        setError("Please enter your email address.");
        setEmail("");
        return;
      }
      if (!validateEmail(email)) {
        setError("Invalid email format.");
        setEmail("");
        return;
      }
      // show popup like signup/login
      showToast("success", `Password reset link sent to ${email}`);
      setEmail("");
    } else {
      if (!phone) {
        setError("Please enter your mobile number.");
        return;
      }
      if (!validatePhone(phone)) {
        setError("Invalid mobile number. Must be exactly 10 digits.");
        setPhone("");
        return;
      }
      showToast("success", `Password reset code sent to ${phone}`);
      setPhone("");
    }
  };

  return (
    <div className="min-h-screen bg-secondary bg-gradient-to-br from-secondary to-primaryDark text-textInverted flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-bgCard/95 backdrop-blur-sm rounded-card shadow-lg p-6 sm:p-8 border border-borderDefault">
        <h2 className="mb-6 text-center text-2xl font-bold text-textPrimary">Forgot Password</h2>

        {/* Toggle buttons */}
        <div className="flex justify-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => setMethod("email")}
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
            onClick={() => setMethod("phone")}
            className={`flex-1 px-4 py-2 rounded-md transition ${
              method === "phone"
                ? "bg-primaryDark shadow-md text-textInverted"
                : "bg-bgMuted text-textPrimary hover:bg-primaryLight hover:text-textInverted"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
          >
            Mobile
          </button>
        </div>

        {/* Disable native validation */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          {method === "email" ? (
            <>
              <input
                type="text"
                className="mb-4 px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {error && <p className="text-danger mt-1 text-sm text-center">{error}</p>}
            </>
          ) : (
            <>
              <input
                type="tel"
                className="mb-2 px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter your 10-digit mobile number"
                maxLength={10}
              />
              <small className="text-textMuted text-xs mb-2">Must be 10 digits</small>
              {error && <p className="text-danger mt-1 text-sm text-center">{error}</p>}
            </>
          )}

          <button
            type="submit"
            className="mt-2 px-4 py-3 text-base rounded-md bg-primary text-textInverted transition hover:bg-primaryDark hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          >
            Send Reset
          </button>
        </form>

        {/* toast popup */}
        {toast.show && (
          <div
            className={`absolute -top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] rounded-md shadow-md p-3 flex items-center justify-between ${
              toast.type === "success" ? "bg-success text-textInverted" : "bg-danger text-textInverted"
            }`}
          >
            <span className="font-semibold">{toast.message}</span>
            <span className="text-xs opacity-80">&nbsp;</span>
          </div>
        )}

        <div className="mt-5 text-center">
          <Link
            to="/login"
            className="text-primaryLight transition-colors hover:text-primary hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
