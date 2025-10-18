import { apiCall } from "./apiUtils";

// Get all categories
export const GetCategories = async () => {
  try {
    return await apiCall("/category", {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const GetSubCategories = async () => {
  try {
    return await apiCall("/subcategory/subcategoriesall", {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a category by ID
export const DeleteCategory = async (categoryId) => {
  try {
    return await apiCall(`/category/category/${categoryId}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Add a new category
export const AddCategory = async (categoryData) => {
  try {
    return await apiCall("/category/", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a category by ID
export const UpdateCategory = async (categoryId, categoryData) => {
  try {
    return await apiCall(`/category/category/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Approve or Unapprove a subcategory by ID
export const ApproveSubCategory = async (subCategoryId, isApproved) => {
  try {
    return await apiCall(`/subcategory/subcategory/${subCategoryId}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ isApproved }),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const UpdateSubCategory = async (subCategoryId, subCategoryData) => {
  try {
    return await apiCall(`/subcategory/${subCategoryId}`, {
      method: "PUT",
      body: JSON.stringify(subCategoryData),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const CreateSubCategory = async (subCategoryData) => {
  try {
    return await apiCall("/subcategory/", {
      method: "POST",
      body: JSON.stringify(subCategoryData),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const DeleteSubCategory = async (subCategoryID) => {
  try {
    return await apiCall(`/subcategory/delete/${subCategoryID}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all categories for filter dropdown
export const getAllCategoriesForFilter = async () => {
  try {
    // Use the existing working API function
    const response = await GetCategories();
    return response;
  } catch (error) {
    console.error("Category filter API error:", error);
    throw new Error(error.message || 'Failed to fetch categories');
  }
};

// Get all subcategories for filter dropdown
export const getAllSubCategoriesForFilter = async () => {
  try {
    // Use the existing working API function
    const response = await GetSubCategories();
    return response;
  } catch (error) {
    console.error("Subcategory filter API error:", error);
    throw new Error(error.message || 'Failed to fetch subcategories');
  }
};
