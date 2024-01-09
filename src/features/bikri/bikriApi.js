import { apiSlice } from "../apis/apiSlice";
import { userLoggedIn } from "../auth/authSlice";

const bikriApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMeal: builder.mutation({
      query: (data) => ({
        url: `/meal`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      }),
    }),
    getMonthlyMeals: builder.query({
      query: ({ getMonth, getYear }) => ({
        url: `/meal/${getMonth}/${getYear}`,
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      }),
      providesTags: ["getMeals"],
    }),
    updateMeal: builder.mutation({
      query: ({ data, id }) => ({
        url: `/meal/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      }),
    }),
    updateMyMealStatus: builder.mutation({
      query: (data) => ({
        url: `/meal/update-my-meal/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      }),
      invalidatesTags: ["getAllMonthStat"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const month =
          args.month === 0
            ? "January"
            : args.month === 1
            ? "February"
            : args.month === 2
            ? "March"
            : args.month === 3
            ? "April"
            : args.month === 4
            ? "May"
            : args.month === 5
            ? "June"
            : args.month === 6
            ? "July"
            : args.month === 7
            ? "August"
            : args.month === 8
            ? "September"
            : args.month === 9
            ? "Octobor"
            : args.month === 10
            ? "November"
            : args.month === 11
            ? "December"
            : "";
        try {
          const { data: updatedData } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals?.find(
                  (item) => item.date === `${updatedData.meal.date}`
                );
                desireMeal[args.mealName][args.mealIndex] = [
                  ...args[args.mealName][args.mealIndex],
                ];
              }
            )
          );
        } catch (err) {
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals?.find(
                  (item) => item.date === `${args.day} ${month} ${args.year}`
                );
                console.log("wrong");
                const doReplace = desireMeal[args.mealName][args.mealIndex];
                desireMeal[args.mealName][args.mealIndex] = [...doReplace];
              }
            )
          );
        }
      },
    }),

    updatePersonFullMeal: builder.mutation({
      query: (data) => ({
        url: `/meal/update-person-full-meal/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      }),
      invalidatesTags: ["getAllMonthStat"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        console.log(args);
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals?.find(
                  (item) => item._id === data.existingMeal._id
                );
                desireMeal.breakfast = data.existingMeal.breakfast;
                desireMeal.launch = data.existingMeal.launch;
                desireMeal.dinner = data.existingMeal.dinner;
              }
            )
          );
        } catch (err) {
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals?.find(
                  (item) => item._id === args.id
                );
                desireMeal["breakfast"][args.personIndex] = [
                  ...desireMeal["breakfast"][args.personIndex],
                ];
              }
            )
          );
        }
      },
    }),
    updateMoney: builder.mutation({
      query: (data) => ({
        url: `/meal/update-border-money/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      }),
      invalidatesTags: ["getAllMonthStat"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        console.log(args);
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals.find(
                  (item) => item.id === args.id
                );
                console.log(JSON.stringify(desireMeal));
                desireMeal["money"][args.borderIndex] =
                  data.meal.money[args.borderIndex];
              }
            )
          );
        } catch (err) {
          console.log("error is very bad");
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals.find(
                  (item) => item.id === args.id
                );
                desireMeal["money"][args.borderIndex] = [
                  ...desireMeal["money"],
                ][args.borderIndex];
                desireMeal["money"] = [...desireMeal["money"]];
              }
            )
          );
        }
      },
    }),
    updateShopMoney: builder.mutation({
      query: (data) => ({
        url: `/meal/update-shop-money/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      }),
      invalidatesTags: ["getAllMonthStat"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        console.log(args);
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals.find(
                  (item) => item.id === args.id
                );
                // desireMeal["shop"][args.borderIndex] = [
                //   ...desireMeal["shop"],
                // ][args.borderIndex];
                // desireMeal["shop"] = [...desireMeal["shop"]];
                desireMeal["shop"][args.borderIndex] =
                  data.meal.shop[args.borderIndex];
                // desireMeal["shop"] = [...desireMeal["shop"]];
              }
            )
          );
        } catch (err) {
          console.log("shop error");
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals.find(
                  (item) => item.id === args.id
                );
                console.log(JSON.stringify(desireMeal));
                console.log(JSON.stringify([...desireMeal["shop"]]));
                desireMeal["shop"][args.borderIndex] = [...desireMeal["shop"]][
                  args.borderIndex
                ];
                desireMeal["shop"] = [...desireMeal["shop"]];
              }
            )
          );
        }
      },
    }),
    updateExtraShopMoney: builder.mutation({
      query: (data) => ({
        url: `/meal/update-extra-shop-money/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      }),
      invalidatesTags: ["getAllMonthStat"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        console.log(args);
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals.find(
                  (item) => item.id === args.id
                );
                // desireMeal["shop"][args.borderIndex] = [
                //   ...desireMeal["shop"],
                // ][args.borderIndex];
                // desireMeal["shop"] = [...desireMeal["shop"]];
                desireMeal["extraShop"][args.borderIndex] =
                  data.meal.extraShop[args.borderIndex];
                // desireMeal["shop"] = [...desireMeal["shop"]];
              }
            )
          );
        } catch (err) {
          console.log("Extra shop error");
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals.find(
                  (item) => item.id === args.id
                );
                console.log(JSON.stringify(desireMeal));
                console.log(JSON.stringify([...desireMeal["extraShop"]]));
                desireMeal["extraShop"][args.borderIndex] = [
                  ...desireMeal["extraShop"],
                ][args.borderIndex];
                desireMeal["extraShop"] = [...desireMeal["extraShop"]];
              }
            )
          );
        }
      },
    }),
    getMonthlyStats: builder.query({
      query: () => {
        const month = new Date().getMonth();
        const year = new Date().getFullYear();
        const day = new Date().getDate();
        return {
          url: `/meal/monthly-borders-stats/${year}/${month}/${day}`,
          headers: {
            authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth")).token
            }`,
          },
        };
      },
      providesTags: ["getAllMonthStat"],
    }),
    getYearMonth: builder.query({
      query: () => `/year-month`,
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: `/users/register`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/users/login`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          localStorage.setItem(
            "auth",
            JSON.stringify({
              token: data.token,
              user: data.user,
            })
          );
          dispatch(
            userLoggedIn({
              accessToken: data.token,
              user: data.user,
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),
    sendSms: builder.mutation({
      query: (body) => ({
        url: `/users/send-message`,
        method: "POST",
        body:body
      }),
    }),
    forgotPassword: builder.mutation({
      query: () => ({
        url: `/users/forgot-password`,
        method: "POST",
        body: {email:'shamim@gmail.com'},
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/users/logout`,
        method: "GET",
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          localStorage.removeItem("auth");
          dispatch(
            userLoggedIn({
              accessToken: undefined,
              user: undefined,
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),
    getUsers: builder.query({
      query: () => `/users`,
    }),
  }),
});
export const {
  useBuyProductMutation,
  useGetCustomerBikrisQuery,
  useGetCustomerBikriStaticsQuery,
  useGetSellerBikriStatsMonthlyQuery,
  useCreateMealMutation,
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetCustomerSellYearQuery,
  useSignUpMutation,
  useGetUsersQuery,
  useGetMonthlyMealsQuery,
  useUpdateMealMutation,
  useGetMonthlyStatsQuery,
  useLoginMutation,
  useUpdateMyMealStatusMutation,
  useUpdatePersonFullMealMutation,
  useUpdateMoneyMutation,
  useUpdateShopMoneyMutation,
  useUpdateExtraShopMoneyMutation,
  useGetYearMonthQuery,
  useLogoutMutation,
  useSendSmsMutation,
  useForgotPasswordMutation
} = bikriApi;
