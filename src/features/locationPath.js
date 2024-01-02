import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  pathname: "",
};
const locationPathSlice = createSlice({
  name: "locationPath",
  initialState: initialValue,
  reducers: {
    locationPathChanged: (state, action) => {
      state.pathname = action.payload;
    },
  },
});

export const { locationPathChanged } = locationPathSlice.actions;
export default locationPathSlice.reducer;
