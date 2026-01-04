import React from "react";
import "./App.css";
import ClaimsDashboard from "./Pages/ClaimsDashboard";
import { ThemeProvider } from "./context/ThemeContext";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen p-4 bg-white">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
            <p className="text-gray-700 font-mono text-sm mb-4 p-4 bg-red-50 rounded border border-red-200 overflow-auto">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return (
      <ThemeProvider>
        <div className="w-full min-h-screen">
          <ClaimsDashboard />
        </div>
      </ThemeProvider>
    );
  }
}

export default ErrorBoundary;
