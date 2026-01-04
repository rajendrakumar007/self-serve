import React, { useState, useMemo } from "react";
import {Upload,X,Calendar,MapPin,IndianRupee,CheckCircle2,AlertCircle,FileType2,FileText,Clock,TrendingUp,Eye,Download,} from "lucide-react";
import {iconMap,validDocFormats,irdaiTimelines,formatDate,} from "../../store/claimsConstants";
import { generateSubmissionPDF } from "../../utils/pdfGenerator";
import {policiesStore,claimTypesStore,claimsStore,} from "../../store/claimsStore";

export default function SubmitClaimForm({ onTrackClick }) {
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [selectedClaimType, setSelectedClaimType] = useState("");
  const [formData, setFormData] = useState({
    incidentDate: "",
    claimAmount: "",
    description: "",
    location: "",
  });
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedClaimId, setGeneratedClaimId] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [docError, setDocError] = useState("");

  const selectedPolicyData = useMemo(() => {
    return policiesStore.getPolicyById(selectedPolicy);
  }, [selectedPolicy]);

  const availableClaimTypes = useMemo(() => {
    if (!selectedPolicyData) return [];
    return claimTypesStore.getClaimTypesByPolicyType(selectedPolicyData.type);
  }, [selectedPolicyData]);

  const requiredDocs = useMemo(() => {
    if (!selectedPolicyData) return [];
    return claimTypesStore.getRequiredDocuments(selectedPolicyData.type);
  }, [selectedPolicyData]);

  // Calculate claim percentage relative to sum insured
  const claimPercentage = useMemo(() => {
    if (!selectedPolicyData || !formData.claimAmount) return 0;
    return claimsStore.getClaimPercentage(selectedPolicy, formData.claimAmount);
  }, [selectedPolicy, formData.claimAmount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePolicyChange = (policyId) => {
    setSelectedPolicy(policyId);
    setSelectedClaimType(""); // Reset claim type when policy changes
  };

  const validateAndAddDocuments = (files) => {
    setDocError("");
    const validFiles = [];
    const invalidFiles = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      if (validDocFormats.includes(ext)) {
        validFiles.push({ name: file.name, size: file.size, type: ext });
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setDocError(
        `Invalid format: ${invalidFiles.join(
          ", "
        )}. Only PDF, Word, Excel files allowed.`
      );
    }

    if (validFiles.length > 0) {
      setDocuments((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileUpload = (e) => {
    validateAndAddDocuments(e.target.files);
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPolicy || !selectedClaimType || !formData.claimAmount || documents.length === 0) {
      alert("Please fill all required fields including uploading documents");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create submission data using the store
    const submissionData = claimsStore.createSubmissionData(
      {
        ...formData,
        documents: documents.map((d) => d.name),
      },
      selectedPolicy,
      selectedClaimType
    );

    // Save to localStorage
    const existingClaims = JSON.parse(
      localStorage.getItem("submittedClaims") || "[]"
    );
    const updatedClaims = [submissionData, ...existingClaims];
    localStorage.setItem("submittedClaims", JSON.stringify(updatedClaims));

    // Also keep modal display data
    const policyType = selectedPolicyData.type;
    const timelineData = irdaiTimelines[policyType];
    const submissionDate_Obj = new Date();
    const expectedSettlementDate = new Date(submissionDate_Obj);
    expectedSettlementDate.setDate(
      expectedSettlementDate.getDate() + (timelineData?.claimSettlement || 30)
    );

    setGeneratedClaimId(submissionData.id);
    setSubmittedData({
      claimId: submissionData.id,
      policy: selectedPolicyData,
      claimType: selectedClaimType,
      formData,
      documents,
      claimPercentage,
      submissionDate: new Date().toLocaleString("en-IN"),
      timelineData,
      expectedSettlementDate:
        expectedSettlementDate.toLocaleDateString("en-IN"),
      estimatedDays: timelineData?.claimSettlement || 30,
      status: "Pending",
    });
    setIsSubmitting(false);
    setIsSubmitted(true);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setSelectedPolicy("");
    setSelectedClaimType("");
    setFormData({
      incidentDate: "",
      claimAmount: "",
      description: "",
      location: "",
    });
    setDocuments([]);
    setIsSubmitted(false);
    setGeneratedClaimId("");
    setSubmittedData(null);
    setShowDetailsModal(false);
    setDocError("");
  };

  const downloadSummary = () => {
    generateSubmissionPDF(submittedData);
  };
  if (isSubmitted) {
    return (
      <>
        {/* Details Modal */}
        {showDetailsModal && submittedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowDetailsModal(false)}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Claim Submitted
                  </h2>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Claim ID & Status */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Claim ID</p>
                  <p className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">
                    {submittedData.claimId}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Status:{" "}
                    <span className="font-semibold text-green-600">
                      Submitted
                    </span>
                  </p>
                </div>

                {/* Submission Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 uppercase">
                      Submission Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />{" "}
                      {submittedData.submissionDate}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 uppercase">
                      Incident Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />{" "}
                      {submittedData.formData.incidentDate}
                    </p>
                  </div>
                </div>

                {/* Claim Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Claim Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Policy:</span>
                      <span className="font-semibold text-gray-900">
                        {submittedData.policy?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Claim Type:</span>
                      <span className="font-semibold text-gray-900">
                        {submittedData.claimType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Claim Amount:</span>
                      <span className="font-semibold text-gray-900">
                        ₹
                        {Number(
                          submittedData.formData.claimAmount
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Sum Insured:</span>
                      <span className="font-semibold text-gray-900">
                        ₹
                        {Number(
                          submittedData.policy?.sumInsured
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-blue-50 px-3 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Claim %:
                      </span>
                      <span className="font-bold text-blue-600">
                        {submittedData.claimPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {submittedData.formData.description}
                  </p>
                </div>

                {/* Location */}
                {submittedData.formData.location && (
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Incident Location</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {submittedData.formData.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Documents */}
                {submittedData.documents.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Attached Documents ({submittedData.documents.length})
                    </h3>
                    <div className="space-y-2">
                      {submittedData.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <FileType2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(doc.size / 1024).toFixed(2)} KB •{" "}
                              {doc.type.toUpperCase()}
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                            {doc.type.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Settlement Timeline */}
                {submittedData.timelineData && (
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Expected Settlement Timeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-600">Submission Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {submittedData.submissionDate}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-600">
                          Expected Settlement
                        </p>
                        <p className="text-sm font-semibold text-blue-600">
                          {submittedData.expectedSettlementDate}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-blue-100 mb-4">
                      <p className="text-xs text-gray-600">
                        Settlement Duration
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {submittedData.estimatedDays} days
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        After all required documents are received
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">
                        Process Steps:
                      </p>
                      <ul className="space-y-2">
                        {submittedData.timelineData.details?.map(
                          (detail, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-gray-700 flex gap-2"
                            >
                              <span className="font-semibold text-blue-600 min-w-fit">
                                Day {detail.days}:
                              </span>
                              <span>
                                {detail.step} - {detail.description}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 flex-wrap">
                  <button
                    onClick={downloadSummary}
                    className="flex-1 min-w-[150px] py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Summary
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setIsSubmitted(false);
                      if (onTrackClick) onTrackClick();
                    }}
                    className="flex-1 min-w-[150px] py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> Track Your Claim
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 min-w-[150px] py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Submit Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message Screen */}
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Claim Submitted Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Your claim has been registered and is being processed. You will
            receive updates via email and SMS.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-8 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Claim ID</p>
            <p className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">
              {generatedClaimId}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Submit Another Claim
            </button>
            <button className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Track This Claim
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Select Policy */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          1. Select Policy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policiesStore.getAllPolicies().map((policy) => {
            const Icon = iconMap[policy.type] || FileText;
            const isSelected = selectedPolicy === policy.id;
            return (
              <button
                key={policy.id}
                type="button"
                onClick={() => {
                  setSelectedPolicy(policy.id);
                  setSelectedClaimType("");
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-400 bg-white"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-blue-200" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? "text-blue-600" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {policy.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {policy.policyNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Sum Insured</span>
                  <span className="font-medium text-gray-900">
                    ₹{(policy.sumInsured / 100000).toFixed(1)}L
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Step 2: Select Claim Type */}
      {selectedPolicy && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            2. Select Claim Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableClaimTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedClaimType(type.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedClaimType === type.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-400 bg-white"
                }`}
              >
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {type.name}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Step 3: Claim Details */}
      {selectedClaimType && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            3. Claim Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Incident Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                INCIDENT DATE <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleInputChange}
                required
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            {/* Claim Amount */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <IndianRupee className="w-4 h-4 text-blue-600" />
                CLAIM AMOUNT <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="claimAmount"
                value={formData.claimAmount}
                onChange={handleInputChange}
                placeholder="Enter amount in ₹"
                required
                min="1"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {formData.claimAmount && selectedPolicyData && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-600">
                    Claim Amount Percentage
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-semibold text-gray-900">
                      {claimPercentage}% of Sum Insured
                    </span>
                    <span className="text-sm text-blue-600">
                      ₹
                      {Number(selectedPolicyData.sumInsured).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                LOCATION OF INCIDENT{" "}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State or Address"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            {/* Description */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                DESCRIPTION <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the incident in detail..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Upload Documents */}
      {selectedClaimType && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              4. Upload Documents
            </h3>
            <span className="text-red-500">*</span>
          </div>

          {/* Required Documents Hint */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Required Documents:
              </p>
              <p className="text-sm text-blue-800">{requiredDocs.join(", ")}</p>
            </div>
          </div>

          {/* Error Message */}
          {docError && (
            <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">{docError}</p>
            </div>
          )}

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
            <input
              type="file"
              id="documents"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="documents" className="cursor-pointer block">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drag & drop files here or click to browse
              </p>
              <p className="text-xs text-gray-600">
                Supported: PDF, Word (DOC/DOCX), Excel (XLS/XLSX) - Max 10MB
                each
              </p>
            </label>
          </div>

          {/* Uploaded Files */}
          {documents.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                Uploaded Documents ({documents.length})
              </p>
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileType2 className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {(doc.size / 1024).toFixed(1)} KB •{" "}
                        {doc.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {doc.type.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="w-8 h-8 rounded-lg hover:bg-red-100 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      {selectedClaimType && (
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.incidentDate ||
              !formData.claimAmount ||
              !formData.description ||
              documents.length === 0
            }
            className="px-8 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Claim"
            )}
          </button>
        </div>
      )}
    </form>
  );
}
