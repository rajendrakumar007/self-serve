import React from "react";
import { AlertCircle, TrendingUp, CheckCircle2, Award } from "lucide-react";
import { formatCurrencyShort } from "../../store/claimsConstants";

/**
 * QuickStats Component - Displays claim statistics
 * Used in Dashboard and Track Claims pages
 */
export default function QuickStats({ stats, totalAmount, settledAmount, approved }) {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Active Claims */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white/95 dark:bg-gray-800/95 border border-blue-200 dark:border-gray-700 rounded-xl shadow-md">
        <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Active Claims</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {stats?.pending || 0}
          </p>
        </div>
      </div>

      {/* Total Claimed */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white/95 dark:bg-gray-800/95 border border-blue-200 dark:border-gray-700 rounded-xl shadow-md">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Claimed</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrencyShort(totalAmount || 0)}
          </p>
        </div>
      </div>

      {/* Settled Claims */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white/95 dark:bg-gray-800/95 border border-blue-200 dark:border-gray-700 rounded-xl shadow-md">
        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Settled</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrencyShort(settledAmount || 0)}
          </p>
        </div>
      </div>

      {/* Approved Claims */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white/95 dark:bg-gray-800/95 border border-blue-200 dark:border-gray-700 rounded-xl shadow-md">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Approved</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {/* {stats?.approved || 0} */}
            {approved || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
