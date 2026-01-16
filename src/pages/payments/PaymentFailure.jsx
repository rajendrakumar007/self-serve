import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function PaymentFailure() {
  const { state } = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
      <div className="bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl p-6 text-center max-w-md w-full">
        <h1 className="text-xl font-bold text-red-600">Payment Failed</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          {state?.reason || "Something went wrong. Please try again."}
        </p>
        <Link to="/payments" className="mt-4 inline-block text-primary underline">Back to Payment Details</Link>
      </div>
    </div>
  );
}
