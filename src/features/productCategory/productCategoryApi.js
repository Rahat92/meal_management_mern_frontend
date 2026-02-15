import { apiSlice } from "../apis/apiSlice";

const productCategoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductCategories: builder.query({
            query: () => {
                return {
                    url: `/product-categories`,
                    method: 'GET'
                }
            },
            providesTags: ['getProductCategories']
        }),
        createProductCategory: builder.mutation({
            query: (data) => ({
                url: `/product-categories`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['getProductCategories']
        }),
        deleteProductCategory: builder.mutation({
            query:(id) => ({
                url: `/product-categories/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags:['getProductCategories']
        })
    })
})

export const { useGetProductCategoriesQuery, useCreateProductCategoryMutation, useDeleteProductCategoryMutation } = productCategoryApi;

