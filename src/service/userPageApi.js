import { apiCall } from "./apiUtils";

export const newUsersThisMonth = async () => {
  try {
    return await apiCall("/user/new-users-month", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
export const mostActiveState = async () => {
  try {
    return await apiCall("/user/most-users-state", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const TotalUsers = async () => {
  try {
    return await apiCall("/user/total-count", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const getDataByStates = async () => {
  try {
    return await apiCall("/user/user-count-by-state", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const getAllUsers = async () => {
  try {
    return await apiCall("/user/getUser", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
