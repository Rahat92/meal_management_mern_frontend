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
    <div className="w-screen h-screen bg-green-500 flex justify-center items-center">
      <div className="w-full md:w-[60%] h-[150px] bg-red-500 overflow-auto">
        <table className="w-[1800px] bg-blue-500">
          <thead className="sticky top-0 bg-pink-500 z-[100]">
            <tr>
              <th className="sticky left-0 top-0 bg-orange-500">
                <table className="w-full">
                  <tr>
                    <th className="w-[100px]">Date</th>
                    <th>Name</th>
                  </tr>
                </table>
              </th>
              <th>Breakfast</th>
              <th>Launch</th>
              <th>Dinner</th>
              <th>Total&nbsp;Meal</th>
              <th>Overall&nbsp;Meal</th>
              <th>Shopping</th>
              <th>Meal&nbsp;Rate</th>
              <th>Extra&nbsp;Shopping</th>
              <th>Overall&nbsp;Shopping</th>
              <th>Deposite</th>
              <th>Consume</th>
              <th>Remaining&nbsp;Balance</th>
              <th>Overall&nbsp;Deposite</th>
              <th></th>
              <th>Rest&nbsp;Balance</th>
            </tr>
          </thead>
          {mealStatMonthly?.length > 0
            ? mealStatMonthly
                ?.sort((a, b) => b.month.split(" ")[0] - a.month.split(" ")[0])
                ?.sort((a, b) => b.month.split(" ")[1] - a.month.split(" ")[1])
                ?.filter((item) => item.month === "1 2024")
                ?.map((el) => {
                  return (
                    <tbody>
                      <tr>
                        <th className="sticky left-0 bg-orange-500 z-50">
                          <table className="w-full">
                            <tr>
                              <th className="sticky top-[50%] transform translate-y-[-50%] block w-[100px]" style = {{backfaceVisibility:'hidden'}}>
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
                              <th className="w-full">
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
                        <th>
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
                        <th>
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
                        <th>
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
                        <th>
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
                        <th className="block sticky top-[50%] transform translate-y-[-50%]">
                          {el.totalMeal}
                        </th>
                        <th>
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
                        <th className="block sticky top-[50%] transform translate-y-[-50%]">
                          {isNaN(el.mealRate.toFixed(2))
                            ? 0
                            : el.mealRate.toFixed(2)}
                        </th>
                        <th>
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
                        <th className="block sticky top-[50%] transform translate-y-[-50%]">
                          {el.overAllShop + el.overAllExtraShop}
                        </th>
                        <th>
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
                        <th>
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
                        <th>
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
                        <th className="block sticky top-[50%] transform translate-y-[-50%]">
                          {el.overAllMoney}
                        </th>
                        <th></th>
                        <th className="block sticky top-[50%] transform translate-y-[-50%]">
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
