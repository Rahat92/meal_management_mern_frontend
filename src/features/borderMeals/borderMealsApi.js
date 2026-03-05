import { apiSlice } from "../apis/apiSlice";

const borderMealsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBorderMeals: builder.query({
            query: () => `/api/v2/border-meal`,
        })
    })
})

export const {useGetBorderMealsQuery} = borderMealsApi