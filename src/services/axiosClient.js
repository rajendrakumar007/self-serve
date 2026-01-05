import axios from "axios";

/**
 * Axios Client Configuration
 *
 * Centralized HTTP client for making API requests throughout the application.
 * Configured with base URL, timeout, and other default settings.
 *
 * Features:
 * - Environment-based base URL configuration
 * - Default timeout for requests
 * - Reusable axios instance for consistent API calls
 * - Supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
 *
 * Base URL Priority:
 * 1. VITE_API_BASE_URL environment variable (production/staging)
 * 2. Fallback to http://localhost:4000 (development with json-server)
 *
 * Usage:
 * import axiosClient from '../services/axiosClient';
 * const response = await axiosClient.get('/policies');
 */

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
