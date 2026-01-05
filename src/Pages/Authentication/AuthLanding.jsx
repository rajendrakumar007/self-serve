import React from "react";
import { Link } from "react-router-dom";

const AuthLanding = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgBase dark:bg-secondary p-6">
      <div className="max-w-lg w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-textPrimary dark:text-textInverted">Welcome</h1>

        <div className="grid gap-4">
          <Link
            to="/login"
            className="py-6 rounded-lg bg-primary text-textInverted text-xl font-semibold hover:bg-primaryDark transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="py-6 rounded-lg bg-accent text-textInverted text-xl font-semibold hover:opacity-90 transition"
          >
            Sign Up
          </Link>

          <Link
            to="/forgot-password"
            className="py-6 rounded-lg bg-bgCard text-textPrimary text-xl font-semibold border border-borderDefault hover:bg-bgHover transition"
          >
            Forgot Password
          </Link>
        </div>

        <p className="text-textMuted mt-4">Select an action to continue</p>
      </div>
    </div>
  );
};

export default AuthLanding;
