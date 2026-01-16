import React from "react";

const StatusBadge = ({ status }) => {
  const config = {
    SUBMITTED: {
      bg: "bg-infoBg dark:bg-info/20",
      text: "text-info",
      label: "Submitted",
    },
    Pending: {
      bg: "bg-warningBg dark:bg-warning/20",
      text: "text-warning",
      label: "In Progress",
    },
    "In Progress": {
      bg: "bg-warningBg dark:bg-warning/20",
      text: "text-warning",
      label: "In Progress",
    },
    Approved: {
      bg: "bg-successBg dark:bg-success/20",
      text: "text-success",
      label: "Approved",
    },
    Settled: {
      bg: "bg-successBg dark:bg-success/20",
      text: "text-success",
      label: "Approved",
    },
    Rejected: {
      bg: "bg-dangerBg dark:bg-danger/20",
      text: "text-danger",
      label: "Rejected",
    },
  };
  const { bg, text, label } = config[status] || config.SUBMITTED;
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
