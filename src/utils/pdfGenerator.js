import { jsPDF } from "jspdf";
import { pdfConfig, policyLabelMap } from "../data/uiData";

// Helper function to format currency without locale-specific spacing issues
const formatCurrencyForPDF = (amount) => {
  if (!amount) return "N/A";
  const num = parseFloat(amount);
  // Simple number formatting with commas, no special characters
  return Math.floor(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Generate PDF for Claim Submission
 * @param {Object} submittedData - Data from form submission
 * @param {string} fileName - Name for the downloaded file
 */
export const generateSubmissionPDF = (
  submittedData,
  fileName = "Claim-Submission"
) => {
  if (!submittedData) return;

  const { colors, sections } = pdfConfig;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Helper function to format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to add sections
  const addSection = (title, data) => {
    doc.setFillColor(...colors.primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.rect(10, yPosition - 5, pageWidth - 20, 7, "F");
    doc.text(title, 15, yPosition);
    yPosition += 10;

    doc.setTextColor(...colors.textColor);
    doc.setFontSize(10);

    Object.entries(data).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").trim();
      const labelWidth = 50;
      const valueX = labelWidth + 15;
      const maxWidth = pageWidth - 25 - labelWidth;

      doc.setFont(undefined, "bold");
      doc.text(`${label}:`, 15, yPosition);

      doc.setFont(undefined, "normal");
      const valueText = String(value);
      const wrappedText = doc.splitTextToSize(valueText, maxWidth);
      doc.text(wrappedText, valueX, yPosition);

      yPosition += wrappedText.length * 5 + 2;

      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 15;
      }
    });

    yPosition += 5;
  };

  // Title
  doc.setTextColor(...colors.headerColor);
  doc.setFontSize(18);
  doc.text(sections.claimSubmission.title, pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 8;

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text(sections.claimSubmission.subtitle, pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 8;

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(9);
  doc.text(
    `Generated on: ${new Date().toLocaleString("en-IN")}`,
    pageWidth / 2,
    yPosition,
    {
      align: "center",
    }
  );
  yPosition += 12;

  // Claim ID & Status
  addSection("CLAIM ID & STATUS", {
    claimID: submittedData.claimId,
    status: submittedData.status,
    submissionDate: submittedData.submissionDate,
  });

  // Policy Information
  addSection("POLICY INFORMATION", {
    policyType: policyLabelMap[submittedData.policy.type],
    policyNumber: submittedData.policy.policyNumber,
    policyProvider: submittedData.policy.provider,
    sumInsured: `Rs ${formatCurrencyForPDF(submittedData.policy.sumInsured)}`,
  });

  // Claim Details
  addSection("CLAIM DETAILS", {
    claimType: submittedData.claimType,
    claimAmount: `Rs ${formatCurrencyForPDF(
      submittedData.formData.claimAmount
    )}`,
    claimPercentage: `${submittedData.claimPercentage}% of Sum Insured`,
    incidentDate: formatDate(submittedData.formData.incidentDate),
  });

  // Incident Information
  addSection("INCIDENT INFORMATION", {
    location: submittedData.formData.location || "N/A",
    description: submittedData.formData.description.substring(0, 100),
  });

  // Settlement Timeline
  if (submittedData.timelineData) {
    const timelineData = {
      expectedSettlementDate: submittedData.expectedSettlementDate,
      settlementDuration: `${submittedData.estimatedDays} days (after docs received)`,
    };
    addSection("SETTLEMENT TIMELINE", timelineData);

    if (submittedData.timelineData.details) {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text("Process Steps:", 15, yPosition);
      yPosition += 5;

      submittedData.timelineData.details.forEach((detail) => {
        doc.setTextColor(120, 120, 120);
        doc.setFontSize(9);
        const detailText = `Day ${detail.days}: ${detail.step} - ${detail.description}`;
        const wrappedText = doc.splitTextToSize(detailText, pageWidth - 30);
        doc.text(wrappedText, 20, yPosition);
        yPosition += wrappedText.length * 4 + 1;

        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 15;
        }
      });
    }
  }

  // Documents Section
  if (submittedData.documents && submittedData.documents.length > 0) {
    yPosition += 5;
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFillColor(...colors.primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.rect(10, yPosition - 5, pageWidth - 20, 7, "F");
    doc.text("ATTACHED DOCUMENTS", 15, yPosition);
    yPosition += 10;

    doc.setTextColor(...colors.textColor);
    doc.setFontSize(10);
    submittedData.documents.forEach((doc_name, idx) => {
      doc.text(`${idx + 1}. ${doc_name}`, 15, yPosition);
      yPosition += 5;
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 15;
      }
    });
  }

  // Footer
  if (yPosition > pageHeight - 30) {
    doc.addPage();
    yPosition = pageHeight - 30;
  }

  doc.setFillColor(...colors.lightGray);
  doc.rect(0, pageHeight - 25, pageWidth, 25, "F");

  doc.setTextColor(...colors.headerColor);
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text(
    "IMPORTANT: Keep this receipt for your records",
    pageWidth / 2,
    pageHeight - 18,
    {
      align: "center",
    }
  );

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.text(
    "Use your Claim ID to track your claim status.",
    pageWidth / 2,
    pageHeight - 12,
    {
      align: "center",
    }
  );

  // Download PDF
  const pdfBlob = doc.output("blob");
  const url = window.URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}-${new Date().getTime()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate PDF for Claim Details (Track Claims)
 * @param {Object} claim - Claim data object
 * @param {Function} formatDate - Date formatting function
 * @param {Object} formatCurrency - Currency formatting function
 */
export const generateDetailsPDF = (claim, formatDate, formatCurrency) => {
  if (!claim) return;

  const { colors, sections } = pdfConfig;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Helper function to add section
  const addSection = (title, data) => {
    doc.setFillColor(...colors.primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.rect(10, yPosition - 5, pageWidth - 20, 7, "F");
    doc.text(title, 15, yPosition);
    yPosition += 10;

    doc.setTextColor(...colors.textColor);
    doc.setFontSize(10);

    Object.entries(data).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").trim();
      const labelWidth = 50;
      const valueX = labelWidth + 15;
      const maxWidth = pageWidth - 25 - labelWidth;

      doc.setFont(undefined, "bold");
      doc.text(`${label}:`, 15, yPosition);

      doc.setFont(undefined, "normal");
      const valueText = String(value);
      const wrappedText = doc.splitTextToSize(valueText, maxWidth);
      doc.text(wrappedText, valueX, yPosition);

      yPosition += wrappedText.length * 5 + 2;

      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 15;
      }
    });

    yPosition += 5;
  };

  // Title
  doc.setTextColor(...colors.headerColor);
  doc.setFontSize(18);
  doc.text(sections.claimDetails.title, pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 8;

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text(sections.claimDetails.subtitle, pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 8;

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(9);
  doc.text(
    `Generated on: ${new Date().toLocaleString("en-IN")}`,
    pageWidth / 2,
    yPosition,
    {
      align: "center",
    }
  );
  yPosition += 12;

  // Claim Information
  addSection("CLAIM INFORMATION", {
    claimID: claim.id,
    customerID: claim.customerId || "CUST-" + claim.id.split("-")[1],
    policyID: claim.policyId,
    claimStatus: claim.status,
    claimDate:
      claim.status === "Settled"
        ? claim.timeline?.submitted
          ? formatDate(claim.timeline.submitted)
          : formatDate(claim.submissionDate)
        : "N/A",
  });

  // Claim Details
  addSection("CLAIM DETAILS", {
    claimedAmount: `Rs ${formatCurrencyForPDF(claim.claimAmount)}`,
    approvedAmount: claim.approvedAmount
      ? `Rs ${formatCurrencyForPDF(claim.approvedAmount)}`
      : "N/A",
    incidentDate: formatDate(claim.incidentDate),
    submissionDate: formatDate(claim.submissionDate),
    location: claim.location || "N/A",
  });

  // Description
  if (claim.description) {
    addSection("DESCRIPTION", {
      details: claim.description.substring(0, 200),
    });
  }

  // Documents
  if (claim.documents && claim.documents.length > 0) {
    doc.setFillColor(...colors.primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.rect(10, yPosition - 5, pageWidth - 20, 7, "F");
    doc.text("ATTACHED DOCUMENTS", 15, yPosition);
    yPosition += 10;

    doc.setTextColor(...colors.textColor);
    doc.setFontSize(10);
    claim.documents.forEach((docItem, idx) => {
      doc.text(`${idx + 1}. ${docItem}`, 18, yPosition);
      yPosition += 5;
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 15;
      }
    });
    yPosition += 5;
  }

  // Rejection Reason (if applicable)
  if (claim.rejectionReason) {
    addSection("REJECTION REASON", {
      reason: claim.rejectionReason,
    });
  }

  // Footer
  if (yPosition > pageHeight - 30) {
    doc.addPage();
    yPosition = pageHeight - 30;
  }

  doc.setFillColor(...colors.lightGray);
  doc.rect(0, pageHeight - 25, pageWidth, 25, "F");

  doc.setTextColor(...colors.headerColor);
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text(
    "IMPORTANT: Keep this receipt for your records",
    pageWidth / 2,
    pageHeight - 18,
    {
      align: "center",
    }
  );

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.text(
    "Use your Claim ID to track your claim status.",
    pageWidth / 2,
    pageHeight - 12,
    {
      align: "center",
    }
  );

  // Save PDF
  const pdfBlob = doc.output("blob");
  const url = window.URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Claim-${claim.id}-Details.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
