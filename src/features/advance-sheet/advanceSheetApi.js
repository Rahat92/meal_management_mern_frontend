import { apiSlice } from "../apis/apiSlice";

const advanceSheetApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserAdvanceSheet: builder.query({
            query: (body) => ({
                url: `/api/v2/advance-meal-sheet/user/${body.userId}?year=${body.year}&month=${body.month}`,
            }),
            providesTags: (result, error, arg) => [
                { type: "userAdvanceSheet", id: `${arg.userId}-${arg.year}-${arg.month}` }
            ],
        }),
        getAdvanceSheet: builder.query({
            query: (data) => ({
                url: `/api/v2/advance-meal-sheet?mealManager=${data.mealManager}&month=${data.month}&year=${data.year}&user=${data.user}&category=${data.category}&tag=${data.tag}`,
            }),
            providesTags: ['AdvanceSheet']
        }),

        getAdvanceRowSheet: builder.query({
            query: (monthId) => ({
                url: `/api/v2/advance-meal-sheet/${monthId}`
            })
        }),
    })
})

export const { useGetAdvanceSheetQuery, useGetUserAdvanceSheetQuery } = advanceSheetApi;