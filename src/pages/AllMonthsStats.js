import React, { useRef } from "react";
import { useGetMonthlyStatsQuery } from "../features/bikri/bikriApi";
import { useEffect } from "react";
import { useState } from "react";
import style from "./AllMonthsStats.module.css";
import { useDispatch } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
const AllMonthsStats = () => {
  const [mealStatMonthly, setMealStatMonthly] = useState([]);
  const { data: getMonthlyMealStats } = useGetMonthlyStatsQuery();
  console.log(getMonthlyMealStats?.monthlyMeals);
  const dateNameRef = useRef();
  const bodyRef = useRef();
  const headRef = useRef();
  const dispatch = useDispatch();
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
      getMonthlyMealStats.monthlyMeals.map((el) => {
        months.push(el._id);
        mealInfo.push([]);
        borders.push(el.border);
        breakfasts.push(el.breakfast);
        launchs.push(el.launch);
        dinners.push(el.dinner);
        moneys.push(el.money);
        shops.push(el.shop);
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
            };
          } else {
            arrEle.push({
              border: el.name,
              breakfast: breakfasts[i][elIndex][0],
              launch: launchs[i][elIndex][0],
              dinner: dinners[i][elIndex][0],
              money: moneys[i][elIndex],
              shop: shops[i][elIndex],
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
            };
          });
        });
        mealInfo[i] = {
          month: months[i]?.month + " " + months[i]?.year,
          overAllShop: finalArr.reduce((f, c) => f + c.totalShop, 0),
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
  console.log(mealStatMonthly);
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
      <div ref={headRef} className={style.customTableHeaderWrapper}>
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
              <td className={style.overAllMeal}>Over all Meal</td>
              <td className={style.totalDeposite}>
                <table>
                  <tr>
                    <td>Total Deposite</td>
                  </tr>
                </table>
              </td>
              <td className={style.totalShop}>
                <table>
                  <tr>
                    <td>Total Shop</td>
                  </tr>
                </table>
              </td>
              <td className={style.overAllShop}>Overall Shop</td>
              {/* Meal Rate */}
              <td className={style.mealRate}>Meal Rate</td>
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
                    <td>Border remaining Balance</td>
                  </tr>
                </table>
              </td>
              <td className={style.totalBalance}>Over all Money</td>
              <td className={style.headingRemainingBalance}>
                <div>Remaining Balance</div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={style.tableWrapper}>
        <table className={style.infoTable + " " + style.infoTableBody}>
          <tbody ref={bodyRef}>
            <div ref={dateNameRef} className={style.bodyMonthAndName}>
              {mealStatMonthly &&
                mealStatMonthly.map((el) => {
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
                                <tr>
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
                            <tr>
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
                            <tr>
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
                            <tr>
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
                            <tr>
                              <td>{el.totalMeal}</td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.overAllMeal}>{el.totalMeal}</td>
                    <td className={style.totalDeposite}>
                      <table>
                        {el.finalArr?.map((el) => {
                          return (
                            <tr>
                              <td>{el.totalMoney}</td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.totalShop}>
                      <table>
                        {el.finalArr?.map((el) => {
                          return (
                            <tr>
                              <td>{el.totalShop}</td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.overAllShop}>{el.overAllShop}</td>
                    {/* Meal Rate */}
                    {console.log(JSON.stringify(el.mealRate))}
                    <td className={style.mealRate}>
                      {isNaN(el.mealRate.toFixed(2))
                        ? 0
                        : el.mealRate.toFixed(2)}
                    </td>
                    <td className={style.borderConsume}>
                      <table>
                        {el.finalArr?.map((ele) => {
                          return (
                            <tr>
                              <td>
                                {isNaN((ele.totalMeal * el.mealRate).toFixed(2))
                                  ? 0
                                  : (ele.totalMeal * el.mealRate).toFixed(2)}
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
                            <tr>
                              <td>
                                {isNaN(
                                  ele.totalMoney - ele.totalMeal * el.mealRate
                                )
                                  ? 0
                                  : (
                                      ele.totalMoney -
                                      ele.totalMeal * el.mealRate
                                    ).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    </td>
                    <td className={style.totalBalance}>{el.overAllMoney}</td>
                    <td className={style.remainingBalance}>
                      {el.overAllMoney - el.overAllShop}
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
