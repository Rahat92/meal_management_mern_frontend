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

  return (
    <div>
      <div className={style.fixedMonthAndName}>
        <table>
          <tr>
            <td className={style.month}>Month</td>
            <td className={style.border}>
              <table>
                <tr>
                  <td>Name</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      <div
        onScroll={() => {
          window.scrollTo(headRef.current.scrollLeft, window.pageYOffset)
        }}
        ref={headRef}
        className={style.customTableHeaderWrapper}
      >
        <table className={style.infoTable}>
          <tbody>
            <tr>
              <td className={style.breakfast}>
                <table>
                  <tr>
                    <td style={{ textAlign: "center" }}>Breakfast</td>
                  </tr>
                </table>
              </td>
              <td className={style.launch}>
                <table>
                  <tr>
                    <td>Launch</td>
                  </tr>
                </table>
              </td>
              <td className={style.dinner}>
                <table>
                  <tr>
                    <td>Dinner</td>
                  </tr>
                </table>
              </td>
              <td className={style.totalMeal}>
                <table>
                  <tr>
                    <td>Total Meal</td>
                  </tr>
                </table>
              </td>
              <td className={style.overAllMeal}>
                Overall
                <br /> Meal
              </td>

              <td className={style.totalShop}>
                <table>
                  <tr>
                    <td>Total Shop</td>
                  </tr>
                </table>
              </td>
              <td className={style.totalExtraShop}>
                <table>
                  <tr>
                    <td>
                      Total Extra
                      <br /> Shop
                    </td>
                  </tr>
                </table>
              </td>
              {/* <td className={style.overAllShop}>Overall Shop</td> */}
              {/* Meal Rate start */}
              <td className={style.mealRate}>Meal Rate</td>
              {/* Meal Rate end */}
              {/* total deposite person */}
              <td className={style.totalDeposite}>
                <table>
                  <tr>
                    <td>Total Deposite</td>
                  </tr>
                </table>
              </td>
              {/* total deposite person */}

              <td className={style.borderConsume}>
                <table>
                  <tr>
                    <td>Border Consume</td>
                  </tr>
                </table>
              </td>
              <td className={style.restBalance}>
                <table>
                  <tr>
                    <td>
                      Border remaining
                      <br /> Balance
                    </td>
                  </tr>
                </table>
              </td>
              <td className={style.totalBalance}>Overall Deposite</td>
              <td className={style.overAllShop}>
                Overall
                <br /> Shop
              </td>
              <td className={style.headingRemainingBalance}>
                Remaining
                <br /> Balance
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      {console.log(mealStatMonthly)}
      <div className={style.tableWrapper}>
        <table className={style.infoTable + " " + style.infoTableBody}>
          <tbody ref={bodyRef}>
            <div ref={dateNameRef} className={style.bodyMonthAndName}>
              {mealStatMonthly &&
                mealStatMonthly
                  ?.sort(
                    (a, b) => b.month.split(" ")[0] - a.month.split(" ")[0]
                  )
                  ?.sort(
                    (a, b) => b.month.split(" ")[1] - a.month.split(" ")[1]
                  )
                  ?.map((el) => {
                    console.log(el);
                    return (
                      <table>
                        <tr>
                          <td className={style.month}>
                            <div
                              style={{
                                // transform: "rotate(-50deg)",
                                fontWeight: "700",
                              }}
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
                            </div>
                          </td>
                          <td className={style.border}>
                            <table>
                              {el.finalArr?.map((el) => {
                                return (
                                  <tr
                                    style={{
                                      background:
                                        el.border === user?.name
                                          ? "rgba(100, 255,200,.8)"
                                          : "",
                                      color:
                                        el.border === user?.name ? "black" : "",
                                    }}
                                  >
                                    <td>{el.border}</td>
                                  </tr>
                                );
                              })}
                            </table>
                          </td>
                        </tr>
                      </table>
                    );
                  })}
            </div>
            {mealStatMonthly &&
              mealStatMonthly.map((el) => {
                return (
                  <tr>
                    <td className={style.breakfast}>
                      <table>
                        {el.finalArr?.map((el) => {
                          return (
                            <tr
                              style={{
                                background:
                                  el.border === user?.name ? "green" : "",
                                color: el.border === user?.name ? "white" : "",
                              }}
                            >
                              <td style={{ textAlign: "center" }}>
                                {el.breakfast}
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.launch}>
                      <table>
                        {el.finalArr?.map((el) => {
                          return (
                            <tr
                              style={{
                                background:
                                  el.border === user?.name ? "green" : "",
                                color: el.border === user?.name ? "white" : "",
                              }}
                            >
                              <td>{el.launch}</td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.dinner}>
                      <table>
                        {el.finalArr?.map((el) => {
                          return (
                            <tr
                              style={{
                                background:
                                  el.border === user?.name ? "green" : "",
                                color: el.border === user?.name ? "white" : "",
                              }}
                            >
                              <td>{el.dinner}</td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.totalMeal}>
                      <table>
                        {el.finalArr?.map((el) => {
                          return (
                            <tr
                              style={{
                                background:
                                  el.border === user?.name ? "green" : "",
                                color: el.border === user?.name ? "white" : "",
                              }}
                            >
                              <td>{el.totalMeal}</td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    {/* Overall Meal */}
                    <td className={style.overAllMeal}>{el.totalMeal}</td>
                    {/* Total Shop */}
                    <td className={style.totalShop}>
                      <table>
                        {el.finalArr?.map((el) => {
                          return (
                            <tr
                              style={{
                                background:
                                  el.border === user?.name ? "green" : "",
                                color: el.border === user?.name ? "white" : "",
                              }}
                            >
                              <td>{el.totalShop}</td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    {/* total Extra Shop */}
                    <td className={style.totalExtraShop}>
                      <table>
                        {el.finalArr?.map((el) => {
                          return (
                            <tr
                              style={{
                                background:
                                  el.border === user?.name ? "green" : "",
                                color: el.border === user?.name ? "white" : "",
                              }}
                            >
                              <td>{el.totalExtraShop}</td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>

                    {/* Overall Shop */}
                    {/* <td className={style.overAllShop}>
                      {el.overAllShop + el.overAllExtraShop}
                    </td> */}
                    {/* Meal Rate */}
                    <td className={style.mealRate}>
                      {isNaN(el.mealRate.toFixed(2))
                        ? 0
                        : el.mealRate.toFixed(2)}
                    </td>
                    <td className={style.totalDeposite}>
                      <table>
                        {el.finalArr?.map((el) => {
                          return (
                            <tr
                              style={{
                                background:
                                  el.border === user?.name ? "green" : "",
                                color: el.border === user?.name ? "white" : "",
                              }}
                            >
                              <td>{el.totalMoney}</td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.borderConsume}>
                      <table>
                        {el.finalArr?.map((ele) => {
                          return (
                            <tr
                              style={{
                                background:
                                  ele.border === user?.name ? "green" : "",
                                color: ele.border === user?.name ? "white" : "",
                              }}
                            >
                              <td>
                                {isNaN(
                                  (
                                    ele.totalMeal * el.mealRate +
                                    el.overAllExtraShop / el.finalArr.length
                                  ).toFixed(2)
                                )
                                  ? 0
                                  : (
                                      ele.totalMeal * el.mealRate +
                                      el.overAllExtraShop / el.finalArr.length
                                    ).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.restBalance}>
                      <table>
                        {el.finalArr?.map((ele) => {
                          return (
                            <tr
                              style={{
                                background:
                                  ele.border === user?.name ? "green" : "",
                                color: ele.border === user?.name ? "white" : "",
                              }}
                            >
                              <td>
                                {isNaN(
                                  ele.totalMoney -
                                    ele.totalMeal * el.mealRate -
                                    el.overAllExtraShop / el.finalArr.length
                                )
                                  ? 0
                                  : (
                                      ele.totalMoney -
                                      ele.totalMeal * el.mealRate -
                                      el.overAllExtraShop / el.finalArr.length
                                    ).toFixed(2)}
                              </td>
                              {/* <td>
                                <button
                                  onClick={() =>
                                    sendSms({
                                      restBalance: (
                                        ele.totalMoney -
                                        ele.totalMeal * el.mealRate -
                                        el.overAllExtraShop / el.finalArr.length
                                      ).toFixed(2),
                                    })
                                  }
                                >
                                  Send Sms
                                </button>
                              </td> */}
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.totalBalance}>{el.overAllMoney}</td>
                    <td className={style.overAllShop}>
                      {el.overAllShop + el.overAllExtraShop}
                    </td>
                    <td className={style.remainingBalance}>
                      {el.overAllMoney - el.overAllShop - el.overAllExtraShop}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllMonthsStats;
