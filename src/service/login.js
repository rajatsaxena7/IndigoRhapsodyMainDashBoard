import { API_BASE_URL } from "../config/environment";

export const GetDetailForDesigner = async (emailId, passWord) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/adminLogin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          body: JSON.stringify({ email: emailId, password: passWord }),
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
