import React, { useRef } from "react";
import {
  useGetMonthlyStatsQuery,
  useSendSmsMutation,
} from "../features/bikri/bikriApi";
import { useEffect } from "react";
import { useState } from "react";
import style from "./AllMonthsStats.module.css";
import { useDispatch, useSelector } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
const AllMonthsStats = () => {
  const { user } = useSelector((state) => state.auth);
  const [mealStatMonthly, setMealStatMonthly] = useState([]);
  const [nowScroll, setNowScroll] = useState(false);
  const { data: getMonthlyMealStats } = useGetMonthlyStatsQuery();
  const [sendSms] = useSendSmsMutation();
  const dateNameRef = useRef();

  const mainBodyRef = useRef();
  const bodyRef = useRef();
  const headRef = useRef();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   sendSms()
  // }, [])
  useEffect(() => {
    if (getMonthlyMealStats?.monthlyMeals?.length > 0) {
      let mealInfo = [];
      let borders = [];
      let breakfasts = [];
      let launchs = [];
      let dinners = [];
      let months = [];
      let moneys = [];
      let shops = [];
      let extraShops = [];
      getMonthlyMealStats.monthlyMeals.map((el) => {
        months.push(el._id);
        mealInfo.push([]);
        borders.push(el.border);
        breakfasts.push(el.breakfast);
        launchs.push(el.launch);
        dinners.push(el.dinner);
        moneys.push(el.money);
        shops.push(el.shop);
        extraShops.push(el.extraShop);
        return {
          month: el._id?.month,
        };
      });

      borders.map((border, i) => {
        let arrEle = [];
        let finalArr = [];
        border.map((el, elIndex) => {
          const index = arrEle.findIndex((item) => item.border === el.name);
          if (index !== -1) {
            const obj = arrEle[index];
            arrEle[index] = {
              ...obj,
              breakfast: obj.breakfast + breakfasts[i][elIndex][0],
              launch: obj.launch + launchs[i][elIndex][0],
              dinner: obj.dinner + dinners[i][elIndex][0],
              money: obj.money + moneys[i][elIndex],
              shop: obj.shop + shops[i][elIndex],
              extraShop: obj.extraShop + extraShops[i][elIndex],
            };
          } else {
            arrEle.push({
              border: el.name,
              breakfast: breakfasts[i][elIndex][0],
              launch: launchs[i][elIndex][0],
              dinner: dinners[i][elIndex][0],
              money: moneys[i][elIndex],
              shop: shops[i][elIndex],
              extraShop: extraShops[i][elIndex],
            });
          }
          finalArr = arrEle.map((el) => {
            return {
              border: el.border,
              breakfast: el.breakfast,
              launch: el.launch,
              dinner: el.dinner,
              totalMeal: el.breakfast + el.launch + el.dinner,
              totalMoney: el.money,
              totalShop: el.shop,
              totalExtraShop: el.extraShop,
            };
          });
        });
        mealInfo[i] = {
          month: months[i]?.month + " " + months[i]?.year,
          overAllShop: finalArr.reduce((f, c) => f + c.totalShop, 0),
          overAllExtraShop: finalArr.reduce((f, c) => f + c.totalExtraShop, 0),
          overAllMoney: finalArr.reduce((f, c) => f + c.totalMoney, 0),
          finalArr,
          totalMeal: finalArr.reduce((f, c) => f + c.totalMeal, 0),
          mealRate:
            finalArr.reduce((f, c) => f + c.totalShop, 0) /
            finalArr.reduce((f, c) => f + c.totalMeal, 0),
        };
      });
      setMealStatMonthly(mealInfo);
    }
  }, [getMonthlyMealStats?.monthlyMeals]);
  useEffect(() => {
    window.addEventListener("scroll", function () {
      bodyRef?.current?.scrollTo(0, window.pageYOffset);
      dateNameRef?.current?.scrollTo(0, window.pageYOffset);
      headRef?.current?.scrollTo(window.pageXOffset, 0);
    });
  }, [window.pageYOffset, window.pageXOffset]);

  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);

  console.log(mainBodyRef?.current);
  useEffect(() => {
    if (mealStatMonthly?.length > 0) {
      const borderIndex = mealStatMonthly[0]?.finalArr.findIndex(
        (item) => item.border === user?.name
      );
      console.log(borderIndex);
      mainBodyRef?.current?.scrollTo({
        top: borderIndex * 40,
        behavior: "smooth",
      });
      dateNameRef?.current?.scrollTo({
        top: borderIndex * 40,
        behavior: "smooth",
      });
      setTimeout(() => {
        setNowScroll(true);
      }, 1000);
    }
  }, [mealStatMonthly, user]);
  console.log(mealStatMonthly);
  return (
    <div className="font-sans text-black text-center fixed top-0 left-0 right-0 bottom-0 bg-no-repeat bg-cover d-non h-screen bg-[url('https://www.gardenexpress.com.au/wp-content/uploads/2016/04/Lilium_Hybrid_Mixed_13.jpg')]">
      {mealStatMonthly?.length > 0 && (
        <div className="md:mx-[11%] mt-[30%] md:mt-[8%] bg-green-500">
          <h1 className="text-2xl font-bold flex justify-center items-center p-2">
            Meal Summary
          </h1>
          {mealStatMonthly &&
            mealStatMonthly
              ?.sort((a, b) => b.month.split(" ")[0] - a.month.split(" ")[0])
              ?.sort((a, b) => b.month.split(" ")[1] - a.month.split(" ")[1])
              ?.filter((item) => item.month === "0 2024")
              ?.map((el) => {
                return (
                  <div className="w-full relative overflow-auto shadow-xl">
                    <div className="flex w-full sticky top-0 right-0 z-50 shadow-lg">
                      <div className="sticky w-[220px] h-10 bg-red-500 top-0 left-0 shrink-0 border-r-2 border-blue-500">
                        <table className="w-full h-full">
                          <tr>
                            <td className="w-[100px] bg-orange-500">Date</td>
                            <td>Name</td>
                          </tr>
                        </table>
                      </div>

                      <div
                        ref={headRef}
                        onScroll={() => {
                          if (nowScroll) {
                            mainBodyRef?.current?.scrollTo(
                              headRef?.current?.scrollLeft,
                              mainBodyRef?.current?.scrollTop
                            );
                          }
                        }}
                        className="absolute right-0 h-10 bg-yellow-500 left-[220px] top-0 overflow-auto"
                      >
                        <table className="h-full w-[1600px]">
                          <tr>
                            <td className="bg-green-100 w-[100px] text-blue-500">
                              Breakfast
                            </td>
                            <td className="bg-red-500 w-[100px]">Launch</td>
                            <td className="w-[100px] bg-green-300">Dinner</td>
                            <td className="w-[100px] bg-red-200">
                              Total&nbsp;Meal
                            </td>
                            <td className="w-[100px] bg-red-400">
                              Overall&nbsp;Meal
                            </td>
                            <td className="w-[100px] bg-red-500">Shopping</td>
                            <td className="w-[100px] bg-red-300">
                              Meal&nbsp;Rate
                            </td>
                            <td className="w-[150px] bg-red-400">
                              Extra&nbsp;Shopping
                            </td>
                            <td className="w-[150px] bg-red-300">
                              Overall&nbsp;Shopping
                            </td>
                            <td className="w-[100px] bg-red-400">Deposite</td>
                            <td className="w-[100px] bg-red-200">Consume</td>
                            <td className="w-[150px] bg-red-400">
                              Remainging&nbsp;Balance
                            </td>
                            <td className="w-[150px] bg-red-300">
                              Overall&nbsp;Deposite
                            </td>
                            <td className=""></td>
                            <td className="w-[100px] bg-red-400">
                              Rest&nbsp;Balance
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>

                    <div className="bg-gray-300 flex h-[200px] relative shadow-sm">
                      <div
                        ref={dateNameRef}
                        onScroll={() => {
                          if (nowScroll) {
                            mainBodyRef?.current?.scrollTo(
                              mainBodyRef?.current?.scrollLeft,
                              dateNameRef?.current?.scrollTop
                            );
                          }
                        }}
                        className="w-[220px] bg-orange-500 h-full overflow-auto shrink-0 z-10 shadow-2xl border-r-2 border-blue-500"
                      >
                        <table className="">
                          <tr>
                            <td className="w-[100px] bg-blue-500 block sticky top-[50%] translate-y-[-50%]">
                              {el.month.split(" ")[0] === "0"
                                ? "January"
                                : el.month.split(" ")[0] === "1"
                                ? "February"
                                : el.month.split(" ")[0] === "2"
                                ? "March"
                                : el.month.split(" ")[0] === "3"
                                ? "April"
                                : el.month.split(" ")[0] === "4"
                                ? "May"
                                : el.month.split(" ")[0] === "5"
                                ? "June"
                                : el.month.split(" ")[0] === "6"
                                ? "July"
                                : el.month.split(" ")[0] === "7"
                                ? "August"
                                : el.month.split(" ")[0] === "8"
                                ? "September"
                                : el.month.split(" ")[0] === "9"
                                ? "Octobor"
                                : el.month.split(" ")[0] === "10"
                                ? "November"
                                : el.month.split(" ")[0] === "11"
                                ? "December"
                                : ""}{" "}
                              <br />
                              {el.month.split(" ")[1]}
                            </td>
                            <td className="bg-red-500 w-full">
                              {/* Name */}
                              <table className="w-full">
                                {el.finalArr.map((el) => {
                                  return (
                                    <tr
                                      className={`py-2 ${
                                        el.border === user?.name
                                          ? "bg-blue-500 text-white"
                                          : ""
                                      }`}
                                    >
                                      <td className="py-2">{el.border}</td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>
                          </tr>
                        </table>
                      </div>

                      {/* Main Table Body */}
                      <div
                        ref={mainBodyRef}
                        onScroll={() => {
                          // dateNameRef?.current?.scrollTo(mainBodyRef?.current?.scrollLeft, mainBodyRef?.current?.scrollTop);
                          headRef?.current?.scrollTo(
                            mainBodyRef?.current?.scrollLeft,
                            dateNameRef?.current?.scrollTop
                          );
                          dateNameRef?.current?.scrollTo(
                            0,
                            mainBodyRef?.current?.scrollTop
                          );
                        }}
                        className="absolute h-full right-0 left-[220px] bg-yellow-500 overflow-auto"
                      >
                        <table className="w-[1600px]">
                          <tr>
                            <td className="bg-green-100 w-[100px]">
                              <table className="w-full">
                                {el.finalArr.map((el) => {
                                  return (
                                    <tr>
                                      <td
                                        className={`py-2 ${
                                          el.border === user?.name
                                            ? "bg-blue-500 text-white"
                                            : ""
                                        }`}
                                      >
                                        {el.breakfast}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>

                            <td className="bg-red-500 w-[100px]">
                              <table className="w-full">
                                {el.finalArr.map((el) => {
                                  return (
                                    <tr>
                                      <td
                                        className={`py-2 ${
                                          el.border === user?.name
                                            ? "bg-blue-500 text-white"
                                            : ""
                                        }`}
                                      >
                                        {el.launch}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>

                            <td className="w-[100px] bg-green-300">
                              <table className="w-full">
                                {el.finalArr.map((el) => {
                                  return (
                                    <tr>
                                      <td
                                        className={`py-2 ${
                                          el.border === user?.name
                                            ? "bg-blue-500 text-white"
                                            : ""
                                        }`}
                                      >
                                        {el.dinner}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>

                            <td className="w-[100px] bg-red-200">
                              <table className="w-full">
                                {el.finalArr.map((el) => {
                                  return (
                                    <tr>
                                      <td
                                        className={`py-2 ${
                                          el.border === user?.name
                                            ? "bg-blue-500 text-white"
                                            : ""
                                        }`}
                                      >
                                        {el.totalMeal}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>

                            <td className="w-[100px] bg-red-400 block sticky top-[50%] transform: translate-y-[-50%]">
                              {el.totalMeal}
                            </td>

                            <td className="w-[100px] bg-red-500">
                              <table className="w-full">
                                {el.finalArr.map((el) => {
                                  return (
                                    <tr>
                                      <td
                                        className={`py-2 ${
                                          el.border === user?.name
                                            ? "bg-blue-500 text-white"
                                            : ""
                                        }`}
                                      >
                                        {el.totalShop}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>

                            <td className="w-[100px] bg-red-300 block sticky top-[50%] transform: translate-y-[-50%]">
                              {isNaN(el.mealRate.toFixed(2))
                                ? 0
                                : el.mealRate.toFixed(2)}
                            </td>
                            {/* Extra shoppings */}
                            <td className="w-[150px] bg-red-400">
                              <table className="w-full">
                                {el.finalArr.map((el) => {
                                  return (
                                    <tr>
                                      <td
                                        className={`py-2 ${
                                          el.border === user?.name
                                            ? "bg-blue-500 text-white"
                                            : ""
                                        }`}
                                      >
                                        {el.totalExtraShop}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>

                            <td className="w-[150px] bg-red-300 block sticky top-[50%] transform: translate-y-[-50%]">
                              {el.overAllShop + el.overAllExtraShop}
                            </td>

                            <td className="w-[100px] bg-red-400">
                              <table className="w-full">
                                {el.finalArr?.map((el) => {
                                  return (
                                    <tr>
                                      <td
                                        className={`py-2 ${
                                          el.border === user?.name
                                            ? "bg-blue-500 text-white"
                                            : ""
                                        }`}
                                      >
                                        {el.totalMoney}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>

                            <td className="w-[100px] bg-red-200">
                              <table className="w-full">
                                {el.finalArr?.map((ele) => {
                                  return (
                                    <tr>
                                      <td
                                        className={`py-2 ${
                                          ele.border === user?.name
                                            ? "bg-blue-500 text-white"
                                            : ""
                                        }`}
                                      >
                                        {isNaN(
                                          (
                                            ele.totalMeal * el.mealRate +
                                            el.overAllExtraShop /
                                              el.finalArr.length
                                          ).toFixed(2)
                                        )
                                          ? 0
                                          : (
                                              ele.totalMeal * el.mealRate +
                                              el.overAllExtraShop /
                                                el.finalArr.length
                                            ).toFixed(2)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>
                            {/* Remaining Balance */}
                            <td className="w-[150px] bg-red-400">
                              <table className="w-full">
                                {el.finalArr?.map((ele) => {
                                  return (
                                    <tr>
                                      <td
                                        className={`py-2 ${
                                          ele.totalMoney -
                                            ele.totalMeal * el.mealRate -
                                            el.overAllExtraShop /
                                              el.finalArr.length <
                                          0
                                            ? "text-red-500 font-bold"
                                            : " "
                                        } ${
                                          ele.border === user?.name
                                            ? "bg-blue-500 text-white"
                                            : ""
                                        } }`}
                                      >
                                        {isNaN(
                                          ele.totalMoney -
                                            ele.totalMeal * el.mealRate -
                                            el.overAllExtraShop /
                                              el.finalArr.length
                                        )
                                          ? 0
                                          : (
                                              ele.totalMoney -
                                              ele.totalMeal * el.mealRate -
                                              el.overAllExtraShop /
                                                el.finalArr.length
                                            ).toFixed(2)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </table>
                            </td>

                            <td className="w-[150px] bg-red-300 block sticky top-[50%] transform: translate-y-[-50%]">
                              {el.overAllMoney}
                            </td>

                            <td></td>
                            <td className="w-[100px] bg-red-400 block sticky top-[50%] transform: translate-y-[-50%]">
                              {el.overAllMoney -
                                el.overAllShop -
                                el.overAllExtraShop}
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
};

export default AllMonthsStats;
