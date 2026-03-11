import { apiSlice } from "../apis/apiSlice";


const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomer: builder.query({
      query: (customerId) => `/api/v1/customers/${customerId}`,
    }),
    getCustomers: builder.query({
      query: () => `/api/v1/customers`,
    }),
    createCustomer: builder.mutation({
      query: (body) => ({
        url: `/api/v1/customers`,
        method: "POST",
        body: {
          name: "Jamal Uddin",
          email: "jamal@gmail.com",
          password: "rahat1234",
          passwordConfirm: "rahat1234",
          phoneNo: "012345678",
        },
      }),
    }),
  }),
});
export const {
  useGetCustomerQuery,
  useGetCustomersQuery,
  useCreateCustomerMutation,
} = customerApi;
