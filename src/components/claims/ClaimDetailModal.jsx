import React from "react";
import {
  X,
  Calendar,
  MapPin,
  FileText,
  Clock,
} from "lucide-react";
import {
  expectedTimelines,
  getExpectedSettlement,
} from "../../utils/claims/expectedTimelines";
import GeneratePDF from "./GeneratePDF";

const ClaimDetailModal = ({ claim, onClose }) => {
  const timeline =
    expectedTimelines[claim.policyType] || expectedTimelines.health;
  const expectedDate = getExpectedSettlement(
    claim.policyType,
    claim.submissionDate || claim.raisedDate
  );
  const displayStatus = claim.status === "Settled" ? "Approved" : claim.status;

  const claimPdfSections = [
    {
      title: "CLAIM DETAILS",
      type: "rows",
      data: [
        { label: "Claim ID", value: claim.claimId },
        { label: "Policy ID", value: claim.policyId },
        {
          label: "Claim Amount",
          value: `Rs. ${claim.claimAmount?.toLocaleString("en-IN") || 0}`,
        },
        { label: "Status", value: displayStatus },
      ],
    },
    {
      title: "INCIDENT INFORMATION",
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
        { label: "Description", value: claim.description || "-" },
      ],
    },
    {
      title: "EXPECTED PROCESS TIMELINE",
      type: "list",
      data: timeline.steps?.map((step) => {
        const timeDisplay =
          step.isHourly || timeline.isHourly
            ? `${step.hours || 0} hours`
            : `${step.days || 0} days`;
        return `Step ${step.step}: ${step.title} - ${timeDisplay}`;
      }) || ["Timeline information not available"],
    },
  ];

  const getStepStatus = (stepDays, stepHours, stepIndex, claimStatus) => {
    // First step (index 0 - Claim Submitted) is always complete
    if (stepIndex === 0) {
      return true;
    }

    // Map claim status to completed steps
    // SUBMITTED status means only step 0 (Claim Submitted) is complete
    if (claimStatus === "SUBMITTED") {
      return false; // Only step 0 (Submitted) is complete, all others are incomplete
    }

    // UNDER REVIEW status means first 4 steps are complete (indices 0-3)
    if (claimStatus === "UNDER REVIEW") {
      return stepIndex <= 3; // Complete first 4 steps (indices 0-3)
    }

    // APPROVED status means all steps are complete
    if (claimStatus === "APPROVED") {
      return true; // All steps are complete
    }
    // SETTLED status means all steps are complete
    if (claimStatus === "SETTLED") {
      return true;
    }

    // REJECTED status - all steps are shown as complete with red color
    if (claimStatus === "REJECTED") {
      return true; // All steps marked as complete for red display
    }

    // For other statuses, fall back to time-based check
    // Handle both full ISO timestamp and date-only format
    let submissionDate = claim.submissionDate || claim.raisedDate;

    // If it's just a date (YYYY-MM-DD), add midnight time for consistency
    if (submissionDate && submissionDate.length === 10) {
      submissionDate = new Date(submissionDate + "T00:00:00").getTime();
    } else {
      submissionDate = new Date(submissionDate).getTime();
    }

    const now = new Date().getTime();

    // For health policy with hours
    if (claim.policyType === "health" && stepHours !== undefined) {
      const hoursPassed = (now - submissionDate) / (1000 * 60 * 60);
      return hoursPassed >= stepHours;
    }

    // For other policies with days
    const daysPassed = (now - submissionDate) / (1000 * 60 * 60 * 24);
    return daysPassed >= stepDays;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bgCard dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-bgCard dark:bg-gray-800 border-b border-borderDefault dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-textPrimary dark:text-white">
            Claim Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bgMuted dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-textMuted dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Claim Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
              <span className="text-textMuted dark:text-gray-400">
                Claim ID
              </span>
              <span className="font-mono font-medium text-primary">
                {claim.claimId || claim.id}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
              <span className="text-textMuted dark:text-gray-400">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  claim.status === "APPROVED" || claim.status === "SETTLED"
                    ? "bg-successBg text-success dark:bg-success/20"
                    : claim.status === "REJECTED"
                    ? "bg-dangerBg text-danger dark:bg-danger/20"
                    : "bg-warningBg text-warning dark:bg-warning/20"
                }`}
              >
                {displayStatus}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
              <span className="text-textMuted dark:text-gray-400">
                Policy ID
              </span>
              <span className="text-textPrimary dark:text-white">
                {claim.policyId}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
              <span className="text-textMuted dark:text-gray-400">
                Policy Type
              </span>
              <span className="capitalize text-textPrimary dark:text-white">
                {claim.policyType}
              </span>
            </div>
            {claim.claimAmount && (
              <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
                <span className="text-textMuted dark:text-gray-400">
                  Claim Amount
                </span>
                <span className="font-medium text-textPrimary dark:text-white">
                  ₹{claim.claimAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            {claim.sumInsured && (
              <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
                <span className="text-textMuted dark:text-gray-400">
                  Sum Insured
                </span>
                <span className="font-medium text-textPrimary dark:text-white">
                  ₹{claim.sumInsured?.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            {claim.availableClaim !== undefined && (
              <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
                <span className="text-textMuted dark:text-gray-400">
                  Available Claim
                </span>
                <span className="font-medium text-textPrimary dark:text-white">
                  ₹{claim.availableClaim?.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            {claim.approvedAmount && (
              <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
                <span className="text-textMuted dark:text-gray-400">
                  Approved Amount
                </span>
                <span className="font-medium text-success">
                  ₹{claim.approvedAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
              <span className="text-textMuted dark:text-gray-400 flex items-center gap-2">
                <Calendar size={16} />
                Incident Date
              </span>
              <span className="text-textPrimary dark:text-white">
                {claim.incidentDate}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
              <span className="text-textMuted dark:text-gray-400 flex items-center gap-2">
                <MapPin size={16} />
                Location
              </span>
              <span className="text-textPrimary dark:text-white">
                {claim.location}
              </span>
            </div>
            <div className="py-2 border-b border-borderDefault dark:border-gray-700">
              <span className="text-textMuted dark:text-gray-400 block mb-1">
                Description
              </span>
              <p className="text-textPrimary dark:text-white">
                {claim.description}
              </p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
              <span className="text-textMuted dark:text-gray-400">
                Submission Date
              </span>
              <span className="text-textPrimary dark:text-white">
                {new Date(
                  claim.submissionDate || claim.raisedDate
                ).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-borderDefault dark:border-gray-700">
              <span className="text-textMuted dark:text-gray-400 flex items-center gap-2">
                <Clock size={16} />
                Expected Settlement
              </span>
              <span
                className={`font-medium ${
                  claim.status === "REJECTED" ? "text-danger" : "text-success"
                }`}
              >
                {claim.status === "REJECTED" ? "-" : expectedDate}
              </span>
            </div>
            <div className="py-2">
              <span className="text-textMuted dark:text-gray-400 block mb-2 flex items-center gap-2">
                <FileText size={16} />
                Documents
              </span>
              <div className="space-y-2">
                {claim.documents?.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-textSecondary dark:text-gray-300 bg-bgMuted dark:bg-gray-700 px-3 py-2 rounded"
                  >
                    <FileText size={16} />
                    <span>{typeof doc === "string" ? doc : doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-borderDefault dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-textPrimary dark:text-white">
                Expected Timeline
              </h3>
              {claim.status === "REJECTED" && (
                <span className="text-xs bg-dangerBg dark:bg-danger/20 text-danger px-2 py-1 rounded">
                  Timeline Completed
                </span>
              )}
            </div>
            <div className="relative">
              {timeline.steps.map((step, index) => {
                const isComplete = getStepStatus(
                  step.days,
                  step.hours,
                  index,
                  claim.status
                );

                return (
                  <div key={step.step} className="flex gap-4 pb-4 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          claim.status === "REJECTED"
                            ? "bg-dangerBg dark:bg-danger/20 text-danger"
                            : isComplete
                            ? "bg-success text-white"
                            : "bg-bgMuted dark:bg-gray-700 text-textMuted dark:text-gray-400"
                        }`}
                      >
                        {isComplete ? <Clock size={16} /> : step.step}
                      </div>
                      {index < timeline.steps.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-2 ${
                            claim.status === "REJECTED"
                              ? "bg-danger/50"
                              : isComplete
                              ? "bg-success"
                              : "bg-borderDefault dark:bg-gray-700"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-medium ${
                            claim.status === "REJECTED"
                              ? "text-danger"
                              : isComplete
                              ? "text-success"
                              : "text-textPrimary dark:text-white"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-sm text-textMuted dark:text-gray-400">
                          {claim.policyType === "health" &&
                          step.hours !== undefined
                            ? `${step.hours}h`
                            : `Day ${step.days}`}
                        </span>
                      </div>
                      <p className="text-sm text-textMuted dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
              {claim.rejectionReason && <p className="text-danger font-medium"> Rejection reason : {claim.rejectionReason}</p>}
          </div>

          {/* Download Button */}
          <GeneratePDF
            fileName={`Claim_${claim.claimId}_Details.pdf`}
            title="CLAIM DETAILS"
            subtitle="Claim Information Report"
            sections={claimPdfSections}
          />
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailModal;
