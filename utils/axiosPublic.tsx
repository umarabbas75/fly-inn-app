import axios from "axios";

// Public axios instance - does NOT send cookies
const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI,
  withCredentials: false, // No cookies sent with requests
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
});

// Request interceptor - no authentication needed for public endpoints
axiosPublic.interceptors.request.use(
  (config) => {
    // Public endpoints don't need any auth headers or cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors but no auth redirect for public endpoints
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors but don't redirect on 401 for public endpoints
    if (error.response?.status === 401) {
      console.log("Unauthorized access to public endpoint");
    }
    return Promise.reject(error);
  }
);

export default axiosPublic;
