import React, { useState, useEffect } from "react";
import { useNavigate /*, Link */ } from "react-router-dom";
import {
  getResetToken,
  clearResetFlow,
  updateUserById,
} from "../../utils/auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Error states (mirroring SignUp style: passwordError + general error)
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [toast, setToast] = useState({ show: false, type: "info", message: "" });

  const showToast = (type, message, ms = 2200) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  };

  useEffect(() => {
    const t = getResetToken();
    if (!t) {
      navigate("/forgot", { replace: true });
      return;
    }
    setToken(t);
  }, [navigate]);

  // === Same validation as SignUp page ===
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
    <div className="min-h-screen bg-secondary bg-gradient-to-br from-secondary to-primaryDark text-textInverted flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-bgCard/95 backdrop-blur-sm rounded-card shadow-lg p-6 sm:p-8 border border-borderDefault relative">
        {/* success/error toast */}
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

        <h2 className="mb-6 text-center text-2xl font-bold text-textPrimary">Reset Password</h2>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <input
            type="password"
            className="mb-2 px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />

          <input
            type="password"
            className="mb-2 px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
          />

          {/* Inline helper (optional): explain the rule like SignUp */}
          

          {/* Error messages (matching SignUp style) */}
          {passwordError && (
            <p className="text-danger mt-1 text-sm text-center">{passwordError}</p>
          )}
          {error && (
            <p className="text-danger mt-1 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="mt-2 px-4 py-3 text-base rounded-md bg-primary text-textInverted transition hover:bg-primaryDark hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          >
            Update Password
          </button>
        </form>

        {/* If you want a back link, uncomment: */}
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
};

export default ResetPassword;