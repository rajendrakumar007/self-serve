import { expectedTimelines,getExpectedSettlement } from "./expectedTimelines";

export const generateClaimPdf = (claimData) => {
  const timeline =
    expectedTimelines[claimData.policyType] || expectedTimelines.health;
  const expectedDate = getExpectedSettlement(
    claimData.policyType,
    claimData.submissionDate
  );

  // Calculate settlement date display based on claim status
  const getSettlementDisplay = () => {
    if (claimData.status === "Rejected") {
      return "Rejected";
    } else if (claimData.status === "Approved" && claimData.validatedAt) {
      return claimData.validatedAt;
    } else if (claimData.status === "Settled" && claimData.settledAt) {
      return claimData.settledAt;
    } else {
      // For SUBMITTED, Pending, In Progress - calculate based on timeline
      return expectedDate;
    }
  };

  const content = `
================================================================================
                           CLAIM SUBMISSION RECEIPT
================================================================================

CLAIM DETAILS
--------------------------------------------------------------------------------
Claim ID:           ${claimData.claimId}
Status:             ${claimData.status}
Submission Date:    ${claimData.submissionDate}
Expected Settlement: ${getSettlementDisplay()}

POLICY INFORMATION
--------------------------------------------------------------------------------
Policy ID:          ${claimData.policyId}
Policy Type:        ${claimData.policyType.toUpperCase()}
Sum Insured:        ₹${claimData.sumInsured?.toLocaleString("en-IN") || "N/A"}

CLAIM INFORMATION
--------------------------------------------------------------------------------
Claim Amount:       ₹${claimData.claimAmount?.toLocaleString("en-IN")}
Incident Date:      ${claimData.incidentDate}
Location:           ${claimData.location}

Description:
${claimData.description}

DOCUMENTS SUBMITTED
--------------------------------------------------------------------------------
${
  claimData.documents
    ?.map((doc, i) => `${i + 1}. ${typeof doc === "string" ? doc : doc.name}`)
    .join("\n") || "No documents"
}

EXPECTED TIMELINE - ${timeline.title}
--------------------------------------------------------------------------------
${timeline.steps
  .map((s) => `Day ${s.days}: ${s.title}\n         ${s.description}`)
  .join("\n\n")}

--------------------------------------------------------------------------------
User ID: ${claimData.userId}
Generated on: ${new Date().toLocaleString("en-IN")}
================================================================================
  `;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Claim-${claimData.claimId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// For proper PDF generation, install jspdf: npm install jspdf
export const generateClaimPdfAdvanced = async (claimData) => {
  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const timeline =
      expectedTimelines[claimData.policyType] || expectedTimelines.health;
    const expectedDate = getExpectedSettlement(
      claimData.policyType,
      claimData.submissionDate
    );

    // Helper function to calculate settlement date based on claim status
    const getSettlementDisplay = () => {
      if (claimData.status === "Rejected") {
        return "Rejected";
      } else if (claimData.status === "Approved" && claimData.validatedAt) {
        return claimData.validatedAt;
      } else if (claimData.status === "Settled" && claimData.settledAt) {
        return claimData.settledAt;
      } else {
        // For SUBMITTED, Pending, In Progress - calculate based on timeline
        return expectedDate;
      }
    };

    // Helper function to format currency (avoid special characters)
    const formatCurrency = (amount) => {
      if (!amount) return "N/A";
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Helper function to create section headers with blue background
    const addSectionHeader = (title, yPosition) => {
      // Blue background rectangle
      doc.setFillColor(37, 99, 235); // Blue
      doc.rect(20, yPosition - 5, 170, 8, "F");

      // Section title text - bold and white
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.setTextColor(255, 255, 255); // White text
      doc.text(title, 25, yPosition + 1);

      return yPosition + 10;
    };

    // Helper function to add label-value pairs with bold labels and values
    const addLabelValue = (label, value, yPosition, fontSize = 10) => {
      doc.setFontSize(fontSize);

      // Bold label
      doc.setFont(undefined, "bold");
      doc.setTextColor(37, 99, 235); // Blue for labels
      doc.text(`${label}:`, 20, yPosition);

      // Bold value
      doc.setFont(undefined, "bold");
      doc.setTextColor(51, 65, 85); // Dark text for values
      doc.text(value, 65, yPosition);

      return yPosition + 7;
    };

    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.setFont(undefined, "bold");
    doc.text("CLAIM SUBMISSION RECEIPT", 105, 20, { align: "center" });

    doc.setDrawColor(37, 99, 235);
    doc.line(20, 25, 190, 25);

    // Claim Details Section
    let yPos = 35;
    yPos = addSectionHeader("CLAIM DETAILS", yPos);

    yPos = addLabelValue("Claim ID", claimData.claimId, yPos);
    yPos = addLabelValue("Status", claimData.status, yPos);
    yPos = addLabelValue("Submission Date", claimData.submissionDate, yPos);
    yPos = addLabelValue("Expected Settlement", getSettlementDisplay(), yPos);
    yPos += 5;

    // Policy Information Section
    yPos = addSectionHeader("POLICY INFORMATION", yPos);

    yPos = addLabelValue("Policy ID", claimData.policyId, yPos);
    yPos = addLabelValue(
      "Policy Type",
      claimData.policyType.toUpperCase(),
      yPos
    );
    yPos = addLabelValue(
      "Sum Insured",
      `Rs. ${formatCurrency(claimData.sumInsured)}`,
      yPos
    );
    yPos += 5;

    // Claim Information Section
    yPos = addSectionHeader("CLAIM INFORMATION", yPos);

    yPos = addLabelValue(
      "Claim Amount",
      `Rs. ${formatCurrency(claimData.claimAmount)}`,
      yPos
    );
    yPos = addLabelValue("Incident Date", claimData.incidentDate, yPos);
    yPos = addLabelValue("Location", claimData.location, yPos);
    yPos += 3;

    // Description with label
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(37, 99, 235); // Blue for label
    doc.text("Description:", 20, yPos);
    yPos += 5;

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(claimData.description, 170);
    doc.text(descLines, 20, yPos);
    yPos += descLines.length * 4 + 5;

    // Documents Section
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }

    yPos = addSectionHeader("DOCUMENTS SUBMITTED", yPos);

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.setTextColor(51, 65, 85);
    claimData.documents?.forEach((doc_item, i) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      const name = typeof doc_item === "string" ? doc_item : doc_item.name;
      doc.text(`${i + 1}. ${name}`, 20, yPos);
      yPos += 5;
    });
    yPos += 8;

    // Timeline Section - ensure it fits on one page
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    yPos = addSectionHeader(`EXPECTED TIMELINE - ${timeline.title}`, yPos);

    doc.setFontSize(8.5);
    timeline.steps.forEach((step) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont(undefined, "bold");
      doc.setTextColor(37, 99, 235);
      const timeLabel = timeline.isHourly
        ? `${step.hours}h`
        : `Day ${step.days}`;
      doc.text(`${timeLabel}: ${step.title}`, 20, yPos);
      doc.setFont(undefined, "normal");
      doc.setTextColor(100, 116, 139);
      yPos += 4;
      const stepLines = doc.splitTextToSize(step.description, 160);
      doc.text(stepLines, 25, yPos);
      yPos += stepLines.length * 3.5 + 3;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont(undefined, "normal");
    doc.text(
      `User ID: ${claimData.userId} | Generated: ${new Date().toLocaleString(
        "en-IN"
      )}`,
      105,
      285,
      { align: "center" }
    );

    doc.save(`Claim-${claimData.claimId}.pdf`);
  } catch {
    // Fallback to text file if jspdf not installed
    generateClaimPdf(claimData);
  }
};
