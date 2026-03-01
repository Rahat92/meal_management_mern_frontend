import { apiSlice } from "../apis/apiSlice";

const advanceSheetApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdvanceSheet: builder.query({
            query: (monthId) => ({
                url: `/api/v2/advance-meal-sheet/${monthId}`
            })
        }),
        getAdvanceRowSheet: builder.query({
            query: (monthId) => ({
                url: `/api/v2/advance-meal-sheet/${monthId}`
            })
        }),
    })
})

export const {useGetAdvanceSheetQuery} = advanceSheetApi;