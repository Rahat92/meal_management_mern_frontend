import { apiSlice } from "../apis/apiSlice";


const foodApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFoods: builder.query({
            query: () => `/foods`,
        })
    })
});
export const {
    useGetFoodsQuery
} = foodApi;
