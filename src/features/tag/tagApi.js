import { apiSlice } from "../apis/apiSlice";

const tagApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTags: builder.query({
            query: (categoryId) => {
                return {
                    url: `/api/v1/product-tags?categoryId=${categoryId??''}`,
                    method: 'GET'
                }
            }
        }),
        createTag: builder.mutation({
            query: (body) => {
                return {
                    url: `/api/v1/product-tags`,
                    method: 'POST',
                    body
                }
            }
        }),
    })
})

export const {useGetTagsQuery, useCreateTagMutation} = tagApi;