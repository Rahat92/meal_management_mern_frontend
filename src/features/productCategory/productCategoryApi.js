import { apiSlice } from "../apis/apiSlice";

const productCategoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductCategories: builder.query({
            query: () => {
                return {
                    url: `/api/v1/product-categories`,
                    method: 'GET'
                }
            },
            providesTags: ['getProductCategories']
        }),
        createProductCategory: builder.mutation({
            query: (data) => ({
                url: `/api/v1/product-categories`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['getProductCategories']
        }),
        deleteProductCategory: builder.mutation({
            query:(id) => ({
                url: `/api/v1/product-categories/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags:['getProductCategories']
        }),
        updateProductCategory: builder.mutation({
            query:({id, data}) => {
                console.log(id, data)
                return {
                    url: `/api/v1/product-categories/${id}`,
                    method: 'PATCH',
                    body: data
                }
            },
            invalidatesTags:['getProductCategories']
        }),
        ExtraShoppingWithCategory: builder.query({
            query:(managerId) => {
                console.log(managerId)
                return {
                    url: `/api/v1/product-categories/extra-shopping-summary/${managerId}`,
                    method: 'GET',
                }
            },
        }),
        marketingSummaryWithCategory: builder.query({
            query: (managerId) => ({
                url: `/api/v1/product-categories/marketing-summary/${managerId}`,
                method: 'GET',
            })
        })
    })
})

export const { useGetProductCategoriesQuery, useCreateProductCategoryMutation, useDeleteProductCategoryMutation, useUpdateProductCategoryMutation, useExtraShoppingWithCategoryQuery, useMarketingSummaryWithCategoryQuery } = productCategoryApi;

