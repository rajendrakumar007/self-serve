import React from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  CheckSquare,
} from "lucide-react";

/**
 * StatCard Component - Displays individual statistics
 * Used in Track Claims stats grid
 */

// Map icon names (strings) to actual icon components
const iconMap = {
  FileText: FileText,
  CheckCircle: CheckCircle,
  Clock: Clock,
  XCircle: XCircle,
  Search: Search,
  CheckSquare: CheckSquare,
};

// Map color names to Tailwind classes
const colorMap = {
  gray: {
    bg: "bg-gray-50 dark:bg-gray-700",
    text: "text-gray-600 dark:text-gray-300",
    icon: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-600",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    icon: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
    text: "text-yellow-600 dark:text-yellow-400",
    icon: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    icon: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
};

export default function StatCard({
  label,
  value,
  icon = "FileText",
  color = "gray",
}) {
  // Get icon component from map using icon name string
  const IconComponent = iconMap[icon] || FileText;

  // Get color configuration from map
  const colorConfig = colorMap[color] || colorMap.gray;

  return (
    <div
      className={`${colorConfig.bg} border ${colorConfig.border} rounded-xl p-4 md:p-6 shadow-sm`}
    >
      {/* Stat Display with Icon */}
      <div className="flex items-start justify-between">
        {/* Label and Value */}
        <div>
          <p
            className={`text-xs md:text-sm ${colorConfig.text} font-medium mb-1`}
          >
            {label}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        {/* Icon */}
        <IconComponent
          className={`w-6 h-6 md:w-8 md:h-8 ${colorConfig.icon}`}
        />
      </div>
    </div>
  );
}
