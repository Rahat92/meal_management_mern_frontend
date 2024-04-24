import { apiSlice } from "../apis/apiSlice";

const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (data) => `/conversations/${data.id}`,
      headers: {
        authorization: `Bearer ${
          JSON.parse(localStorage.getItem("auth"))?.token
        }`,
      },
      async onQueryStarted(args, { dispatch, queryFulfilled, queryRejected }) {
        console.log(args);
      },
    }),
  }),
});

export const { useGetConversationsQuery } = conversationApi;
