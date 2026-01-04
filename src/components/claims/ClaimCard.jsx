import React from "react";
import { FileText, Clock, Eye } from "lucide-react";
import {
  iconMap,
  statusStyles,
  policyLabels,
  formatCurrency,
  formatDate,
} from "../../store/claimsConstants";

export default function ClaimCard({ claim, onViewDetails }) {
  const Icon = iconMap[claim.policyType] || FileText;
  const statusStyle = statusStyles[claim.status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {claim.claimType}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {policyLabels[claim.policyType]}
            </p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
        >
          {claim.status}
        </span>
      </div>

      {/* Claim ID */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 dark:text-gray-400">Claim ID</p>
        <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
          {claim.id}
        </p>
      </div>

      {/* Amount */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Claimed Amount</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {formatCurrency(claim.claimAmount)}
          </p>
        </div>
        {claim.approvedAmount && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Approved Amount</p>
            <p className="text-base font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(claim.approvedAmount)}
            </p>
          </div>
        )}
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
        <Clock className="w-3.5 h-3.5" />
        <span>Submitted: {formatDate(claim.submissionDate)}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {claim.description}
      </p>

      {/* Action */}
      <button
        onClick={() => onViewDetails(claim)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>
    </div>
  );
}
