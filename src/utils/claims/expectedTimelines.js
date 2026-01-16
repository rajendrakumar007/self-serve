export const expectedTimelines = {
  health: {
    title: "Health Insurance Claim",
    expectedDays: 1,
    expectedHours: 2,
    isHourly: true,
    steps: [
      {
        step: 1,
        title: "Claim Submitted",
        description: "Your claim has been received and logged in our system",
        hours: 0,
      },
      {
        step: 2,
        title: "Document Verification",
        description: "Verification of submitted medical documents and bills",
        hours: 0.5,
      },
      {
        step: 3,
        title: "Medical Review",
        description: "Review by our medical team for treatment validity",
        hours: 1,
      },
      {
        step: 4,
        title: "Claim Assessment",
        description: "Assessment of claim amount against policy terms",
        hours: 1.5,
      },
      {
        step: 5,
        title: "Approval Process",
        description: "Final approval by claims authority",
        hours: 1.75,
      },
      {
        step: 6,
        title: "Settlement",
        description: "Amount transferred to your registered bank account",
        hours: 2,
      },
    ],
  },
  life: {
    title: "Life Insurance Claim",
    expectedDays: 7,
    steps: [
      {
        step: 1,
        title: "Claim Submitted",
        description: "Your claim has been received and logged in our system",
        days: 0,
      },
      {
        step: 2,
        title: "Document Verification",
        description: "Verification of death certificate and identity documents",
        days: 2,
      },
      {
        step: 3,
        title: "Investigation",
        description: "Claim investigation as per policy terms",
        days: 4,
      },
      {
        step: 4,
        title: "Nominee Verification",
        description: "Verification of nominee details and bank account",
        days: 5,
      },
      {
        step: 5,
        title: "Claim Assessment",
        description: "Final assessment by claims committee",
        days: 6,
      },
      {
        step: 6,
        title: "Settlement",
        description: "Amount transferred to nominee bank account",
        days: 7,
      },
    ],
  },
  car: {
    title: "Car Insurance Claim",
    expectedDays: 7,
    steps: [
      {
        step: 1,
        title: "Claim Submitted",
        description: "Your claim has been received and logged in our system",
        days: 0,
      },
      {
        step: 2,
        title: "Surveyor Assignment",
        description: "A surveyor is assigned to inspect the vehicle",
        days: 1,
      },
      {
        step: 3,
        title: "Vehicle Inspection",
        description: "Physical inspection of damaged vehicle",
        days: 2,
      },
      {
        step: 4,
        title: "Damage Assessment",
        description: "Assessment of repair costs and claim validity",
        days: 4,
      },
      {
        step: 5,
        title: "Approval Process",
        description: "Claim approval and garage authorization",
        days: 6,
      },
      {
        step: 6,
        title: "Settlement/Repair",
        description: "Cashless repair or reimbursement settlement",
        days: 7,
      },
    ],
  },
  bike: {
    title: "Bike Insurance Claim",
    expectedDays: 7,
    steps: [
      {
        step: 1,
        title: "Claim Submitted",
        description: "Your claim has been received and logged in our system",
        days: 0,
      },
      {
        step: 2,
        title: "Surveyor Assignment",
        description: "A surveyor is assigned to inspect the vehicle",
        days: 1,
      },
      {
        step: 3,
        title: "Vehicle Inspection",
        description: "Physical inspection of damaged vehicle",
        days: 2,
      },
      {
        step: 4,
        title: "Damage Assessment",
        description: "Assessment of repair costs and claim validity",
        days: 4,
      },
      {
        step: 5,
        title: "Approval Process",
        description: "Claim approval and garage authorization",
        days: 6,
      },
      {
        step: 6,
        title: "Settlement/Repair",
        description: "Cashless repair or reimbursement settlement",
        days: 7,
      },
    ],
  },
  airpass: {
    title: "Air Pass Claim",
    expectedDays: 7,
    steps: [
      {
        step: 1,
        title: "Claim Submitted",
        description: "Your claim has been received and logged in our system",
        days: 0,
      },
      {
        step: 2,
        title: "Flight Verification",
        description: "Verification of flight cancellation/delay details",
        days: 1,
      },
      {
        step: 3,
        title: "Document Review",
        description: "Review of boarding pass and airline communication",
        days: 2,
      },
      {
        step: 4,
        title: "Claim Assessment",
        description: "Assessment against air pass terms",
        days: 4,
      },
      {
        step: 5,
        title: "Approval",
        description: "Approval of compensation amount",
        days: 6,
      },
      {
        step: 6,
        title: "Settlement",
        description: "Credit to your account or voucher issued",
        days: 7,
      },
    ],
  },
  travel: {
    title: "Travel Insurance Claim",
    expectedDays: 7,
    steps: [
      {
        step: 1,
        title: "Claim Submitted",
        description: "Your claim has been received and logged in our system",
        days: 0,
      },
      {
        step: 2,
        title: "Document Verification",
        description: "Verification of travel documents and incident reports",
        days: 1,
      },
      {
        step: 3,
        title: "Incident Investigation",
        description: "Investigation of claim circumstances",
        days: 3,
      },
      {
        step: 4,
        title: "Expense Verification",
        description: "Verification of medical bills or lost item values",
        days: 5,
      },
      {
        step: 5,
        title: "Claim Assessment",
        description: "Final assessment against policy coverage",
        days: 6,
      },
      {
        step: 6,
        title: "Settlement",
        description: "Amount transferred to your bank account",
        days: 7,
      },
    ],
  },
};

export const getExpectedSettlement = (policyType, submissionDate) => {
  const timeline = expectedTimelines[policyType] || expectedTimelines.health;
  const submission = new Date(submissionDate);
  const settlement = new Date(submission);

  // For health policies with hourly timeline
  // Since the timeline is 2 hours (same day), just return the submission date
  if (timeline.isHourly) {
    // Health claims are same-day, so return submission date
    return settlement.toISOString().split("T")[0];
  } else {
    // For other policies with daily timeline
    settlement.setDate(settlement.getDate() + timeline.expectedDays);
    return settlement.toISOString().split("T")[0];
  }
};
