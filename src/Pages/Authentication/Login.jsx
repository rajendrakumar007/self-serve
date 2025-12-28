
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyCredentials, login, findUserByContact } from "../../utils/auth";

function Login() {
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "info", message: "" });

  const showToast = (type, message, ms = 2200) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  };

  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    const findOtpUser = async () => {
      const user = await findUserByContact(mobile);
      if (!user) {
        setError("No account found for this mobile number");
        return null;
      }
      return user;
    };
    // perform async lookup
    findOtpUser().then((u) => {
      if (!u) return;
      setError("");
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      showToast("info", `The OTP is : ${code}`, 10000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "email") {
      const emailPattern = /^[^@]+@[a-zA-Z0-9]+\.(com)$/;
      if (!emailPattern.test(email)) {
        setError("Enter a valid E-mail");
        return;
      }
      if (!password) {
        setError("Password is required");
        return;
      }

      // check credentials
      const user = await verifyCredentials(email.trim().toLowerCase(), password);
      if (!user) {
        setError("Invalid email or password");
        return;
      }

      // Successful email login — store profile too
      login("selfserve_auth_token", user);
      setShowSuccess(true);

      // Reset fields
      setEmail("");
      setPassword("");

      // Redirect after a short delay
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 1000);
    } else {
      // Mobile login
      if (!mobile) {
        setError("Mobile number is required");
        return;
      }
      if (!otpSent) {
        setError("Please send OTP first");
        return;
      }
      if (!otp) {
        setError("Enter the OTP");
        return;
      }
      if (!/^[0-9]{6}$/.test(otp)) {
        setError("OTP must be 6 digits");
        return;
      }
      if (otp !== generatedOtp) {
        setError("Invalid OTP");
        return;
      }
      // Successful mobile login — find user and store profile
      const mobileUser = await findUserByContact(mobile);
      if (!mobileUser) {
        setError("No user found for this mobile number");
        return;
      }
      login("selfserve_auth_token", mobileUser);
      setShowSuccess(true);

      // Reset fields
      setMobile("");
      setOtp("");
      setOtpSent(false);
      setGeneratedOtp("");

      // Redirect after a short delay
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-secondary bg-gradient-to-br from-secondary to-primaryDark text-textInverted flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-bgCard/95 backdrop-blur-sm rounded-card shadow-lg p-6 sm:p-8 border border-borderDefault relative">
        {/* Success card (small) */}
        {showSuccess && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] bg-success text-textInverted rounded-md shadow-md p-3 flex items-center justify-between">
            <span className="font-semibold">Login successful</span>
            <span className="text-xs opacity-80">Redirecting…</span>
          </div>
        )}
        {/* Toast for OTP/info/errors */}
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

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-textPrimary mb-6">Login</h2>

        {/* Toggle buttons */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 rounded-md transition ${
              mode === "email"
                ? "bg-primaryDark shadow-md text-textInverted"
                : "bg-bgMuted text-textPrimary hover:bg-primaryLight hover:text-textInverted"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
            onClick={() => setMode("email")}
          >
            Email
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-md transition ${
              mode === "mobile"
                ? "bg-primaryDark shadow-md text-textInverted"
                : "bg-bgMuted text-textPrimary hover:bg-primaryLight hover:text-textInverted"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
            onClick={() => setMode("mobile")}
          >
            Mobile
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {mode === "email" ? (
            <>
              <input
                type="text"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter Your Mobile Number"
                value={mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setMobile(value);
                }}
                maxLength={10}
                className="px-3 py-2 rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />

              {!otpSent && (
                <button
                  type="button"
                  className="py-2 rounded-md bg-success text-textInverted hover:bg-success/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              )}
              {otpSent && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setOtp(value);
                    }}
                    maxLength={6}
                    className="px-3 py-2 rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </>
              )}
            </>
          )}

          {error && <p className="text-danger text-sm">{error}</p>}

          {/* Login button */}
          <button
            type="submit"
            className="py-2 rounded-md bg-primary text-textInverted hover:bg-primaryDark transition transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          >
            Login
          </button>

          {/* Links */}
          <div className="flex justify-between text-sm mt-2">
            <Link to="/forgot-password" className="text-primaryLight hover:text-primary hover:underline">
              Forgot Password
            </Link>
            <Link to="/signup" className="text-primaryLight hover:text-primary hover:underline">
              New User
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
