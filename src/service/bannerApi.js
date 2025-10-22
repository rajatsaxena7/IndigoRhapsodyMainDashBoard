import { apiCall } from "./apiUtils";

// Get all banners
export const GetBanners = async () => {
  try {
    console.log("🔍 API: Fetching banners from /banner/");
    const result = await apiCall("/banner/", {
      method: "GET",
    });
    console.log("📊 API: Banner fetch result:", result);
    return result;
  } catch (error) {
    console.error("❌ API: Error fetching banners:", error);
    throw new Error(error.message || "Failed to fetch banners");
  }
};

// Create new banner
export const CreateBanner = async (bannerData) => {
  try {
    console.log("🔍 API: Creating banner with data:", bannerData);
    const result = await apiCall("/banner/", {
      method: "POST",
      body: JSON.stringify(bannerData),
    });
    console.log("📊 API: Banner creation result:", result);
    return result;
  } catch (error) {
    console.error("❌ API: Error creating banner:", error);
    throw new Error(error.message || "Failed to create banner");
  }
};

// Update banner
export const UpdateBanner = async (bannerId, bannerData) => {
  try {
    return await apiCall(`/banner/${bannerId}`, {
      method: "PUT",
      body: JSON.stringify(bannerData),
    });
  } catch (error) {
    throw new Error(error.message || "Failed to update banner");
  }
};

// Delete banner
export const DeleteBanner = async (bannerId) => {
  try {
    return await apiCall(`/banner/${bannerId}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to delete banner");
  }
};

// Get banner by ID
export const GetBannerById = async (bannerId) => {
  try {
    return await apiCall(`/banner/${bannerId}`, {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to fetch banner details");
  }
};
