import Cookies from "js-cookie";

// Base API configuration
const API_BASE_URL = "https://indigo-rhapsody-backend-ten.vercel.app";

// Get auth token from cookies
export const getAuthToken = () => {
  return Cookies.get("authToken");
};

// Get user ID from cookies
export const getUserId = () => {
  return Cookies.get("userId");
};

// Get user role from cookies
export const getUserRole = () => {
  return Cookies.get("userRole");
};

// Get user email from cookies
export const getUserEmail = () => {
  return Cookies.get("userEmail");
};

// Create headers with authentication
export const createAuthHeaders = (additionalHeaders = {}) => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...additionalHeaders,
  };
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createAuthHeaders(options.headers);
  
  const config = {
    ...options,
    headers,
    // Add timeout to prevent hanging requests
    signal: AbortSignal.timeout(30000), // 30 second timeout
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = "API request failed";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If we can't parse the error response, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      // Check for specific authentication errors
      if (response.status === 401 || 
          response.status === 403 || 
          errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("forbidden") ||
          errorMessage.toLowerCase().includes("invalid token") ||
          errorMessage.toLowerCase().includes("token expired")) {
        console.log("Authentication error detected:", errorMessage);
        clearAuthCookies();
        window.location.href = "/login";
        return;
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    // Handle timeout errors
    if (error.name === "AbortError" || error.message.includes("timeout")) {
      console.error("Request timeout:", error);
      throw new Error("Request timeout. Please try again.");
    }
    
    // Handle network errors more gracefully
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.error("Network error:", error);
      throw new Error("Network error. Please check your connection.");
    }
    
    // Handle CORS errors
    if (error.message.includes("CORS") || error.message.includes("cross-origin")) {
      console.error("CORS error:", error);
      throw new Error("CORS error. Please check your connection.");
    }
    
    // Re-throw the error if it's not a network or CORS error
    throw error;
  }
};

// Clear all authentication cookies
export const clearAuthCookies = () => {
  Cookies.remove("authToken");
  Cookies.remove("userId");
  Cookies.remove("userRole");
  Cookies.remove("userEmail");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  const userId = getUserId();
  return !!(token && userId);
};

// Logout function
export const logout = () => {
  clearAuthCookies();
  window.location.href = "/login";
};
