import React from "react";
import {
  X,
  FileText,
  MapPin,
  Calendar,
  Download,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  iconMap,
  statusStyles,
  policyLabels,
  timelineStages,
  irdaiTimelinesDetailed,
  formatCurrency,
  formatDate,
} from "../../store/claimsConstants";
import { generateDetailsPDF } from "../../utils/pdfGenerator";

export default function ClaimDetailModal({ claim, isOpen, onClose }) {
  if (!isOpen || !claim) return null;

  const Icon = iconMap[claim.policyType] || FileText;
  const statusConfig = statusStyles[claim.status] || statusStyles["Pending"];
  const StatusIcon = statusConfig.icon;

  const downloadSummary = () => {
    generateDetailsPDF(claim, formatDate, formatCurrency);
  };

  const activeStages = timelineStages.filter(
    (stage) => claim.timeline && claim.timeline[stage.key]
  );

  const getIrdaiTimeline = (policyType) => {
    const typeMap = {
      health: irdaiTimelinesDetailed.health,
      life: irdaiTimelinesDetailed.life,
      "motor-car": irdaiTimelinesDetailed["motor-car"],
      "motor-bike": irdaiTimelinesDetailed["motor-bike"],
      travel: irdaiTimelinesDetailed.travel,
      home: irdaiTimelinesDetailed.home,
    };
    return typeMap[policyType] || null;
  };

  const irdaiData = getIrdaiTimeline(claim.policyType);
  const submissionDate = claim.submissionDate
    ? new Date(claim.submissionDate)
    : new Date();
  const expectedSettlementDate = new Date(
    submissionDate.getTime() +
      (irdaiData?.settlementDays || 30) * 24 * 60 * 60 * 1000
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {claim.claimType} Claim
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {policyLabels[claim.policyType]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} mb-6`}
          >
            <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
            <span className={`text-sm font-medium ${statusConfig.text}`}>
              {claim.status}
            </span>
          </div>

          {/* Claim Info Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Claim ID</p>
              <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                {claim.id}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Policy ID</p>
              <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                {claim.policyId}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer ID</p>
              <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                {claim.customerId || "CUST-" + claim.id.split("-")[1]}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Claim Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {claim.status === "Settled"
                  ? claim.timeline?.submitted
                    ? formatDate(claim.timeline.submitted)
                    : formatDate(claim.submissionDate)
                  : "-"}
              </p>
            </div>
          </div>

          {/* Claimed Amount & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Claimed Amount</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(claim.claimAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <p
                className={`text-sm font-semibold ${
                  claim.status === "Settled"
                    ? "text-green-600 dark:text-green-400"
                    : claim.status === "Approved"
                    ? "text-blue-600 dark:text-blue-400"
                    : claim.status === "Under Review"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : claim.status === "Investigation"
                    ? "text-orange-600 dark:text-orange-400"
                    : claim.status === "Document Verification"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : claim.status === "Rejected"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {claim.status}
              </p>
            </div>
          </div>

          {/* Dates & Location */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Incident Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(claim.incidentDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(claim.submissionDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {claim.location}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Description</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              {claim.description}
            </p>
          </div>

          {/* Rejection Reason */}

          {claim.rejectionReason && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-700 dark:text-red-400 font-medium mb-1">
                Rejection Reason
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">{claim.rejectionReason}</p>
            </div>
          )}

          {/* IRDAI Timeline Information */}

          {irdaiData && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {irdaiData.name} - IRDAI Guidelines
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Settlement Timeline
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {irdaiData.settlementDays} Days
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Expected Settlement
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(
                      expectedSettlementDate.toISOString().split("T")[0]
                    )}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                {irdaiData.guidelines}
              </p>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                Interest: {irdaiData.interestRate}
              </p>
            </div>
          )}

          {/* IRDAI Process Stages */}

          {irdaiData && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                IRDAI Compliant Processing Stages
              </p>
              <div className="space-y-2">
                {irdaiData.stages.map((stage, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-900/50 text-white dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {stage.stage}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {stage.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        Day {stage.days}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Submitted Documents</p>
            <div className="flex flex-wrap gap-2">
              {claim.documents?.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{doc}</span>
                  <button className="w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center">
                    <Download className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Claim Timeline</p>
            <div className="relative pl-6">
              {activeStages.map((stage, index) => (
                <div key={stage.key} className="relative pb-6 last:pb-0">
                  {/* Connector line */}

                  {index < activeStages.length - 1 && (
                    <div className="absolute left-[-18px] top-6 w-0.5 h-full bg-blue-200 dark:bg-blue-800" />
                  )}

                  {/* Dot */}
                  <div className="absolute left-[-22px] top-1 w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-gray-800" />

                  {/* Content */}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {stage.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(claim.timeline[stage.key])}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={downloadSummary}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Summary
          </button>
        </div>
      </div>
    </div>
  );
}
