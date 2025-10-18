import { apiCall } from "./apiUtils";

export const TotalOrders = async () => {
  try {
    return await apiCall("/order/orders/total-count", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
export const TotalDesigners = async () => {
  try {
    return await apiCall("/designer/total-count", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
export const TotalProducts = async () => {
  try {
    return await apiCall("/products/total-count", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
export const TotalUsers = async () => {
  try {
    return await apiCall("/user/total-count", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
export const TotalSales = async () => {
  try {
    return await apiCall("/order/total-sales", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const GraphData = async () => {
  try {
    return await apiCall("/order/daily-stats", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
