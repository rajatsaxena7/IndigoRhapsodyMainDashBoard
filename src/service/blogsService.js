import { apiCall } from "./apiUtils";

// Get all blogs
export const getBlogs = async () => {
  try {
    return await apiCall("/blogs/", {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Create a new blog
export const createBlog = async (blogData) => {
  try {
    return await apiCall("/blogs/", {
      method: "POST",
      body: JSON.stringify(blogData), // Include title, description, and image
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get a blog by ID
export const getBlogById = async (id) => {
  try {
    return await apiCall(`/blogs/${id}`, {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a blog by ID
export const updateBlog = async (id, blogData) => {
  try {
    return await apiCall(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(blogData), // Include title, description, image, and status
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a blog by ID
export const deleteBlog = async (id) => {
  try {
    return await apiCall(`/blogs/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
