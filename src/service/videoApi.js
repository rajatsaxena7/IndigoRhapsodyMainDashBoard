import { apiCall } from "./apiUtils";

// Get all categories
export const GetVideoRequests = async () => {
  try {
    return await apiCall("/video/video-requests", {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
export const GetAllVideos = async () => {
  try {
    return await apiCall("/content-video/totalVideos", {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const ApproveVideo = async (videoId, is_approved) => {
  try {
    return await apiCall(`/video/video-creator/${videoId}/approve`, {
      method: "PUT",
      body: JSON.stringify({ is_approved }),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const ApproveVideoContent = async (videoId, isApproved) => {
  try {
    return await apiCall(`/content-video/videos/${videoId}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ is_approved: isApproved }),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
