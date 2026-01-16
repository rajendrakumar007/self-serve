import axios from "axios";

//Axios Client Configuration

// Determine base URL from environment or default to local development server
const baseURL =
  import.meta?.env?.VITE_API_BASE_URL?.trim() || "http://localhost:4000";

// Create configured axios instance
const axiosClient = axios.create({
  baseURL, // Base URL for all requests
  timeout: 10000, // Request timeout in milliseconds (10 seconds)
});

// Export the configured axios instance for use throughout the app
export default axiosClient;
