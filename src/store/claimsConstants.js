import {
  Heart,
  Car,
  Bike,
  Plane,
  Shield,
  Home,
  FileText,
  Clock,
  Eye,
  Info,
  CheckCircle2,
  Circle,
  AlertCircle,
  XCircle,
} from "lucide-react";

// --- ICON MAPPING ---
export const iconMap = {
  health: Heart,
  "motor-car": Car,
  "motor-bike": Bike,
  travel: Plane,
  life: Shield,
  home: Home,
};

// --- STATUS STYLES (Used in ClaimCard & ClaimDetailModal) ---
export const statusStyles = {
  Pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  "Document Verification": {
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: FileText,
  },
  "Under Review": { bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
  Investigation: { bg: "bg-orange-100", text: "text-orange-700", icon: Info },
  Approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  Rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  Settled: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
};

// --- POLICY LABELS ---
export const policyLabels = {
  health: "Health Insurance",
  "motor-car": "Car Insurance",
  "motor-bike": "Bike Insurance",
  travel: "Travel Insurance",
  life: "Life Insurance",
  home: "Home Insurance",
};

// --- POLICY FILTERS (Used in TrackCliams) ---
export const policyFilters = [
  { id: "all", label: "All", icon: null },
  { id: "health", label: "Health", icon: Heart },
  { id: "motor-car", label: "Car", icon: Car },
  { id: "motor-bike", label: "Bike", icon: Bike },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "life", label: "Life", icon: Shield },
  { id: "home", label: "Home", icon: Home },
];

// --- STATUS FILTERS (Used in TrackCliams) ---
export const statusFilters = [
  { id: "all", label: "All Status" },
  { id: "SUBMITTED", label: "Submitted" },
  { id: "UNDER_REVIEW", label: "Under Review" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
];

// --- VALID DOCUMENT FORMATS (Used in SubmitClaimForm) ---
export const validDocFormats = ["pdf", "doc", "docx", "xls", "xlsx"];

// --- IRDAI COMPLIANCE TIMELINES (Used in EstimatedTimelines & ClaimDetailModal) ---
export const irdaiTimelines = {
  health: {
    name: "Health Insurance (IRDAI Compliant)",
    claimSettlement: 7,
    investigation: 25,
    details: [
      {
        step: "Claim Submission",
        description: "File your health claim",
      },
      {
        step: "Document Verification",
        description: "Insurer reviews required documents",
      },
      {
        step: "Investigation (if needed)",
        description: "Complete investigation within 45 days max",
      },
      {
        step: "Settlement",
        description: "Final settlement within 30 days",
      },
    ],
    guidelines: [
      "Claim settlement within 30 days of all required documents",
      "Investigation completion within 45 days if required",
      "No rejection for missing documents or delayed intimation",
      "Interest payable for delays at 2% above bank rate",
    ],
  },
  life: {
    name: "Life Insurance (IRDAI Compliant)",
    claimSettlement: 12,
    investigation: 50,
    details: [
      {
        step: "Claim Submission",
        description: "File death claim with documents",
      },
      {
        step: "Document Verification",
        description: "Insurer collects necessary documents",
      },
      {
        step: "Investigation (if required)",
        description: "Investigation completion within 90 days",
      },
      {
        step: "Approval/Rejection Decision",
        description: "Decision within 30 days after investigation",
      },
      {
        step: "Final Settlement",
        description: "Payment/rejection notice issued",
      },
    ],
    guidelines: [
      "Death claim settlement within 30 days of all documents (no investigation)",
      "Investigation completion within 90 days if required",
      "Final settlement within 30 days after investigation",
      "Interest at 2% above bank rate on delayed payments",
      "Penalties for non-compliance: daily fines applicable",
    ],
  },
  "motor-car": {
    name: "Car Insurance (General) - IRDAI Compliant",
    claimSettlement: 12,
    investigation: 15,
    policyIssuance: 7,
    details: [
      {
        step: "Policy Issuance",
        description: "Policy issued within 7 days of proposal",
      },
      {
        step: "Claim Submission",
        description: "Report accident/claim incident",
      },
      {
        step: "Investigation",
        description: "Complete investigation within 30 days",
      },
      {
        step: "Approval & Settlement",
        description: "Settle within 30 days after investigation",
      },
    ],
    guidelines: [
      "Policy issued within 7 days of receiving complete proposal",
      "Further documentation requested in one go within 7 days",
      "Claim settlement within 30 days after investigation completion",
      "Investigation must be completed within 30 days",
      "Interest on delays at 2% above bank rate",
    ],
  },
  "motor-bike": {
    name: "Bike Insurance (General) - IRDAI Compliant",
    claimSettlement: 12,
    investigation: 15,
    policyIssuance: 7,
    details: [
      {
        step: "Policy Issuance",
        description: "Policy issued within 7 days",
      },
      {
        step: "Claim Filing",
        description: "Report bike damage/loss",
      },
      {
        step: "Assessment & Investigation",
        description: "Survey and investigation within 30 days",
      },
      {
        step: "Settlement",
        description: "Final settlement within 30 days post-investigation",
      },
    ],
    guidelines: [
      "Policy issued within 7 days of proposal",
      "Single request for all additional documents (7 days max)",
      "Claim processing within 30 days after investigation",
      "Interest on delayed settlement at 2% above bank rate",
    ],
  },
  travel: {
    name: "Travel Insurance (General) - IRDAI Compliant",
    claimSettlement: 12,
    investigation: 15,
    details: [
      {
        step: "Claim Submission",
        description: "File travel claim with documents",
      },
      {
        step: "Document Review",
        description: "Initial document verification",
      },
      {
        step: "Investigation",
        description: "Investigation if required",
      },
      {
        step: "Settlement",
        description: "Claim settled within 30 days",
      },
    ],
    guidelines: [
      "Claim settlement within 30 days of all documents",
      "Investigation completion within 30 days",
      "Coverage for medical emergencies abroad",
      "Interest at 2% above bank rate for delays",
    ],
  },
  home: {
    name: "Home Insurance (General) - IRDAI Compliant",
    claimSettlement: 12,
    investigation: 15,
    policyIssuance: 7,
    details: [
      {
        step: "Policy Issuance",
        description: "Home insurance policy issued within 7 days",
      },
      {
        step: "Claim Submission",
        description: "Report property damage/theft",
      },
      {
        step: "Survey & Investigation",
        description: "Assessment within 30 days",
      },
      {
        step: "Claim Settlement",
        description: "Settle claim within 30 days",
      },
    ],
    guidelines: [
      "Policy issued within 7 days of receiving proposal",
      "Claim settlement within 30 days after investigation",
      "Investigation completion within 30 days",
      "Interest payable for delays at 2% above bank rate",
    ],
  },
};

// --- TIMELINE STAGES (Used in ClaimDetailModal) ---
export const timelineStages = [
  { key: "submitted", label: "Submitted" },
  { key: "verified", label: "Verified" },
  { key: "reviewed", label: "Reviewed" },
  { key: "investigation", label: "Investigation" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "settled", label: "Settled" },
];

// --- IRDAI TIMELINES DETAILED (Used in ClaimDetailModal) ---
export const irdaiTimelinesDetailed = {
  health: {
    name: "Health Insurance",
    settlementDays: 30,
    investigationDays: 45,
    stages: [
      {
        stage: "Claim Submission",
        days: 0,
        description: "Claim submitted and logged",
      },
      {
        stage: "Document Verification",
        days: 3,
        description: "Initial documents reviewed",
      },
      {
        stage: "Medical Investigation",
        days: 7,
        description: "Medical report and assessment",
      },
      {
        stage: "Assessment & Review",
        days: 14,
        description: "Claim assessment by panel",
      },
      { stage: "Approval/Rejection", days: 30, description: "Final decision" },
    ],
    guidelines:
      "Settlement within 30 days of receiving complete documents. Investigation extended to 45 days if required.",
    interestRate: "12% p.a. on delayed payments after 30 days",
  },
  life: {
    name: "Life Insurance",
    settlementDays: 30,
    investigationDays: 90,
    stages: [
      {
        stage: "Claim Submission",
        days: 0,
        description: "Claim submitted and logged",
      },
      {
        stage: "Document Verification",
        days: 5,
        description: "Submission of required documents",
      },
      {
        stage: "Investigation",
        days: 30,
        description: "Underwriting and investigation",
      },
      {
        stage: "Verification",
        days: 60,
        description: "Additional verification if needed",
      },
      {
        stage: "Settlement",
        days: 90,
        description: "Final approval and settlement",
      },
    ],
    guidelines:
      "Settlement within 30 days for clear cases. Investigation can extend to 90 days.",
    interestRate: "12% p.a. on delayed payments after 30 days",
  },
  "motor-car": {
    name: "Motor Car Insurance",
    settlementDays: 7,
    investigationDays: 30,
    stages: [
      { stage: "Claim Submission", days: 0, description: "Claim registered" },
      {
        stage: "Survey Arrangement",
        days: 1,
        description: "Surveyor assigned",
      },
      {
        stage: "Survey Inspection",
        days: 3,
        description: "Physical inspection",
      },
      { stage: "Assessment", days: 5, description: "Damage assessment" },
      { stage: "Settlement", days: 7, description: "Settlement approval" },
    ],
    guidelines:
      "Aim for 7-day settlement. Inspection and investigation within 30 days.",
    interestRate: "12% p.a. on delayed payments after 7 days",
  },
  "motor-bike": {
    name: "Motor Bike Insurance",
    settlementDays: 7,
    investigationDays: 30,
    stages: [
      { stage: "Claim Submission", days: 0, description: "Claim registered" },
      {
        stage: "Survey Arrangement",
        days: 1,
        description: "Surveyor assigned",
      },
      {
        stage: "Survey Inspection",
        days: 3,
        description: "Physical inspection",
      },
      { stage: "Assessment", days: 5, description: "Damage assessment" },
      { stage: "Settlement", days: 7, description: "Settlement approval" },
    ],
    guidelines:
      "Aim for 7-day settlement. Inspection and investigation within 30 days.",
    interestRate: "12% p.a. on delayed payments after 7 days",
  },
  travel: {
    name: "Travel Insurance",
    settlementDays: 30,
    investigationDays: 30,
    stages: [
      { stage: "Claim Submission", days: 0, description: "Claim submitted" },
      {
        stage: "Document Review",
        days: 5,
        description: "Document verification",
      },
      { stage: "Assessment", days: 15, description: "Claim assessment" },
      { stage: "Verification", days: 25, description: "Final verification" },
      { stage: "Settlement", days: 30, description: "Payment issued" },
    ],
    guidelines: "Settlement within 30 days of complete documentation.",
    interestRate: "12% p.a. on delayed payments after 30 days",
  },
  home: {
    name: "Home Insurance",
    settlementDays: 7,
    investigationDays: 30,
    stages: [
      { stage: "Claim Submission", days: 0, description: "Claim registered" },
      {
        stage: "Survey Arrangement",
        days: 1,
        description: "Surveyor assigned",
      },
      { stage: "Site Inspection", days: 3, description: "Property inspection" },
      { stage: "Assessment", days: 5, description: "Damage assessment" },
      { stage: "Settlement", days: 7, description: "Settlement approval" },
    ],
    guidelines:
      "Aim for 7-day settlement. Survey and investigation within 30 days.",
    interestRate: "12% p.a. on delayed payments after 7 days",
  },
};

// --- UTILITY FUNCTIONS ---
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyShort = (amount) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// --- TABS CONFIGURATION (Used in ClaimsDashboard) ---
export const dashboardTabs = [
  {
    id: "submit",
    label: "Submit Claim",
    icon: "Plus",
    description: "File a new insurance claim",
  },
  {
    id: "track",
    label: "Track Claims",
    icon: "Search",
    description: "Monitor your claim status",
  },
  {
    id: "timelines",
    label: "Timelines",
    icon: "Clock",
    description: "IRDAI Compliant Processing",
  },
];
