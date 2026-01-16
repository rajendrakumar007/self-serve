import React from "react";
import { CheckCircle, Calendar, FileText } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import GeneratePDF from "./GeneratePDF";

const ClaimSummary = ({ claim, onSubmitAnother, onTrackClaims }) => {
  const claimSections = [
    {
      title: "CLAIM DETAILS",
      type: "rows",
      data: [
        { label: "Claim ID", value: claim.claimId },
        { label: "Policy", value: claim.policyTitle || claim.policyId },
        {
          label: "Claim Amount",
          value: `Rs. ${claim.claimAmount?.toLocaleString("en-IN") || 0}`,
        },
        { label: "Status", value: claim.status || "SUBMITTED" },
      ],
    },
    {
      title: "INCIDENT DETAILS",
      type: "rows",
      data: [
        { label: "Incident Date", value: claim.incidentDate || "-" },
        {
          label: "Submission Date",
          value: claim.submissionDate
            ? new Date(claim.submissionDate).toLocaleDateString()
            : "-",
        },
        { label: "Location", value: claim.location || "-" },
      ],
    },
    {
      title: "DESCRIPTION",
      type: "text",
      data: claim.description || "No description provided",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bgPrimary dark:bg-gray-900">
        <div className="max-w-xl mx-auto px-3 py-4 sm:px-4">
          {/* Success Header */}
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-successBg dark:bg-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="text-success" size={24} />
            </div>
            <h1 className="text-xl font-bold text-textPrimary dark:text-white">
              Claim Submitted Successfully
            </h1>
            <p className="text-xs text-textMuted dark:text-gray-400 mt-1">
              Your claim has been received and is being processed
            </p>
          </div>

          {/* Claim Summary Card */}
          <div className="bg-bgCard dark:bg-gray-800 border border-borderDefault dark:border-gray-700 rounded-lg p-4 mb-4">
            <h2 className="text-sm font-semibold text-textPrimary dark:text-white mb-3">
              Claim Summary
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-borderDefault dark:border-gray-700">
                <span className="text-xs text-textMuted dark:text-gray-400">
                  Claim ID
                </span>
                <span className="font-mono font-medium text-xs text-primary">
                  {claim.claimId}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-borderDefault dark:border-gray-700">
                <span className="text-xs text-textMuted dark:text-gray-400">
                  Policy
                </span>
                <span className="text-xs text-textPrimary dark:text-white">
                  {claim.policyTitle || claim.policyId}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-borderDefault dark:border-gray-700">
                <span className="text-xs text-textMuted dark:text-gray-400">
                  Policy Type
                </span>
                <span className="capitalize text-xs text-textPrimary dark:text-white">
                  {claim.policyType}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-borderDefault dark:border-gray-700">
                <span className="text-xs text-textMuted dark:text-gray-400">
                  Claim Amount
                </span>
                <span className="font-medium text-xs text-textPrimary dark:text-white">
                  ₹{claim.claimAmount?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-borderDefault dark:border-gray-700">
                <span className="text-xs text-textMuted dark:text-gray-400">
                  Incident Date
                </span>
                <span className="text-xs text-textPrimary dark:text-white">
                  {claim.incidentDate}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-borderDefault dark:border-gray-700">
                <span className="text-xs text-textMuted dark:text-gray-400">
                  Location
                </span>
                <span className="text-xs text-textPrimary dark:text-white">
                  {claim.location}
                </span>
              </div>
              <div className="py-1.5 border-b border-borderDefault dark:border-gray-700">
                <span className="text-xs text-textMuted dark:text-gray-400 block mb-0.5">
                  Description
                </span>
                <p className="text-xs text-textPrimary dark:text-white">
                  {claim.description}
                </p>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-borderDefault dark:border-gray-700">
                <span className="text-xs text-textMuted dark:text-gray-400">
                  Submission Date
                </span>
                <span className="text-xs text-textPrimary dark:text-white flex items-center gap-1">
                  <Calendar size={12} />
                  {claim.submissionDate
                    ? new Date(claim.submissionDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="py-1.5">
                <span className="text-xs text-textMuted dark:text-gray-400 block mb-1">
                  Documents
                </span>
                <div className="space-y-1">
                  {claim.documents?.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-textSecondary dark:text-gray-300 bg-bgMuted dark:bg-gray-700 px-2 py-1 rounded"
                    >
                      <FileText size={12} />
                      <span className="truncate">
                        {typeof doc === "string" ? doc : doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onSubmitAnother}
              className="flex-1 py-2 px-4 border border-borderDefault dark:border-gray-600 text-textPrimary dark:text-white font-medium text-sm rounded-lg hover:bg-bgMuted dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              Submit Another Claim
            </button>
            <button
              onClick={onTrackClaims}
              className="flex-1 py-2 px-4 bg-primary hover:bg-primaryDark text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Track Claims
            </button>
            <div className="flex-1">
              <GeneratePDF
                fileName={`Claim_${claim.claimId}.pdf`}
                title="CLAIM RECEIPT"
                subtitle="Submission Confirmation"
                sections={claimSections}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimSummary;
