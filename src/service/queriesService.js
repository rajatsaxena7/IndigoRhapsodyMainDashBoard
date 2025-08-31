import { apiCall } from "./apiUtils";

// Get all queries
export const getQueries = async () => {
  try {
    return await apiCall("/queries/queries", {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to fetch queries");
  }
};

// Update query status
export const updateQuery = async (id, queryData) => {
  try {
    return await apiCall(`/queries/queries/${id}`, {
      method: "PUT",
      body: JSON.stringify(queryData),
    });
  } catch (error) {
    throw new Error(error.message || "Failed to update query");
  }
};

// Delete query
export const deleteQuery = async (id) => {
  try {
    return await apiCall(`/queries/queries/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to delete query");
  }
};

// Get query by ID
export const getQueryById = async (id) => {
  try {
    return await apiCall(`/queries/queries/${id}`, {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error.message || "Failed to fetch query details");
  }
};

// Mark query as resolved
export const resolveQuery = async (id) => {
  try {
    return await apiCall(`/queries/queries/${id}/resolve`, {
      method: "PUT",
      body: JSON.stringify({ status: "resolved" }),
    });
  } catch (error) {
    throw new Error(error.message || "Failed to resolve query");
  }
};
