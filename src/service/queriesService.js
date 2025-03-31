const API_BASE_URL = "https://indigo-rhapsody-backend-ten.vercel.app";

// Get all blogs
export const getQueries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/queries`, {
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

export const updateBlog = async (id, blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/queries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
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
