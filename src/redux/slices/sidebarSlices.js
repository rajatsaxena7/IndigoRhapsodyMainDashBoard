import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false, // Initially the sidebar is closed
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarOpen: (state) => {
      state.isSidebarOpen = true; // Open the sidebar
    },
    setSidebarClose: (state) => {
      state.isSidebarOpen = false; // Close the sidebar
    },
  },
});

export const { setSidebarClose, setSidebarOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
