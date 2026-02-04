import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import {
  FileText,
  Calendar,
  MapPin,
  IndianRupee,
  Upload,
  AlertCircle,
  CheckCircle,
  Heart,
  Briefcase,
  Car,
  Bike,
  Globe,
  Plane,
  XCircle,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import { claimsApi } from "../../utils/claims/apiClaim";
import {
  generateClaimId,
  generateNotificationId,
} from "../../utils/claims/generateClaimId";
import ClaimSummary from "../../components/claims/ClaimSummary";
import { uploadMultipleDocuments } from "../../utils/claims/supabaseStorageService";
import { getCurrentUserId } from "../../utils/auth/auth";

const policyIcons = {
  health: Heart,
  life: Briefcase,
  car: Car,
  bike: Bike,
  airpass: Plane,
  travel: Globe,
};

const SubmitClaimForm = () => {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const [userPolicies, setUserPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [formData, setFormData] = useState({
    incidentDate: "",
    claimAmount: "",
    location: "",
    description: "",
  });

  const [documents, setDocuments] = useState([]);
  const [amountUsedPercent, setAmountUsedPercent] = useState(0);
  const [documentFiles, setDocumentFiles] = useState({}); // Store actual File objects

  const fetchAndRefreshPolicies = async () => {
    try {
      console.log("Refreshing policies for userId:", userId);
      const policies = await claimsApi.getUserPolicies(userId);
      console.log("Refreshed policies:", policies);
      setUserPolicies(policies);
      // If a policy was selected, update it with fresh data
      if (selectedPolicy) {
        const updatedPolicy = policies.find(
          (p) => p.policyId === selectedPolicy.policyId
        );
        if (updatedPolicy) {
          console.log(
            "Updated selected policy sum insured:",
            updatedPolicy.sumInsured
          );
          setSelectedPolicy(updatedPolicy);
        }
      }
    } catch (err) {
      console.error("Error refreshing policies:", err);
    }
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        console.log("SubmitClaimForm - userId:", userId);
        const policies = await claimsApi.getUserPolicies(userId);
        console.log("SubmitClaimForm - received policies:", policies);
        setUserPolicies(policies);
      } catch (err) {
        console.error("Error fetching policies:", err);
        setError("Failed to load policies");
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();

    // Refresh policies every 30 seconds to reflect settlement changes
    const refreshInterval = setInterval(() => {
      fetchAndRefreshPolicies();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [userId]);

  useEffect(() => {
    console.log(
      "State update - showSummary:",
      showSummary,
      "submittedClaim:",
      submittedClaim
    );
    if (showSummary && submittedClaim) {
      console.log("ClaimSummary SHOULD render now!");
      console.log("showSummary is true:", showSummary);
      console.log("submittedClaim exists:", !!submittedClaim);
    } else {
      console.log(" ClaimSummary condition NOT met");
      console.log("showSummary:", showSummary);
      console.log("submittedClaim:", submittedClaim);
    }
  }, [showSummary, submittedClaim]);

  const validateDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    return date <= now;
  };

  const handleAmountChange = (value) => {
    const amount = parseFloat(value) || 0;
    if (selectedPolicy) {
      const max = selectedPolicy.availableBalance || selectedPolicy.sumInsured;
      // Always calculate and update the percentage
      if (amount > 0) {
        setAmountUsedPercent(((amount / max) * 100).toFixed(1));
      } else {
        setAmountUsedPercent(0);
      }

      if (amount > max) {
        setError(
          `Claim amount exceeds remaining policy limit of ₹${max.toLocaleString(
            "en-IN"
          )}${
            max < selectedPolicy.originalSumInsured
              ? ` (Originally ₹${selectedPolicy.originalSumInsured?.toLocaleString(
                  "en-IN"
                )}, ₹${(
                  selectedPolicy.originalSumInsured - max
                )?.toLocaleString("en-IN")} already claimed)`
              : ""
          }`
        );
      } else {
        setError("");
      }
    }
    setFormData((prev) => ({ ...prev, claimAmount: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate that all files are PDFs
    const invalidFiles = files.filter((f) => f.type !== "application/pdf");
    if (invalidFiles.length > 0) {
      setError(
        `Only PDF files are supported. ${invalidFiles.length} file(s) rejected.`
      );
      setTimeout(() => setError(""), 3000);
      return;
    }

    const fileMap = { ...documentFiles };
    const newDocs = files.map((f) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      fileMap[id] = f; // Store actual File object
      return {
        id,
        name: f.name,
        size: f.size,
        type: "pdf",
      };
    });
    setDocumentFiles(fileMap);
    setDocuments([...documents, ...newDocs]);
  };

  const handleFileRemove = (idToRemove) => {
    setDocuments(documents.filter((doc) => doc.id !== idToRemove));
    const newFileMap = { ...documentFiles };
    delete newFileMap[idToRemove];
    setDocumentFiles(newFileMap);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedPolicy ||
      !formData.incidentDate ||
      !formData.claimAmount ||
      !formData.location ||
      !formData.description
    ) {
      setError("Please fill all required fields");
      return;
    }
    if (!validateDate(formData.incidentDate)) {
      setError("Incident date must be in the past");
      return;
    }
    const amount = parseFloat(formData.claimAmount);
    if (amount > selectedPolicy.sumInsured) {
      setError(
        `Claim amount exceeds remaining policy limit of ₹${selectedPolicy.sumInsured.toLocaleString(
          "en-IN"
        )}${
          selectedPolicy.sumInsured < selectedPolicy.originalSumInsured
            ? ` (Originally ₹${selectedPolicy.originalSumInsured?.toLocaleString(
                "en-IN"
              )}, ₹${(
                selectedPolicy.originalSumInsured - selectedPolicy.sumInsured
              )?.toLocaleString("en-IN")} already claimed)`
            : ""
        }`
      );
      return;
    }
    if (documents.length === 0) {
      setError("Please upload at least one supporting document");
      return;
    }

    setSubmitting(true);
    try {
      const claimsCount = await claimsApi.getClaimsCount();
      const claimId = generateClaimId(claimsCount);
      const submissionDate = new Date().toISOString();

      // Upload documents to Supabase and get URLs
      let uploadedDocuments = [];
      if (documents.length > 0) {
        try {
          const filesToUpload = documents.map((doc) => {
            if (!documentFiles[doc.id]) {
              console.error(
                `File not found for doc ID: ${doc.id}. Available IDs:`,
                Object.keys(documentFiles)
              );
            }
            return documentFiles[doc.id];
          });

          console.log("Files to upload:", filesToUpload);

          uploadedDocuments = await uploadMultipleDocuments(
            filesToUpload,
            claimId
          );
          console.log("Documents uploaded successfully:", uploadedDocuments);
        } catch (uploadError) {
          console.error("Error uploading documents:", uploadError);
          setError(
            `Failed to upload documents: ${uploadError.message}. Please try again.`
          );
          setSubmitting(false);
          return;
        }
      }

      const claimData = {
        claimId,
        userId,
        policyId: selectedPolicy.policyId,
        policyType: selectedPolicy.type,
        claimType: "",
        claimAmount: amount,
        sumInsured: selectedPolicy.sumInsured,
        availableClaim:
          selectedPolicy.availableBalance || selectedPolicy.sumInsured,
        description: formData.description,
        location: formData.location,
        incidentDate: formData.incidentDate,
        submissionDate,
        documents: uploadedDocuments,
        status: "SUBMITTED",
        approvedAmount: null,
        rejectionReason: null,
        raisedDate: submissionDate,
        timeline: { submitted: submissionDate, approved: null, settled: null },
      };

      console.log("Submitting claim:", claimData);

      // Submit claim
      await claimsApi.submitClaim(claimData);
      console.log("Claim submitted successfully");

      // NOTE: availableClaim will be reduced only when the claim is APPROVED, not on submission
      // This allows users to claim again while their first claim is pending

      const notifId = generateNotificationId(
        await claimsApi.getNotificationsCount()
      );
      await claimsApi.createNotification({
        notificationId: notifId,
        userId,
        type: "CLAIM",
        message: `Your policy claim (${claimId}) has been submitted successfully`,
      });
      console.log("Notification created");

      const finalClaimData = {
        ...claimData,
        policyTitle: selectedPolicy.title,
      };
      console.log("Setting submitted claim:", finalClaimData);
      console.log("selectedPolicy:", selectedPolicy);
      console.log("selectedPolicy.title:", selectedPolicy.title);
      console.log("Setting showSummary to true");

      // Force synchronous state updates to ensure ClaimSummary renders
      flushSync(() => {
        console.log("INSIDE flushSync - about to set state");
        setSubmittedClaim(finalClaimData);
        setShowSummary(true);
        console.log("INSIDE flushSync - state set");
      });

      console.log("AFTER flushSync");
      setSubmitting(false);
      onSubmitted?.(finalClaimData);

      // Refresh policies after successful submission to reflect any settlement changes
      setTimeout(() => {
        fetchAndRefreshPolicies();
      }, 1000);
    } catch (err) {
      console.error("Error submitting claim:", err);
      setError("Failed to submit claim. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (showSummary && submittedClaim) {
    return (
      <ClaimSummary
        claim={submittedClaim}
        onSubmitAnother={() => {
          setShowSummary(false);
          setSubmittedClaim(null);
          setSelectedPolicy(null);
          setFormData({
            incidentDate: "",
            claimAmount: "",
            location: "",
            description: "",
          });
          setDocuments([]);
          setAmountUsedPercent(0);
        }}
        onTrackClaims={() => navigate("/track-claims")}
      />
    );
  }

  const maxDate = new Date().toISOString().split("T")[0];
  const minDate = new Date("1900-01-01");
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bgPrimary dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {userPolicies.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-full max-w-md">
                <div className="bg-bgCard dark:bg-gray-800 rounded-2xl p-12 border border-borderDefault dark:border-gray-700 text-center space-y-6">
                  {/* Empty State Icon */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-warning/10 dark:bg-warning/20 rounded-full flex items-center justify-center">
                      <AlertCircle className="text-warning" size={40} />
                    </div>
                  </div>

                  {/* Heading */}
                  <div>
                    <h2 className="text-2xl font-bold text-textPrimary dark:text-white mb-2">
                      No Active Policies
                    </h2>
                    <p className="text-textSecondary dark:text-gray-400">
                      You don't have any active policies yet. To file a claim,
                      you'll need to purchase a policy first.
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="bg-bgMuted dark:bg-gray-700/50 rounded-lg p-4 border border-borderDefault dark:border-gray-600">
                    <p className="text-sm text-textMuted dark:text-gray-300">
                      <span className="font-semibold text-textSecondary dark:text-gray-200">
                        Next Step:
                      </span>{" "}
                      Visit the Policies section to browse and purchase
                      insurance policies that suit your needs.
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate("/")}
                    className="w-full py-3 px-6 bg-primary hover:bg-primaryDark text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Globe size={18} />
                    Explore Policies
                  </button>

                  {/* Secondary Info */}
                  <p className="text-xs text-textMuted dark:text-gray-500">
                    Already purchased a policy? It may take a few moments to
                    appear here.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 bg-bgCard dark:bg-gray-800 rounded-xl p-6 border border-borderDefault dark:border-gray-700 sticky top-24"
                >
                  {/* Policy Selection */}
                  <div>
                    <label className="block text-xs font-medium text-textSecondary dark:text-gray-300 mb-2">
                      Select Policy to File Claim
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {userPolicies.map((policy) => {
                        const IconComponent =
                          policyIcons[policy.type] || FileText;
                        return (
                          <button
                            key={policy.policyId}
                            type="button"
                            onClick={() => setSelectedPolicy(policy)}
                            className={`p-2.5 rounded-lg border-2 transition-all flex flex-col items-center text-center ${
                              selectedPolicy?.policyId === policy.policyId
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-borderDefault dark:border-gray-600 bg-bgCard dark:bg-gray-800 hover:border-primary/50"
                            }`}
                          >
                            <IconComponent
                              size={20}
                              className={`${
                                selectedPolicy?.policyId === policy.policyId
                                  ? "text-primary"
                                  : "text-textSecondary dark:text-gray-400"
                              } mb-1`}
                            />
                            <p className="font-medium text-xs text-textPrimary dark:text-white">
                              {policy.title}
                            </p>
                            <p className="text-xs text-primary font-semibold mt-0.5">
                              Rs. {(policy.sumInsured / 100000).toFixed(1)}L
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedPolicy && (
                    <>
                      {/* Incident Date */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary dark:text-gray-300 mb-2">
                          <Calendar className="inline mr-2" size={16} />
                          Date of Incident
                        </label>
                        <input
                          type="date"
                          value={formData.incidentDate}
                          min={minDateStr}
                          max={maxDate}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              incidentDate: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-borderDefault dark:border-gray-600 rounded-lg bg-bgCard dark:bg-gray-800 text-textPrimary dark:text-white focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      {/* Claim Amount */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary dark:text-gray-300 mb-2">
                          <IndianRupee className="inline mr-2" size={16} />
                          Claim Amount
                        </label>
                        <input
                          type="number"
                          value={formData.claimAmount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          placeholder="Enter claim amount"
                          min="1"
                          max={
                            selectedPolicy.availableBalance ||
                            selectedPolicy.sumInsured
                          }
                          className="w-full px-4 py-3 border border-borderDefault dark:border-gray-600 rounded-lg bg-bgCard dark:bg-gray-800 text-textPrimary dark:text-white focus:ring-2 focus:ring-primary"
                          required
                        />

                        {formData.claimAmount &&
                          Number(formData.claimAmount) > 0 &&
                          (selectedPolicy?.availableBalance ||
                            selectedPolicy?.sumInsured) && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm text-textMuted dark:text-gray-400 mb-1">
                                <span>Usage</span>
                                <span>
                                  {amountUsedPercent}% of ₹
                                  {(
                                    selectedPolicy.availableBalance ||
                                    selectedPolicy.sumInsured
                                  ).toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div className="h-2 bg-bgMuted dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(
                                      amountUsedPercent,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}

                        {Number(formData.claimAmount) >
                          (selectedPolicy.availableBalance ||
                            selectedPolicy.sumInsured) && (
                          <p className="text-red-500 text-sm mt-1">
                            Claim amount cannot exceed remaining limit (₹
                            {(
                              selectedPolicy.availableBalance ||
                              selectedPolicy.sumInsured
                            ).toLocaleString("en-IN")}
                            ).
                          </p>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary dark:text-gray-300 mb-2">
                          <MapPin className="inline mr-2" size={16} />
                          Location of Incident
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Enter incident location"
                          className="w-full px-4 py-3 border border-borderDefault dark:border-gray-600 rounded-lg bg-bgCard dark:bg-gray-800 text-textPrimary dark:text-white focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary dark:text-gray-300 mb-2">
                          <FileText className="inline mr-2" size={16} />
                          Incident Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Describe the incident in detail..."
                          rows={4}
                          className="w-full px-4 py-3 border border-borderDefault dark:border-gray-600 rounded-lg bg-bgCard dark:bg-gray-800 text-textPrimary dark:text-white focus:ring-2 focus:ring-primary resize-none"
                          required
                        />
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary dark:text-gray-300 mb-2">
                          <Upload className="inline mr-2" size={16} />
                          Upload Supporting Documents
                        </label>
                        <div className="border-2 border-dashed border-borderDefault dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer"
                          >
                            <Upload
                              className="mx-auto text-textMuted dark:text-gray-400 mb-2"
                              size={32}
                            />
                            <p className="text-textSecondary dark:text-gray-300">
                              Click to upload or drag files here
                            </p>
                            <p className="text-sm text-textMuted dark:text-gray-400 mt-1">
                              PDF only (Max 10MB each)
                            </p>
                          </label>
                        </div>
                        {documents.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between gap-2 text-sm text-textSecondary dark:text-gray-300 bg-bgMuted dark:bg-gray-700 px-3 py-2 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText size={16} />
                                  <span>{doc.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-textMuted dark:text-gray-400">
                                    {(doc.size / 1024).toFixed(1)} KB
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleFileRemove(doc.id)}
                                    className="text-textMuted hover:text-error dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                    title="Remove file"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {successMessage && (
                    <div className="bg-successBg dark:bg-success/20 border border-success rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="text-success" size={20} />
                      <p className="text-success">{successMessage}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-successBg dark:bg-success/20 border border-success rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="text-success" size={20} />
                      <p className="text-success">{successMessage}</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-dangerBg dark:bg-danger/20 border border-danger rounded-lg p-4 flex items-center gap-3">
                      <AlertCircle className="text-danger" size={20} />
                      <p className="text-danger">{error}</p>
                    </div>
                  )}

                  {selectedPolicy && (
                    <button
                      type="submit"
                      disabled={submitting || error !== ""}
                      className="w-full py-3 px-6 bg-primary hover:bg-primaryDark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />{" "}
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} /> Submit Claim
                        </>
                      )}
                    </button>
                  )}
                </form>
              </div>

              {/* Sidebar - Policy Details */}
              <div className="lg:col-span-1">
                {selectedPolicy ? (
                  <div className="bg-bgCard dark:bg-gray-800 rounded-xl p-6 border border-borderDefault dark:border-gray-700 sticky top-24 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-textSecondary dark:text-gray-400 mb-1">
                        Selected Policy
                      </h3>
                      <p className="text-lg font-bold text-textPrimary dark:text-white">
                        {selectedPolicy.title}
                      </p>
                      <p className="text-xs text-textMuted dark:text-gray-400 mt-1">
                        {selectedPolicy.policyId}
                      </p>
                    </div>

                    <div className="border-t border-borderDefault dark:border-gray-700 pt-4 space-y-3">
                      <div>
                        <p className="text-xs text-textMuted dark:text-gray-400">
                          Sum Insured
                        </p>
                        <p className="text-lg font-bold text-primary">
                          Rs.{" "}
                          {selectedPolicy.sumInsured.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-textMuted dark:text-gray-400">
                          Available Claim
                        </p>
                        <p className="text-lg font-bold text-success">
                          Rs.{" "}
                          {(
                            selectedPolicy.availableBalance ||
                            selectedPolicy.sumInsured
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {formData.claimAmount &&
                        parseFloat(formData.claimAmount) > 0 && (
                          <div>
                            <p className="text-xs text-textMuted dark:text-gray-400">
                              Claim Amount
                            </p>
                            <p className="text-lg font-bold text-textPrimary dark:text-white">
                              Rs.{" "}
                              {parseFloat(formData.claimAmount).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        )}
                    </div>

                    <div className="border-t border-borderDefault dark:border-gray-700 pt-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-textMuted dark:text-gray-400">
                          Policy Type:
                        </span>
                        <span className="text-textPrimary dark:text-white font-medium capitalize">
                          {selectedPolicy.type}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-textMuted dark:text-gray-400">
                          Status:
                        </span>
                        <span className="text-success font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-bgCard dark:bg-gray-800 rounded-xl p-6 border border-borderDefault dark:border-gray-700 sticky top-24 text-center">
                    <p className="text-sm text-textMuted dark:text-gray-400">
                      Select a policy to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubmitClaimForm;
