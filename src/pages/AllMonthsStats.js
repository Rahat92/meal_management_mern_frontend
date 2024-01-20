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
  console.log(mealStatMonthly);
  return (
    <div>
      <div className="mx-[11%] mt-[25%] md:mt-[8%] bg-green-500">
        <h1>Meal Summary</h1>
        <div className="mt-3 w-full relative overflow-auto border">
          <div className="flex w-full sticky top-0 h-10 right-0 z-50 shadow-lg">
            <div className="sticky w-[250px] h-10 bg-red-500 top-0 left-0 shrink-0">
              <table className="w-full h-full">
                <tr>
                  <td className="w-[120px] bg-orange-500">Date</td>
                  <td>Name</td>
                </tr>
              </table>
            </div>

            <div className="absolute right-0 h-10 bg-yellow-500 left-[250px] top-0 overflow-auto">
              <table className="h-full w-[1600px]">
                <tr>
                  <td className="bg-green-100 w-[100px] text-blue-500">
                    Breakfast
                  </td>
                  <td className="bg-red-500 w-[100px]">Launch</td>
                  <td className="w-[100px] bg-green-300">Dinner</td>
                  <td className="w-[100px] bg-red-200">Total&nbsp;Meal</td>
                  <td className="w-[100px] bg-red-400">Overall&nbsp;Meal</td>
                  <td className="w-[100px] bg-red-500">Shopping</td>
                  <td className="w-[100px] bg-red-300">Meal&nbsp;Rate</td>
                  <td className="w-[150px] bg-red-400">Extra&nbsp;Shopping</td>
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
                  <td className="w-[100px] bg-red-400">Rest&nbsp;Balance</td>
                </tr>
              </table>
            </div>
          </div>

          <div className="bg-gray-300 flex h-[200px] relative shadow-sm">
            <div className="w-[250px] bg-orange-500 h-full overflow-auto shrink-0 z-10">
              <table className="">
                <tr>
                  <td className="w-[120px] bg-blue-500 block sticky top-[50%] translate-y-[-50%]">
                    january 2024
                  </td>
                  <td className="bg-red-500 w-full">
                    {/* Name */}
                    <table>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                      <tr>
                        <td>Kamrul</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>

            <div className="absolute h-full right-0 left-[250px] bg-yellow-500 overflow-auto">
              <table className="w-[1600px]">
                <tr>
                  <td className="bg-green-100 w-[100px]">
                    <table>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                      <tr>
                        <td>.5</td>
                      </tr>
                    </table>
                  </td>

                  <td className="bg-red-500 w-[100px]">
                    <table>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                    </table>
                  </td>

                  <td className="w-[100px] bg-green-300">
                    <table>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                      </tr>
                    </table>
                  </td>

                  <td className="w-[100px] bg-red-200">
                    <table>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                      <tr>
                        <td>75</td>
                      </tr>
                    </table>
                  </td>

                  <td className="w-[100px] bg-red-400 block sticky top-[50%] transform: translate-y-[-50%]">
                    Overall Meal
                  </td>

                  <td className="w-[100px] bg-red-500">
                    <table>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                    </table>
                  </td>

                  <td className="w-[100px] bg-red-300 block sticky top-[50%] transform: translate-y-[-50%]">
                    Meal Rate
                  </td>

                  <td className="w-[150px] bg-red-400">
                    <table>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>100</td>
                      </tr>
                    </table>
                  </td>

                  <td className="w-[150px] bg-red-300 block sticky top-[50%] transform: translate-y-[-50%]">
                    20000
                  </td>

                  <td className="w-[100px] bg-red-400">
                    <table>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                    </table>
                  </td>

                  <td className="w-[100px] bg-red-200">
                    <table>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>3000</td>
                      </tr>
                    </table>
                  </td>

                  <td className="w-[150px] bg-red-400">
                    <table>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>0</td>
                      </tr>
                    </table>
                  </td>

                  <td className="w-[150px] bg-red-300 block sticky top-[50%] transform: translate-y-[-50%]">
                    20000
                  </td>

                  <td></td>
                  <td className="w-[100px] bg-red-400 block sticky top-[50%] transform: translate-y-[-50%]">
                    0
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMonthsStats;
