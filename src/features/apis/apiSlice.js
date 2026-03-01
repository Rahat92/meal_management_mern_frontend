import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL?process.env.REACT_APP_API_URL:`http://localhost:5000`,
  }),
  tagTypes: ["getMeals", "getAllMonthStat", 'getMessages', 'createMessage'],
  endpoints: (builder) => ({}),
});

