const API_BASE_URL = "https://indigo-rhapsody-backend-ten.vercel.app";

// Get all categories
export const GetCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/category`, {
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

export const GetSubCategories = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/subcategory/subcategoriesall`,
      {
        method: "GET",
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

// Delete a category by ID
export const DeleteCategory = async (categoryId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/category/category/${categoryId}`,
      {
        method: "DELETE",
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

// Add a new category
export const AddCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/category/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
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

// Update a category by ID
export const UpdateCategory = async (categoryId, categoryData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/category/category/${categoryId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
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

// Approve or Unapprove a subcategory by ID
export const ApproveSubCategory = async (subCategoryId, isApproved) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/subcategory/subcategory/${subCategoryId}/approve`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
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

export const UpdateSubCategory = async (subCategoryId, subCategoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategory/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subCategoryData),
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

export const CreateSubCategory = async (subCategoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategory/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subCategoryData),
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

export const DeleteSubCategory = async (subCategoryID) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/subcategory/delete/${subCategoryID}`,
      {
        method: "DELETE",
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
