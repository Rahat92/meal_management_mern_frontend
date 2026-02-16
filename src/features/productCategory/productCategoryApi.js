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
        }),
        updateProductCategory: builder.mutation({
            query:({id, data}) => {
                console.log(id, data)
                return {
                    url: `/product-categories/${id}`,
                    method: 'PATCH',
                    body: data
                }
            },
            invalidatesTags:['getProductCategories']
        }),
        ExtraShoppingWithCategory: builder.query({
            query:() => {
                return {
                    url: `/product-categories/summary`,
                    method: 'GET',
                }
            },
        }),

    })
})

export const { useGetProductCategoriesQuery, useCreateProductCategoryMutation, useDeleteProductCategoryMutation, useUpdateProductCategoryMutation, useExtraShoppingWithCategoryQuery } = productCategoryApi;

