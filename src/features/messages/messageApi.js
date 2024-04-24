import { apiSlice } from "../apis/apiSlice";

const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) => `/messages/${id}`,
      providesTags: ["getMessages"],
      invalidatesTags: ["createMessage"],
    }),
    createMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getMessages"],
        providesTags: ["createMessage"],
      // async onQueryStarted(args, { queryFulfilled, dispatch }) {
      //   const { data } = await queryFulfilled;
      //   console.log(args);
      //   console.log(data);
      //   dispatch(
      //     apiSlice.util.updateQueryData(
      //       "getMessages",
      //       args.conversationId,
      //       (messages) => {
      //         console.log(JSON.stringify(messages));
      //         messages.data.messages.push(data.data.newMessage);
      //       }
      //     )
      //   );
      //   try {
      //   } catch (err) {}
      // },
    }),
  }),
});

export const { useGetMessagesQuery, useCreateMessageMutation } = messageApi;
