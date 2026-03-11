import { apiSlice } from "../apis/apiSlice";


const foodApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFoods: builder.query({
            query: () => `/api/v1/foods`,
        })
    })
});
export const {
    useGetFoodsQuery
} = foodApi;
