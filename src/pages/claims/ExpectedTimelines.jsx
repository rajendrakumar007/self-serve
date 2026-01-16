import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
  Briefcase,
  Car,
  Bike,
  Plane,
  Globe,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import { expectedTimelines } from "../../utils/claims/expectedTimelines";

const policyLabels = {
  health: "Health Insurance",
  life: "Life Insurance",
  car: "Car Insurance",
  bike: "Bike Insurance",
  airpass: "Air Pass",
  travel: "Travel Insurance",
};

const policyIcons = {
  health: Heart,
  life: Briefcase,
  car: Car,
  bike: Bike,
  airpass: Plane,
  travel: Globe,
};

const ExpectedTimelines = () => {
  const [selectedType, setSelectedType] = useState("health");
  const selectedData = expectedTimelines[selectedType];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bgPrimary dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-textPrimary dark:text-white mb-1">
              Claim Settlement Timeline Guide
            </h1>
            <p className="text-sm text-textSecondary dark:text-gray-400">
              Understand the typical processing time for different policy types
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex flex-wrap gap-2">
            {Object.entries(expectedTimelines).map(([type, data]) => {
              const IconComponent = policyIcons[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type
                      ? "bg-primary text-white shadow-lg"
                      : "bg-bgCard dark:bg-gray-800 text-textPrimary dark:text-white border border-borderDefault dark:border-gray-700 hover:border-primary/50"
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{policyLabels[type]}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Timeline Content */}
          {selectedData && (
            <div className="space-y-4">
              {/* Header Card */}
              <div className="bg-bgCard dark:bg-gray-800 border border-borderDefault dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-b border-borderDefault dark:border-gray-700 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const IconComponent = policyIcons[selectedType];
                      return (
                        <IconComponent
                          size={32}
                          className="text-primary flex-shrink-0"
                        />
                      );
                    })()}
                    <div>
                      <h2 className="text-lg font-bold text-textPrimary dark:text-white">
                        {selectedData.title}
                      </h2>
                      <p className="text-xs text-textSecondary dark:text-gray-400 mt-0.5">
                        Policy Type:{" "}
                        {selectedType.charAt(0).toUpperCase() +
                          selectedType.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-primary/15 dark:bg-primary/25 px-3 py-2 rounded-full">
                    <Clock size={16} className="text-primary" />
                    <span className="font-bold text-primary text-sm">
                      {selectedData.expectedDays} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="bg-bgCard dark:bg-gray-800 border border-borderDefault dark:border-gray-700 rounded-xl p-5">
                <h3 className="font-bold text-sm text-textPrimary dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Processing Timeline
                </h3>
                <div className="relative space-y-4">
                  {selectedData.steps.map((step, index) => (
                    <div key={step.step} className="flex gap-3">
                      <div className="relative flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/60 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {step.step}
                        </div>
                        {index < selectedData.steps.length - 1 && (
                          <div className="w-1 flex-grow bg-gradient-to-b from-primary/50 to-primary/10 dark:from-primary/40 dark:to-primary/5 mt-2 min-h-12" />
                        )}
                      </div>
                      <div className="flex-1 pt-1 pb-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1.5">
                          <h4 className="text-sm font-semibold text-textPrimary dark:text-white">
                            {step.title}
                          </h4>
                          <span className="text-xs font-medium bg-primary/15 dark:bg-primary/25 text-primary px-2.5 py-1 rounded-full mt-1 md:mt-0 w-fit">
                            {selectedData.isHourly
                              ? step.hours === 0
                                ? "Immediate"
                                : `${step.hours}h`
                              : step.days === 0
                              ? "Same Day"
                              : `Day ${step.days}`}
                          </span>
                        </div>
                        <p className="text-xs text-textSecondary dark:text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="mt-6 bg-infoBg dark:bg-info/20 border border-info/40 rounded-xl p-4">
            <h3 className="font-bold text-info mb-3 flex items-center gap-2 text-sm">
              <Info size={16} />
              Important Notes
            </h3>
            <ul className="space-y-2 text-xs text-textSecondary dark:text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle
                  size={14}
                  className="text-info flex-shrink-0 mt-0.5"
                />
                <span>
                  Timelines are indicative and may vary based on claim
                  complexity and documentation completeness
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  size={18}
                  className="text-info flex-shrink-0 mt-0.5"
                />
                <span>Incomplete documentation may delay processing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  size={18}
                  className="text-info flex-shrink-0 mt-0.5"
                />
                <span>
                  Public holidays and weekends are not counted in processing
                  days
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  size={18}
                  className="text-info flex-shrink-0 mt-0.5"
                />
                <span>
                  You will receive email and SMS notifications at each stage of
                  processing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle
                  size={14}
                  className="text-warning flex-shrink-0 mt-0.5"
                />
                <span>
                  If payment is delayed beyond agreed timelines, interest at 2%
                  above prevailing bank rate will be applied
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpectedTimelines;
