import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://meal-management-05ry.onrender.com/api/v1",
    baseUrl: "http://localhost:5000/api/v1",
  }),
  tagTypes: ["getMeals", "getAllMonthStat"],
  endpoints: (builder) => ({}),
});
