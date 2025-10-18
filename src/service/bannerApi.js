import { apiCall } from "./apiUtils";

// Get all banners
export const GetBanners = async () => {
  try {
    return await apiCall("/banner/", {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to fetch banners");
  }
};

// Create new banner
export const CreateBanner = async (bannerData) => {
  try {
    return await apiCall("/banner/", {
      method: "POST",
      body: JSON.stringify(bannerData),
    });
  } catch (error) {
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
