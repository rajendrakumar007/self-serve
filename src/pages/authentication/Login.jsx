import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  verifyCredentials,
  login,
  findUserByContact,
} from "../../utils/auth/auth";
import { FaShieldAlt, FaBullhorn, FaTools, FaFileAlt } from "react-icons/fa";
import insurance from "../../assets/insurance.png";
import RedirectingPanel from "../../components/common/RedirectingPanel";
import axiosClient from "../../services/axiosClient";
import { adminLogin } from "../../utils/auth/auth";

function Login() {
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");

  // redirecting state
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);

  const showToast = (type, message, ms = 2200) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  };

  useEffect(() => {
    // Cleanup any pending timers if component unmounts
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

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

    findOtpUser().then((u) => {
      if (!u) return;
      setError("");
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      showToast("info", `The OTP is : ${code}`, 10000);
    });
  };

  // check if entered email/password matches an admin in db.json
  async function isAdminCredential(email, password) {
    try {
      const res = await axiosClient.get("/admin"); // expects [{ email, password }, ...]
      const list = Array.isArray(res.data) ? res.data : [];
      return list.some(
        (a) =>
          String(a.email || "")
            .trim()
            .toLowerCase() ===
          String(email || "")
            .trim()
            .toLowerCase() &&
          String(a.password || "") === String(password || "")
      );
    } catch {
      // If /admin endpoint fails, treat as non-admin
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "email") {
      // (kept as-is) restricts to .com
      const emailPattern = /^[^@]+@[a-zA-Z0-9]+\.(com)$/;
      if (!emailPattern.test(email)) {
        setError("Enter a valid E-mail");
        return;
      }
      if (!password) {
        setError("Password is required");
        return;
      }

      // check if this is an admin credential
      const isAdmin = await isAdminCredential(email, password);
      if (isAdmin) {
        // Mark role for use across app (without changing styles/flow)

        adminLogin({ email });

        // Reset fields
        setEmail("");
        setPassword("");

        // Redirect with your animation
        setIsRedirecting(true);
        redirectTimerRef.current = setTimeout(() => {
          navigate("/admin/claims");
        }, 800);
        return; // stop normal user flow
      }
    

    // Otherwise, proceed with normal customer login flow
    const user = await verifyCredentials(
      email.trim().toLowerCase(),
      password
    );
    if (!user) {
      setError("Invalid email or password");
      return;
    }

    // Successful email (customer) login
    localStorage.setItem("selfserve_role", "customer"); // optional marker
    login("selfserve_auth_token", user);

    // Reset fields
    setEmail("");
    setPassword("");

    // Show redirecting animation and navigate
    setIsRedirecting(true);
    redirectTimerRef.current = setTimeout(() => {
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

  const mobileUser = await findUserByContact(mobile);
  if (!mobileUser) {
    setError("No user found for this mobile number");
    return;
  }

  login("selfserve_auth_token", mobileUser);

  // Reset fields
  setMobile("");
  setOtp("");
  setOtpSent(false);
  setGeneratedOtp("");

  // Show redirecting animation and navigate
  setIsRedirecting(true);
  redirectTimerRef.current = setTimeout(() => {
    navigate("/");
  }, 1500);
}
  };

return (
  <div className="min-h-screen w-full bg-bgBase dark:bg-secondary text-textPrimary dark:text-textInverted flex items-center justify-center p-4">
    {/* Shell */}
    <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl shadow-xl border border-borderDefault dark:border-borderStrong overflow-hidden bg-bgCard/70 dark:bg-secondary/80 backdrop-blur-sm">
      {/* LEFT: Form or Redirecting panel */}
      <div className="px-6 sm:px-8 py-8 bg-bgCard dark:bg-secondary min-h-[520px]">
        {/* Brand */}
        <div className="flex items-center gap-4 mb-8">
          <FaShieldAlt className="text-primary text-2xl" />
          <span
            onClick={() => navigate("/")}
            className="tracking-tight text-2xl font-extrabold text-textPrimary dark:text-textInverted cursor-pointer"
          >
            SELFSERVE
          </span>

          {/* Toast */}
          {toast.show && (
            <div
              className={`rounded-md shadow-md px-3 py-1.5 text-xs font-medium animate-slideDown ${toast.type === "success"
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

        {/* Conditional: show redirecting animation */}
        {isRedirecting ? (
          <RedirectingPanel />
        ) : (
          <>
            {/* Heading */}
            <h2 className="text-2xl font-bold text-textPrimary dark:text-textInverted mb-2">
              Log in to your account
            </h2>
            <p className="text-sm text-textMuted dark:text-textSecondary mb-6">
              Choose Email or Mobile to continue. We’ll keep your account
              secure.
            </p>

            {/* Toggle buttons */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                className={`flex-1 py-2 rounded-md transition ${mode === "email"
                    ? "bg-primary shadow-md text-textInverted"
                    : "bg-bgMuted dark:bg-secondary text-textPrimary dark:text-textInverted hover:bg-bgHover dark:hover:bg-secondary/80"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
                onClick={() => setMode("email")}
                disabled={isRedirecting}
              >
                Email
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md transition ${mode === "mobile"
                    ? "bg-primary shadow-md text-textInverted"
                    : "bg-bgMuted dark:bg-secondary text-textPrimary dark:text-textInverted hover:bg-bgHover dark:hover:bg-secondary/80"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
                onClick={() => setMode("mobile")}
                disabled={isRedirecting}
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
                    className="px-3 py-2 rounded-md bg-bgMuted dark:bg-secondary/70 text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight"
                    disabled={isRedirecting}
                  />
                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-3 py-2 rounded-md bg-bgMuted dark:bg-secondary/70 text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight"
                    disabled={isRedirecting}
                  />
                </>
              ) : (
                <>
                  {/* Mobile number with +91 capsule */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-2 rounded-md bg-bgMuted dark:bg-secondary text-textPrimary dark:text-textInverted border border-borderDefault dark:border-borderStrong select-none font-medium">
                      +91
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Your Mobile Number"
                      value={mobile}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setMobile(value);
                      }}
                      maxLength={10}
                      className="flex-1 px-4 py-2 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight transition"
                      disabled={isRedirecting}
                    />
                  </div>

                  {!otpSent && (
                    <button
                      type="button"
                      className="w-full py-2 rounded-md bg-primaryGradient text-textInverted font-semibold hover:scale-[1.02] shadow-md transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
                      onClick={handleSendOtp}
                      disabled={isRedirecting}
                    >
                      Send OTP
                    </button>
                  )}

                  {otpSent && (
                    <div className="mt-4 space-y-3">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setOtp(value);
                        }}
                        maxLength={6}
                        className="w-full px-4 py-2 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight text-center tracking-widest text-lg font-semibold transition"
                        disabled={isRedirecting}
                      />
                    </div>
                  )}
                </>
              )}

              {error && (
                <p className="text-danger dark:text-textInverted text-sm">
                  {error}
                </p>
              )}

              {/* Login button */}
              <button
                type="submit"
                className="py-2 rounded-md bg-primary text-textInverted hover:bg-primaryDark transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isRedirecting}
              >
                Login
              </button>

              {/* Links */}
              <div className="flex justify-between text-sm mt-2">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:text-primaryDark hover:underline"
                >
                  Forgot Password
                </Link>
                <Link
                  to="/signup"
                  className="text-primary hover:text-primaryDark hover:underline"
                >
                  New User
                </Link>
              </div>
            </form>
          </>
        )}
      </div>

      {/* RIGHT: Info panel — hidden on mobile */}
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
              <span className="text-xs text-textPrimary dark:text-textInverted">
                File a claim
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full grid place-items-center bg-bgCard dark:bg-secondary border border-borderDefault dark:border-borderStrong text-textPrimary dark:text-textInverted">
                <FaTools size={23} />
              </div>
              <span className="text-xs text-textPrimary dark:text-textInverted">
                Manage your policy
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full grid place-items-center bg-bgCard dark:bg-secondary border border-borderDefault dark:border-borderStrong text-textPrimary dark:text-textInverted">
                <FaFileAlt size={23} />
              </div>
              <span className="text-xs text-textPrimary dark:text-textInverted">
                View policy docs
              </span>
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

export default Login;
