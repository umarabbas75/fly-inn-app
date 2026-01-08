import axios from "axios";
import { getSession } from "next-auth/react";

const axiosAuth = axios.create({
  baseURL: "",
  withCredentials: true, // Send cookies with requests
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
});

// Request interceptor - add Bearer token from NextAuth session
axiosAuth.interceptors.request.use(
  async (config) => {
    // Get NextAuth session for Bearer token
    const session = await getSession();

    // Add Bearer token if available (for API calls)
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
    }

    // Cookies are automatically sent due to withCredentials: true

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors
axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      // You might want to redirect to login or refresh the token
      if (typeof window !== "undefined") {
        // window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosAuth;
