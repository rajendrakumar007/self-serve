import React from "react";
import { Plus, Clock, Search } from "lucide-react";

/**
 * TabNavigation Component - Reusable tab navigation interface
 * Used in Dashboard for switching between Submit, Track, and Timelines
 */

// Map icon strings to lucide icon components for fallback
const iconMap = { Plus, Clock, Search };

export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {tabs.map((tab) => {
          // Get icon - handle both component and string types
          const Icon =
            typeof tab.icon === "string" ? iconMap[tab.icon] : tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`p-6 text-left border-r border-gray-200 dark:border-gray-700 last:border-r-0 transition-all ${
                isActive
                  ? "bg-blue-50 dark:bg-gray-700 border-l-4 border-l-blue-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-blue-200 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {Icon ? (
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-blue-600 dark:text-blue-300" : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                  ) : null}
                </div>
                <div>
                  <h3
                    className={`font-semibold mb-1 ${
                      isActive ? "text-blue-900 dark:text-blue-300" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {tab.label}
                  </h3>
                  <p
                    className={`text-sm ${
                      isActive ? "text-blue-700 dark:text-blue-200" : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {tab.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
