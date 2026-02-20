import { apiSlice } from "../apis/apiSlice";

const tagApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTags: builder.query({
            query: (categoryId) => {
                return {
                    url: `/product-tags?categoryId=${categoryId??''}`,
                    method: 'GET'
                }
            }
        })
    })
})

export const {useGetTagsQuery} = tagApi;