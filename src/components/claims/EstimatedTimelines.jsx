import React, { useState } from "react";
import {
  X,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Info,
  AlertCircle,
  CheckCircle2,
  Zap,
  Search,
  DollarSign,
  Eye,
  FileCheck,
  FileStack,
  Shield,
} from "lucide-react";
import {
  iconMap,
  statusStyles,
  policyLabels,
  irdaiTimelines,
  formatCurrency,
  formatDate,
} from "../../store/claimsConstants";
import { irdaiFrameworkGuidelines } from "../../data/uiData";

// --- COMPONENT: TIMELINE VISUALIZATION ---
function TimelineDisplay({ policyType }) {
  const data = irdaiTimelines[policyType];
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-600 font-semibold">
            Settlement Timeline
          </p>
          <p className="text-2xl font-bold text-blue-900">
            {data.claimSettlement} days
          </p>
          <p className="text-xs text-blue-700 mt-1">
            After all documents received
          </p>
        </div>
        {data.investigation && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <p className="text-xs text-orange-600 font-semibold">
              Investigation (if required)
            </p>
            <p className="text-2xl font-bold text-orange-900">
              {data.investigation} days
            </p>
            <p className="text-xs text-orange-700 mt-1">
              Maximum completion time
            </p>
          </div>
        )}
        {data.policyIssuance && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <p className="text-xs text-green-600 font-semibold">
              Policy Issuance
            </p>
            <p className="text-3xl font-bold text-green-900">
              {data.policyIssuance} days
            </p>
            <p className="text-xs text-green-700 mt-1">From proposal receipt</p>
          </div>
        )}
      </div>

      {/* Timeline Steps */}
      <div className="bg-white dark:bg-black-800 p-6 rounded-xl border border-black-200 dark:border-black-700">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <Clock size={20} className="text-blue-600 dark:text-blue-400" /> Processing Timeline
        </h3>
        <div className="space-y-4">
          {data.details.map((detail, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                {idx < data.details.length - 1 && (
                  <div className="w-0.5 h-12 bg-blue-200 dark:bg-blue-900 mt-2" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{detail.step}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{detail.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IRDAI Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-900 dark:text-blue-300">
          <Info size={20} /> IRDAI Compliance Guidelines
        </h3>
        <ul className="space-y-3">
          {data.guidelines.map((guideline, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle2
                size={16}
                className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
              />
              {guideline}
            </li>
          ))}
        </ul>
      </div>

      {/* Interest on Delays */}
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
        <h3 className="font-bold mb-3 flex items-center gap-2 text-red-900 dark:text-red-300">
          <AlertCircle size={20} /> Late Payment Interest
        </h3>
        <p className="text-sm text-red-800 dark:text-red-200">
          If payment is delayed beyond the agreed timelines, insurers must pay
          interest at <strong>2% above the prevailing bank rate</strong> from
          the date of receipt of the last necessary document.
        </p>
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD COMPONENT ---
export default function EstimatedTimelines() {
  const [selectedPolicyType, setSelectedPolicyType] = useState("health");

  return (
    <div className="space-y-6">
      {/* Policy Type Selection */}
      <div className="flex gap-4 flex-wrap">
        {Object.keys(irdaiTimelines).map((pType) => (
          <button
            key={pType}
            onClick={() => setSelectedPolicyType(pType)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedPolicyType === pType
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {policyLabels[pType]}
          </button>
        ))}
      </div>

      {/* Timeline Display */}
      <TimelineDisplay policyType={selectedPolicyType} />

      {/* General Guidelines */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          IRDAI Policy Framework
        </h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400 p-4 rounded">
          <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
            About IRDAI Regulations
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            The Insurance Regulatory and Development Authority of India (IRDAI)
            mandates specific timelines for claim processing across all
            insurance sectors to ensure fair and timely settlements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {irdaiFrameworkGuidelines.map((item, idx) => {
            const IconComponent = eval(item.icon);
            return (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent size={28} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.content}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <h3 className="font-bold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
            <Shield size={20} className="text-red-600 dark:text-red-400" />
            Penalties for Non-Compliance
          </h3>
          <p className="text-sm text-red-800 dark:text-red-200">
            Insurers who fail to adhere to IRDAI-mandated timelines face daily
            fines and penalties, protecting consumer interests and ensuring
            timely claim settlements.
          </p>
        </div>
      </div>
    </div>
  );
}
