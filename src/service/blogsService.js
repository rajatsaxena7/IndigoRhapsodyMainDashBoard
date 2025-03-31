const API_BASE_URL = "https://indigo-rhapsody-backend-ten.vercel.app";

// Get all blogs
export const getBlogs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/`, {
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

// Create a new blog
export const createBlog = async (blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData), // Include title, description, and image
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

// Get a blog by ID
export const getBlogById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
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

// Update a blog by ID
export const updateBlog = async (id, blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData), // Include title, description, image, and status
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

// Delete a blog by ID
export const deleteBlog = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: "DELETE",
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
