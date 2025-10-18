import { apiCall, getAuthToken } from "./apiUtils";

// Test function to check authentication
export const testPaymentAuth = async () => {
  try {
    const token = getAuthToken();
    console.log("Current auth token:", token ? token.substring(0, 20) + "..." : "No token");
    
    // Try a simple API call to test authentication
    const response = await apiCall("/payment/payments", {
      method: "GET",
    });
    console.log("Auth test successful:", response);
    return true;
  } catch (error) {
    console.error("Auth test failed:", error);
    return false;
  }
};

export const GetPayment = async () => {
  try {
    console.log("Fetching payments with token:", getAuthToken() ? "Present" : "Missing");
    
    // Add retry logic for network errors
    let retries = 3;
    let lastError;
    
    while (retries > 0) {
      try {
        const response = await apiCall("/payment/payments", {
          method: "GET",
        });
        console.log("Payments response:", response);
        return response;
      } catch (error) {
        lastError = error;
        console.error(`GetPayment attempt ${4 - retries} failed:`, error);
        
        // If it's a network error, retry
        if (error.message.includes("Network error") || error.message.includes("fetch")) {
          retries--;
          if (retries > 0) {
            console.log(`Retrying... ${retries} attempts remaining`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            continue;
          }
        }
        
        // If it's not a network error or we're out of retries, throw the error
        throw error;
      }
    }
    
    throw lastError;
  } catch (error) {
    console.error("GetPayment error:", error);
    throw new Error(error.message || "Failed to fetch payments");
  }
};

// Get payment statistics
export const GetPaymentStats = async () => {
  try {
    console.log("Fetching payment stats with token:", getAuthToken() ? "Present" : "Missing");
    const response = await apiCall("/payment/stats", {
      method: "GET",
    });
    console.log("Payment stats response:", response);
    return response;
  } catch (error) {
    console.error("GetPaymentStats error:", error);
    // Return default stats if API fails
    return {
      totalPayments: 0,
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      totalRevenue: 0
    };
  }
};

// Get payment by ID
export const GetPaymentById = async (paymentId) => {
  try {
    const response = await apiCall(`/payment/payments/${paymentId}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("GetPaymentById error:", error);
    throw new Error(error.message || "Failed to fetch payment details");
  }
};

// Update payment status
export const UpdatePaymentStatus = async (paymentId, status) => {
  try {
    const response = await apiCall(`/payment/payments/${paymentId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return response;
  } catch (error) {
    console.error("UpdatePaymentStatus error:", error);
    throw new Error(error.message || "Failed to update payment status");
  }
};
