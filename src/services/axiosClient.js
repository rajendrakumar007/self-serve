import axios from "axios";

// Prefer environment variable; fallback to local dev server.
const baseURL =
  import.meta?.env?.VITE_API_BASE_URL?.trim() || "http://localhost:4001";

const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
});

export default axiosClient;
