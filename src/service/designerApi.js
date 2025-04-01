export const Pending_account = async () => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/designer/pending-count`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

export const allDesigners = async () => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/designer/designersDashboard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

export const disableDesigner = async (designerId) => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/designer/disable/${designerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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

export const Total_count = async () => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/designer/total-count`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
export const Approved_count = async () => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/designer/approved-count`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
export const updateDesignerApprovalStatus = async (designerId, isApproved) => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/designer/${designerId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_approved: isApproved }), // Pass true for approved or false for pending
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

export const GetDetailForDesigner = async (designerId) => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/designer/designers/${designerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
