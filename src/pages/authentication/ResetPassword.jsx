import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getResetToken,
  clearResetFlow,
  updateUserById,
} from "../../utils/auth/auth";
import { FaShieldAlt, FaBullhorn, FaTools, FaFileAlt } from "react-icons/fa";
import insurance from "../../assets/insurance.png";
 
const ResetPassword = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
 
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
 
  // Error states
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
 
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });
 
  const showToast = (type, message, ms = 2200) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  };
 
  useEffect(() => {
    const t = getResetToken();
    if (!t) {
      navigate("/forgot-password", { replace: true });
      return;
    }
    setToken(t);
  }, [navigate]);
 
  // Same validation as SignUp page
  const validatePassword = (pwd) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return pattern.test(pwd);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
 
    if (!token) {
      setError("Reset session expired. Please request again.");
      return;
    }
    if (!password) {
      setPasswordError("Please enter a new password");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be 8-15 chars with upper, lower, number & special char"
      );
      return;
    }
    if (password !== confirm) {
      setPasswordError("Passwords do not match");
      return;
    }
 
    const res = await updateUserById(token.userId, { password });
    if (!res.ok) {
      setError(res.message || "Unable to update password.");
      return;
    }
 
    showToast("success", "Password updated successfully");
    clearResetFlow();
 
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 4000);
  };
 
  return (
    <div className="min-h-screen w-full bg-bgBase dark:bg-secondary text-textPrimary dark:text-textInverted flex items-center justify-center p-4">
      {/* Shell (matches Login) */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl shadow-xl border border-borderDefault dark:border-borderStrong overflow-hidden bg-bgCard/70 dark:bg-secondary/80 backdrop-blur-sm">
 
        {/* LEFT: Form panel */}
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
 
            {/* success/error toast (inline like Login) */}
            {toast.show && (
              <div
                className={`rounded-md shadow-md px-3 py-1.5 text-xs font-medium animate-slideDown ${
                  toast.type === "success"
                    ? "bg-success text-textInverted"
                    : "bg-danger text-textInverted"
                }`}
                role="alert"
              >
                {toast.message}
              </div>
            )}
          </div>
 
          {/* Heading */}
          <h2 className="mb-2 text-2xl font-bold text-textPrimary dark:text-textInverted">
            Reset Password
          </h2>
          <p className="text-sm text-textMuted dark:text-textSecondary mb-6">
            Create a new password to secure your account.
          </p>
 
          {/* Form (unchanged logic) */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-3">
            <input
              type="password"
              className="px-4 py-3 text-sm rounded-md bg-bgMuted dark:bg-secondary/70 text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
 
            <input
              type="password"
              className="px-4 py-3 text-sm rounded-md bg-bgMuted dark:bg-secondary/70 text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
            />
 
            {/* Error messages */}
            {passwordError && (
              <p className="text-danger dark:text-textInverted text-sm">
                {passwordError}
              </p>
            )}
            {error && (
              <p className="text-danger dark:text-textInverted text-sm">
                {error}
              </p>
            )}
 
            <button
              type="submit"
              className="px-4 py-3 text-base rounded-md bg-primary text-textInverted transition hover:bg-primaryDark hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
            >
              Update Password
            </button>
 
            <div className="text-sm mt-2">
              <Link
                to="/login"
                className="text-primary hover:text-primaryDark hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
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
};
 
export default ResetPassword;
``