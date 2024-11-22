const API_BASE_URL = "https://indigo-rhapsody-backend-ten.vercel.app";

// Get all categories
export const GetCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/`, {
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
