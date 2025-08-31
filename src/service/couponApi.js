import { apiCall } from "./apiUtils";

export const GetCoupons = async () => {
  try {
    return await apiCall("/coupon", {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to fetch coupons");
  }
};

export const SearchUsers = async (searchTerm) => {
  try {
    return await apiCall(`/coupon/searchUser?q=${searchTerm}`, {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to search users");
  }
};

export const DeleteCoupon = async (couponId) => {
  try {
    return await apiCall(`/coupon/${couponId}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to delete coupon");
  }
};

export const ApplyCoupon = async (couponId) => {
  try {
    return await apiCall(`/coupon/apply/${couponId}`, {
      method: "POST",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to apply coupon");
  }
};

// Create new coupon
export const CreateCoupon = async (couponData) => {
  try {
    return await apiCall("/coupon", {
      method: "POST",
      body: JSON.stringify(couponData),
    });
  } catch (error) {
    throw new Error(error.message || "Failed to create coupon");
  }
};

// Update coupon
export const UpdateCoupon = async (couponId, couponData) => {
  try {
    return await apiCall(`/coupon/${couponId}`, {
      method: "PUT",
      body: JSON.stringify(couponData),
    });
  } catch (error) {
    throw new Error(error.message || "Failed to update coupon");
  }
};
