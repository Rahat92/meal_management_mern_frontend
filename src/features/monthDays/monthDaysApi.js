import { apiSlice } from "../apis/apiSlice";

const monthDaysApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMonthDays: builder.query({
            query: (monthId) => `/api/v2/meal-month-days?monthId=${monthId}`,
            providesTags: ["MonthDays"],
        })
    })
})

export const { useGetMonthDaysQuery } = monthDaysApi