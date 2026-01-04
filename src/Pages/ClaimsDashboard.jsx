import React, { useState, useEffect, useMemo } from "react";
import { Plus, Clock, Search, ArrowRight, Info, Moon, Sun } from "lucide-react";
import { dashboardTabsConfig } from "../data/uiData";
import { useTheme } from "../context/ThemeContext";
import {
  getCombinedClaims,
  getTotalClaimAmount,
  getSettledAmount,
  getActiveClaims,
  getClaimsStatistics,
} from "../store/claimsStatistics";
import QuickStats from "../components/common/QuickStats";
import TabNavigation from "../components/common/TabNavigation";
import SubmitClaimForm from "../components/claims/SubmitClaimForm";
import TrackCliams from "../components/claims/TrackCliams";
import EstimatedTimelines from "../components/claims/EstimatedTimelines";
import claimsDataFile from "../data/claims.json";

// Map icon strings to lucide icon components
const iconMap = { Plus, Clock, Search };
const tabs = dashboardTabsConfig.map((tab) => ({
  ...tab,
  icon: iconMap[tab.icon],
}));

export default function ClaimsDashboard() {
  const [activeTab, setActiveTab] = useState(null);
  const [allClaims, setAllClaims] = useState([]);
  const { isDarkMode, toggleTheme } = useTheme();

  // Load combined claims data
  useEffect(() => {
    const combined = getCombinedClaims(claimsDataFile.claims);
    setAllClaims(combined);
  }, []);

  // Calculate statistics
  const stats = useMemo(
    () => ({
      active: getActiveClaims(allClaims),
      totalAmount: getTotalClaimAmount(allClaims),
      settledAmount: getSettledAmount(allClaims),
      approved: getClaimsStatistics(allClaims).approved,
    }),
    [allClaims]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Title and Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-200 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Claims Management Portal
              </h1>
              <p className="text-blue-100 dark:text-gray-300">
                Submit, track, and manage all your insurance claims with IRDAI
                compliance
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-colors shadow-md"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              {/* Display quick statistics */}
              <QuickStats
                stats={{ pending: stats.active }}
                totalAmount={stats.totalAmount}
                settledAmount={stats.settledAmount}
                approved={stats.approved}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation Buttons */}
        <div className="mb-8">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Render Selected Tab Content */}
        {activeTab ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 lg:p-8">
              {activeTab === "submit" && (
                <SubmitClaimForm onTrackClick={() => setActiveTab("track")} />
              )}

              {activeTab === "track" && <TrackCliams />}

              {activeTab === "timelines" && <EstimatedTimelines />}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden">
            <div className="p-12 lg:p-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center">
                  <Info className="w-8 h-8 text-blue-600 dark:text-gray-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Select an Option
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Choose one of the tabs above to submit a new claim, track your
                existing claims, or view IRDAI settlement timelines.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
