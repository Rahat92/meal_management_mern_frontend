import React, { useRef } from "react";
import {
  useGetMonthlyStatsQuery,
  useGetYearMonthQuery,
  useSendSmsMutation,
} from "../features/bikri/bikriApi";
import { useEffect } from "react";
import { useState } from "react";
import style from "./AllMonthsStats.module.css";
import { useDispatch, useSelector } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import { Link } from "react-router-dom";
const AllMonthsStats = () => {
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();
  const todayDate = new Date().getDate();
  const { user } = useSelector((state) => state.auth);
  const [mealStatMonthly, setMealStatMonthly] = useState([]);
  const [display, setDisplay] = useState(false);
  const [nowScroll, setNowScroll] = useState(false);
  const { data: getMonthlyMealStats } = useGetMonthlyStatsQuery({
    year: 2024,
    month: 0,
    day: 2,
  });
  const { data: yearMonth } = useGetYearMonthQuery();
  const [yearMonthArr, setYearMonthArr] = useState([]);
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
    if (todayMonth && todayYear && yearMonth?.yearMonth?.length > 0) {
      const arr = yearMonth?.yearMonth?.filter((el) => el.month !== todayMonth);
      console.log(arr);
      setYearMonthArr(arr);
    }
  }, [yearMonth?.yearMonth.length, todayMonth, todayYear]);
  console.log(yearMonthArr);
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
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="z-[10000] mb-[1rem] align-self-start  w-full md:w-[60%] relative top-[-110px] md:top-0">
        <button
          onClick={() => setDisplay(!display)}
          id="dropdownDividerButton"
          data-dropdown-toggle="dropdownDivider"
          className="text-white bg-blue-700 hover:
          bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Select Month{" "}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <div
          id="dropdownInformation"
          className={`z-10 ${
            display ? "block" : "hidden"
          } bg-white divide-y absolute divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            {todayMonth === 0
              ? "January"
              : todayMonth === 1
              ? "February"
              : todayMonth === 2
              ? "Merch"
              : todayMonth === 3
              ? "April"
              : todayMonth === 4
              ? "May"
              : todayMonth === 5
              ? "June"
              : todayMonth === 6
              ? "July"
              : todayMonth === 7
              ? "August"
              : todayMonth === 8
              ? "September"
              : todayMonth === 9
              ? "October"
              : todayMonth === 10
              ? "November"
              : todayMonth === 11
              ? "December"
              : ""}{" "}
            {todayYear}
          </div>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownInformationButton"
          >
            {yearMonth?.yearMonth
              ?.filter(
                (el) =>
                  `${el.month}+${el.year}` !== `${todayMonth}+${todayYear}`
              )
              ?.map((el) => {
                return (
                  <li>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {el.month === 0
                        ? "January"
                        : el.month === 1
                        ? "February"
                        : el.month === 2
                        ? "Merch"
                        : el.month === 3
                        ? "April"
                        : el.month === 4
                        ? "May"
                        : el.month === 5
                        ? "June"
                        : el.month === 6
                        ? "July"
                        : el.month === 7
                        ? "August"
                        : el.month === 8
                        ? "September"
                        : el.month === 9
                        ? "October"
                        : el.month === 10
                        ? "November"
                        : el.month === 11
                        ? "December"
                        : ""}{" "}
                      {el.year}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>{" "}
      </div>
      <div className="border shadow-lg w-full md:w-[60%] h-[250px] overflow-auto relative top-[-120px] md:top-0">
        <table className="w-[1800px] bg-blue-500">
          <thead className="sticky top-0 shadow-md bg-blue-500 z-[100] h-[40px]">
            <tr className="">
              <th className="sticky left-0 top-0 bg-orange-500 border-r-2">
                <table className="w-full h-[40px]">
                  <tr className="h-[40px]">
                    <th className="w-[80px] h-full">Date</th>
                    <th className="h-[40px] text-center">
                      <table className="w-full">
                        <tr>
                          <th className="border-l-2 h-[40px] text-center">
                            Name
                          </th>
                        </tr>
                      </table>
                    </th>
                  </tr>
                </table>
              </th>
              <th className="border-r-2">Breakfast</th>
              <th className="border-r-2">Launch</th>
              <th className="border-r-2">Dinner</th>
              <th className="border-r-2">Total&nbsp;Meal</th>
              <th className="border-r-2">Overall&nbsp;Meal</th>
              <th className="border-r-2">Shopping</th>
              <th className="border-r-2">Meal&nbsp;Rate</th>
              <th className="border-r-2">Extra&nbsp;Shopping</th>
              <th className="border-r-2">Overall&nbsp;Shopping</th>
              <th className="border-r-2">Deposite</th>
              <th className="border-r-2">Consume</th>
              <th className="border-r-2">Remaining&nbsp;Balance</th>
              <th className="border-r-2">Overall&nbsp;Deposite</th>
              <th className=""></th>
              <th>Rest&nbsp;Balance</th>
            </tr>
          </thead>
          {mealStatMonthly?.length > 0
            ? mealStatMonthly
                ?.sort((a, b) => b.month.split(" ")[0] - a.month.split(" ")[0])
                ?.sort((a, b) => b.month.split(" ")[1] - a.month.split(" ")[1])
                ?.filter((item) => item.month === "0 2024")
                ?.map((el) => {
                  return (
                    <tbody>
                      <tr>
                        <th className="sticky left-0 bg-orange-500 z-50 shadow-md border-r-2">
                          <table className="w-full">
                            <tr>
                              <th
                                className="sticky top-[50%] transform block w-[80px]"
                                style={{ backfaceVisibility: "hidden" }}
                              >
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
                              </th>
                              <th className="w-full border-l-2">
                                <table className="w-full">
                                  {el.finalArr.map((item) => {
                                    return (
                                      <tr>
                                        <td className="py-2">{item.border}</td>
                                      </tr>
                                    );
                                  })}
                                </table>
                              </th>
                            </tr>
                          </table>
                        </th>
                        <th className="border-r-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr>
                                  <td className="py-2">{item.breakfast}</td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="border-r-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr>
                                  <td className="py-2">{item.launch}</td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="border-r-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr>
                                  <td className="py-2">{item.dinner}</td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="border-r-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr>
                                  <td className="py-2">{item.totalMeal}</td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="block sticky top-[50%] transform">
                          {el.totalMeal}
                        </th>
                        <th className="border-l-2 border-r-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr>
                                  <td className="py-2">{item.totalShop}</td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="block sticky top-[50%] transform">
                          {isNaN(el.mealRate.toFixed(2))
                            ? 0
                            : el.mealRate.toFixed(2)}
                        </th>
                        <th className="border-r-2 border-l-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr>
                                  <td className="py-2">
                                    {item.totalExtraShop}
                                  </td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="block sticky top-[50%] transform">
                          {el.overAllShop + el.overAllExtraShop}
                        </th>
                        <th className="border-r-2 border-l-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr>
                                  <td className="py-2">{item.totalMoney}</td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="border-r-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr>
                                  <td className="py-2">
                                    {isNaN(
                                      (
                                        item.totalMeal * el.mealRate +
                                        el.overAllExtraShop / el.finalArr.length
                                      ).toFixed(2)
                                    )
                                      ? 0
                                      : (
                                          item.totalMeal * el.mealRate +
                                          el.overAllExtraShop /
                                            el.finalArr.length
                                        ).toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="border-r-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr>
                                  <td className="py-2">
                                    {isNaN(
                                      item.totalMoney -
                                        item.totalMeal * el.mealRate -
                                        el.overAllExtraShop / el.finalArr.length
                                    )
                                      ? 0
                                      : (
                                          item.totalMoney -
                                          item.totalMeal * el.mealRate -
                                          el.overAllExtraShop /
                                            el.finalArr.length
                                        ).toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="block sticky top-[50%] transform">
                          {el.overAllMoney}
                        </th>
                        <th className="border-l-2"></th>
                        <th className="block sticky top-[50%] transform">
                          {el.overAllMoney -
                            el.overAllShop -
                            el.overAllExtraShop}
                        </th>
                      </tr>
                    </tbody>
                  );
                })
            : null}
        </table>
      </div>
    </div>
  );
};

export default AllMonthsStats;
