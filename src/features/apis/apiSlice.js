import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://meal-management-05ry.onrender.com`,
  }),
  tagTypes: ["getMeals", "getAllMonthStat", 'getMessages', 'createMessage'],
  endpoints: (builder) => ({}),
});
