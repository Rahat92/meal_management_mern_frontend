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
            query: (monthId) => ({
                url: `/api/v2/advance-meal-sheet/${monthId}`
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