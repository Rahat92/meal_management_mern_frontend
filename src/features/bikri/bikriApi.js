import { apiSlice } from "../apis/apiSlice";
import { userLoggedIn } from "../auth/authSlice";

const bikriApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMeal: builder.mutation({
      query: (data) => ({
        url: `/api/v1/meal`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
            }`,
        },
      }),
    }),
    deleteYearMonth: builder.mutation({
      query: (yearMonth) => ({
        url: `/api/v1/year-month/${yearMonth._id}`,
        method: 'DELETE',
        body: yearMonth,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
            }`,
        },
      })
    }),
    getMonthlyMeals: builder.query({
      query: ({ getMonth, getYear }) => ({
        url: `/api/v1/meal/${getMonth}/${getYear}`,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
            }`,
        },
      }),
      providesTags: ["getMeals"],
    }),
    updateMeal: builder.mutation({
      query: ({ data, id }) => ({
        url: `/api/v1/meal/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
            }`,
        },
      }),
      invalidatesTags: ['getMeals']
    }),
    updateMyMealStatus: builder.mutation({
      query: (data) => ({
        url: `/api/v1/meal/update-my-meal/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
            }`,
        },
      }),
      invalidatesTags: ["getAllMonthStat", "getMeals"],
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
    updateBreakfast: builder.mutation({
      query: (data) => ({
        url: `/api/v1/meal/update-breakfast/${data.id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["getAllMonthStat", 'getMeals'],
      // headers: {
      //   authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
      //     }`,
      // }
    }),
    updateLunch: builder.mutation({
      query: (data) => ({
        url: `/api/v2/border-meal/${data.mealDay}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["getAllMonthStat", 'getMeals', 'AdvanceSheet'],
      // headers: {
      //   authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
      //     }`,
      // }
    }),

    updateLunchMenu: builder.mutation({
      query: (data) => ({
        url: `/api/v1/meal/update-lunch-menu/${data.id}`,
        method: "PATCH",
        body: data
      }),
      // headers: {
      //   authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
      //     }`,
      // }
    }),
    updateDinner: builder.mutation({
      query: (data) => ({
        url: `/api/v1/meal/update-dinner/${data.id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["getAllMonthStat", 'getMeals'],
      // headers: {
      //   authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
      //     }`,
      // }
    }),

    updatePersonFullMeal: builder.mutation({
      query: (data) => ({
        url: `/api/v1/meal/update-person-full-meal/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
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
        url: `/api/v2/deposits`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
            }`,
        },
      }),
      // invalidatesTags: ["getAllMonthStat", 'getMeals'],
      invalidatesTags: (result, error, arg) => {
        console.log(arg);
        return [
          // { type: "AdvanceSheet", id: `${arg.month}-${arg.year}` },
          { type: "userAdvanceSheet", id: `${arg.userId}-${arg.year}-${arg.month}` }
        ]
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
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
                desireMeal["depositComments"][args.borderIndex] =
                  data.meal.depositComments[args.borderIndex];
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
        url: `/api/v2/meal-expense-details`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
            }`,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        console.log(arg);
        return [
          // { type: "AdvanceSheet", id: `${arg.month}-${arg.year}` },
          { type: "userAdvanceSheet", id: `${arg.userId}-${arg.year}-${arg.month}` }
        ]
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
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
                desireMeal['shoppingComments'][args.borderIndex] = data.meal.shoppingComments[args.borderIndex]
                // desireMeal["shop"] = [...desireMeal["shop"]];
              }
            )
          );
        } catch (err) {
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
        url: `/api/v1/meal/update-extra-shop-money/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
            }`,
        },
      }),
      invalidatesTags: ["getAllMonthStat", "getMeals"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              "getMonthlyMeals",
              { getMonth: args.month, getYear: args.year },
              (meals) => {
                const desireMeal = meals?.monthlyMeals.find(
                  (item) => item.id === args.id
                );
                desireMeal["extraShop"][args.borderIndex] =
                  data.meal.extraShop[args.borderIndex];
                desireMeal["extraShoppingComments"][args.borderIndex] =
                  data.meal.extraShoppingComments[args.borderIndex];
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
        return {
          url: `/api/v2/advance-meal-sheet/${'69a059226ca3adea43a135b6'}`,
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
              }`,
          },
        };
      },
      providesTags: ["getAllMonthStat"],
    }),
    getYearMonth: builder.query({
      // query: () => `/year-month`,
      query: () => ({
        url: `/api/v1/year-month`,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token
            }`,
        },
      })
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: `/api/v1/users/register`,
        method: "POST",
        body: data,
      }),
    }),
    getManagers: builder.query({
      query: () => ({
        url: `/api/v1/users/managers`,
        method: 'GET'
      })
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/api/v1/users/login`,
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
        url: `/api/v1/users/send-message`,
        method: "POST",
        body: body
      }),
    }),
    forgotPassword: builder.mutation({
      query: () => ({
        url: `/api/v1/users/forgot-password`,
        method: "POST",
        body: { email: 'shamim@gmail.com' },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/api/v1/users/logout`,
        method: "GET",
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token}`,
        },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.removeItem("auth");
          dispatch(
            userLoggedIn({
              accessToken: null,
              user: null,
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),
    getUsers: builder.query({
      query: () => `/api/v1/users`,
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
  useForgotPasswordMutation,
  useDeleteYearMonthMutation,
  useUpdateLunchMutation,
  useUpdateDinnerMutation,
  useUpdateLunchMenuMutation,
  useUpdateBreakfastMutation,
  useGetManagersQuery
} = bikriApi;
