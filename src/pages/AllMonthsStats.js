import React, { useRef } from "react";
import {
  useGetMonthlyMealsQuery,
  useGetMonthlyStatsQuery,
  useGetYearMonthQuery,
  useSendSmsMutation,
} from "../features/bikri/bikriApi";
import LoaderComponent from "../components/LoaderComponent";
import { useEffect } from "react";
import { useState } from "react";
import style from "./AllMonthsStats.module.css";
import { useDispatch, useSelector } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import { Link } from "react-router-dom";
import getCurrentMonthLength from "../utils/getCurrentMonthLength";
const AllMonthsStats = () => {
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();
  const todayDate = new Date().getDate();
  const { user } = useSelector((state) => state.auth);
  const [mealStatMonthly, setMealStatMonthly] = useState([]);
  const [display, setDisplay] = useState(false);
  const [nowScroll, setNowScroll] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [day, setDay] = useState(new Date().getDate())
  const { data: getMonthlyMealStats, isLoading } = useGetMonthlyStatsQuery({
    year: year,
    month: month,
    day: day,
  });
  const { data: monthlyMeals, isLoading: isMealsLoading } =
    useGetMonthlyMealsQuery(
      { getMonth: month, getYear: 2025 },
      // {
      //   skip: !isSkipped,
      // }
    );
  const currentBorders = monthlyMeals && monthlyMeals.monthlyMeals[0]&&monthlyMeals.monthlyMeals[0].border;

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
      setYearMonthArr(arr);
    }
  }, [yearMonth?.yearMonth.length, todayMonth, todayYear]);
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
        borders.push(el.border.map(itm => currentBorders && currentBorders.find(item => item._id === itm)));
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
          const index = arrEle.findIndex((item) => item.id === el?._id);
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
              id: el?._id,
              border: el?.name,
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
              border_id: el.id,
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
  }, [getMonthlyMealStats?.monthlyMeals, currentBorders]);
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

  useEffect(() => {
    if (mealStatMonthly?.length > 0) {
      const borderIndex = mealStatMonthly[0]?.finalArr.findIndex(
        (item) => item.border === user?.name
      );
      mainBodyRef?.current?.scrollTo({
        top: borderIndex * 40,
        behavior: "smooth",
      });
      // dateNameRef?.current?.scrollTo({
      //   top: borderIndex * 40,
      //   behavior: "smooth",
      // });
      setTimeout(() => {
        setNowScroll(true);
      }, 1000);
    }
  }, [mealStatMonthly, user]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const date = new Date();
  const currentMonth = date.toLocaleDateString('en-US', { month: 'long' });
  if (isLoading) {
    return <LoaderComponent />;
  }
  return (
    <div className="w-screen flex flex-col gap-8 justify-center mt-16 items-center">
      <div className="z-[0] align-self-start w-full md:w-[70%] relative flex flex-col">
        <div className="flex gap-[15px]">
          <div>
            <form class="max-w-[150px] mx-auto">
              <select onChange={(e) => {
                setYear(e.target.value)
              }} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {years.map((el, i) => {
                  return <option selected={el === new Date().getFullYear() ? true : false}>{el}</option>
                })}
              </select>
            </form>
          </div>
          <div>
            <form class="max-w-[150px] mx-auto">
              <select onChange={(e) => {
                setMonth(e.target.value)
              }} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {months.map((el, i) => {
                  return <option value={i} selected={currentMonth === el ? true : false}>{el}</option>
                })}
              </select>
            </form>
          </div>
          <div>
            <form class="max-w-[150px] mx-auto">
              <select onChange={(e) => {
                setDay(e.target.value)
              }} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {new Array(getCurrentMonthLength(0)).fill('0').map((el, i) => {
                  return <option selected={new Date().getDate() === i + 1 ? true : false}>{i + 1}</option>
                })}
              </select>
            </form>
          </div>
        </div>

        <div
          id="dropdownInformation"
          className={`z-10 ${display ? "block" : "hidden"
            } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
        >
          <div className="px-4 text-sm text-gray-900 dark:text-white">
            {todayMonth === 0
              ? "January"
              : todayMonth === 1
                ? "February"
                : todayMonth === 2
                  ? "March"
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
                            ? "March"
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
      {currentBorders?.length > 0 && mealStatMonthly?.length>0 && (
        <div
          ref={mainBodyRef}
          className="border shadow-lg w-full md:w-[70%] h-[250px] overflow-auto relative"
        >
          <table className="w-[1800px] bg-white text-black">
            <thead className="sticky top-0 shadow-md bg-white z-[100] h-[40px]">
              <tr className="">
                <th className="sticky left-0 top-0 bg-white border-r-2">
                  <table className="w-full h-[40px]">
                    <tr className="h-[40px]">
                      <th className="w-[80px] h-full">Date</th>
                      <th className="h-[40px] text-center">
                        <table className="w-full">
                          <tr>
                            <th className="border-l-2 h-[40px] text-center border-r-2">
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
                ?.filter((item) => item.month === `${month} 2025`)
                ?.map((el) => {
                  return (
                    <tbody>
                      <tr className={``}>
                        <th className="sticky left-0 bg-white z-50 shadow-md border-r-2">
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
                              <th className="w-full border-l-2 border-r-2">
                                <table className="w-full">
                                  {el.finalArr.map((item) => {
                                    return (
                                      <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
                                        <td className={`py-2`}>{item.border}</td>
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
                                <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
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
                                <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
                                  <td className={`py-2`}>{item.launch}</td>
                                </tr>
                              );
                            })}
                          </table>
                        </th>
                        <th className="border-r-2">
                          <table className="w-full">
                            {el.finalArr.map((item) => {
                              return (
                                <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
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
                                <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
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
                                <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
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
                                <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
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
                                <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
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
                                <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
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
                                <tr className={`${item.border_id === user?._id?'bg-green-500 text-white':''}`}>
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
      )}
    </div>
  );
};

export default AllMonthsStats;
