export const GetCoupons = async () => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/coupon/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const DeleteCoupon = async (couponId) => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/coupon/${couponId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const Applycoupon = async (couponId) => {
    try {
      const response = await fetch(
        `https://indigo-rhapsody-backend-ten.vercel.app/coupon/${couponId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };
  
