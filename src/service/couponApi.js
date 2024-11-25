const apiRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return await response.json(); // Parse response data only once
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};
export const GetCoupons = async () => {
  return await apiRequest(
    `https://indigo-rhapsody-backend-ten.vercel.app/coupon`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const DeleteCoupon = async (couponId) => {
  return await apiRequest(
    `https://indigo-rhapsody-backend-ten.vercel.app/coupon/${couponId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const ApplyCoupon = async (couponId) => {
  return await apiRequest(
    `https://indigo-rhapsody-backend-ten.vercel.app/coupon/apply/${couponId}`,
    {
      method: "POST", // Use POST or PATCH for applying a coupon
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
