// Dashboard Tabs Configuration
export const dashboardTabsConfig = [
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

// Policy Type Labels
export const policyLabelMap = {
  health: "Health Insurance",
  "motor-car": "Car Insurance",
  "motor-bike": "Bike Insurance",
  travel: "Travel Insurance",
  life: "Life Insurance",
  home: "Home Insurance",
};

// Guidelines for IRDAI Framework
export const irdaiFrameworkGuidelines = [
  {
    title: "Standard Settlement",
    icon: "Clock",
    content:
      "Most claims must be settled within 30 days of receiving all required documents.",
  },
  {
    title: "Investigation Period",
    icon: "Search",
    content:
      "If investigation is required, it must be completed within 30-90 days depending on policy type.",
  },
  {
    title: "Interest on Delays",
    icon: "DollarSign",
    content:
      "Delayed settlements incur interest at 2% above the prevailing bank rate.",
  },
  {
    title: "Free-Look Period",
    icon: "Eye",
    content:
      "Policyholders have 30 days to review and cancel policies if they find discrepancies.",
  },
  {
    title: "No Document Rejection",
    icon: "FileCheck",
    content:
      "Health claims cannot be rejected for missing documents or delayed intimation.",
  },
  {
    title: "Policy Issuance",
    icon: "FileStack",
    content:
      "General Insurance policies must be issued within 7 days of proposal receipt.",
  },
];

// PDF Configuration and Colors
export const pdfConfig = {
  colors: {
    primaryColor: [25, 103, 210], // Blue
    headerColor: [15, 71, 165], // Dark Blue
    textColor: [40, 40, 40], // Dark Gray
    lightGray: [242, 242, 242], // Light Gray
  },
  sections: {
    claimSubmission: {
      title: "CLAIM SUBMISSION RECEIPT",
      subtitle: "Insurance Claims Management System",
    },
    claimDetails: {
      title: "CLAIM DETAILS REPORT",
      subtitle: "Insurance Claims Management System",
    },
  },
};

// Form State Initial Values
export const formInitialState = {
  incidentDate: "",
  claimAmount: "",
  description: "",
  location: "",
};

// Document Upload Configuration
export const documentUploadConfig = {
  maxFiles: 10,
  allowedFormats: ["pdf", "doc", "docx", "xls", "xlsx"],
  maxFileSize: 5 * 1024 * 1024, // 5MB
};
