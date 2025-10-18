import { apiCall } from "./apiUtils";

// Get all orders
export const getAllOrders = async () => {
  try {
    console.log("Making request to /order/getAllOrders");
    const response = await apiCall("/order/getAllOrders", {
      method: "GET",
    });
    
    // Check if response is undefined (authentication error handled by apiCall)
    if (!response) {
      console.log("Authentication error - response is undefined");
      throw new Error("Authentication failed");
    }
    
    console.log("Orders response received:", response);
    return response;
  } catch (error) {
    console.error("getAllOrders error:", error);
    
    // If it's an authentication error, let it propagate to trigger logout
    if (error.message.includes("Authentication") || 
        error.message.includes("unauthorized") || 
        error.message.includes("forbidden")) {
      throw error;
    }
    
    throw new Error(error.message || "Failed to fetch orders");
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await apiCall(`/order/cancel/${orderId}`, {
      method: "PUT",
    });
    return response;
  } catch (error) {
    console.error("cancelOrder error:", error);
    throw new Error(error.message || "Failed to cancel order");
  }
};

// Get order statistics
export const getOrderStats = async () => {
  try {
    const response = await apiCall("/order/stats", {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("getOrderStats error:", error);
    
    // Return default stats if API fails
    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0
    };
  }
};
