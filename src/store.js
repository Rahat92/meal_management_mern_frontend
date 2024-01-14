import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "./features/apis/apiSlice";
import authReducer from "./features/auth/authSlice";
import currentPathReducer from "./features/locationPath";
import totalMealBodyRefReducer from "./features/refSlice";
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    currentPath: currentPathReducer,
    totalMealBodyRef: totalMealBodyRefReducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(apiSlice.middleware),
});
export default store;
