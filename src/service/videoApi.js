const API_BASE_URL = "https://indigo-rhapsody-backend-ten.vercel.app";

// Get all categories
export const GetVideoRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/video/video-requests`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};
export const GetAllVideos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/content-video/totalVideos`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const ApproveVideo = async (videoId, is_approved) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/video/video-creator/${videoId}/approve`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const ApproveVideoContent = async (videoId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/content-video/videos/${videoId}/approve`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};
