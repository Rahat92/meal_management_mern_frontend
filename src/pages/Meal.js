import React, { useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { readableDate } from "../utils/readableDate";
import {
  useCreateMealMutation,
  useGetMonthlyMealsQuery,
  useGetMonthlyStatsQuery,
  useGetUsersQuery,
  useGetYearMonthQuery,
  useSignUpMutation,
  useUpdateMealMutation,
  useUpdateMyMealStatusMutation,
  useUpdatePersonFullMealMutation,
} from "../features/bikri/bikriApi";
import { useDispatch, useSelector } from "react-redux";
import style from "./Meal.module.css";
import UserHomeTable from "../components/UserHomeTable";
import { locationPathChanged } from "../features/locationPath";
import FilterBox from "../components/FilterBox";
import TableDateAndMealHeader from "../components/TableDateAndMealHeader";
import TableMealBody from "../components/TableMealBody";
import TableDateAndMealBody from "../components/TableDateAndMealBody";
const Meal = () => {
  const { user } = useSelector((state) => state.auth);
  const headRef = useRef();
  const tableBodyRef = useRef();
  const dateRef = useRef();
  const nameRef = useRef();
  const [arrOfMeals, setArrOfMeals] = useState([]);
  const [nowScroll, setNowScroll] = useState(false);
  const [item, setItem] = useState({});
  const [borderTotalDeposite, setBorderTotalDeposite] = useState(0);
  const [borderTotalShop, setBorderTotalShop] = useState(0);
  const [borderTotalExtraShop, setBorderTotalExtraShop] = useState(0);
  const [headHeight, setHeadHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState();
  const [id, setId] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [isChanged, setIsChanged] = useState(false);
  const [totalMeals, setTotalMeals] = useState([]);
  const [prevArrOfMeals, setPrevArrOfMeals] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [needUpdateObj, setNeedUpdateObj] = useState({});
  const [updatedArrOfMeals, setUpdatedArrOfMeals] = useState([]);
  const [screenWidth, setScreenWidth] = useState(null);
  const [moneyOption, setMoneyOption] = useState("");

  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();
  const todayDate = new Date().getDate();
  const [createMeal, { data: meals }] = useCreateMealMutation();
  const { data: yearMonth } = useGetYearMonthQuery();
  const [getMonth, setGetMonth] = useState(todayMonth);
  const [getYear, setGetYear] = useState(todayYear);

  // const [
  //   updateMoney,
  //   { data: money, isError: isUpdateMoneyError, error: updateMoneyError },
  // ] = useUpdateMoneyMutation();
  const [
    updatePersonFullMeal,
    {
      isSuccess: fullMealUpdateSuccess,
      isError: fullMealUpdateError,
      error: fullMealError,
    },
  ] = useUpdatePersonFullMealMutation();
  const [updateMeal, { isLoading, isSuccess, isError, error }] =
    useUpdateMealMutation();
  const [
    updateMyMealStatus,
    {
      isError: isMealStatusError,
      error: mealStatusError,
      isSuccess: mealStatusSuccess,
    },
  ] = useUpdateMyMealStatusMutation();
  const { data: getMonthlyMealStats } = useGetMonthlyStatsQuery();
  const [signUp] = useSignUpMutation();
  const { data: users } = useGetUsersQuery();
  const [isSkipped, setIsSkipped] = useState(true);
  const { data: monthlyMeals, isLoading: isMealsLoading } =
    useGetMonthlyMealsQuery(
      { getMonth, getYear },
      {
        skip: !isSkipped,
      }
    );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);
  useEffect(() => {
    // if (yearMonth?.yearMonth?.length > 0) {
    //   setGetMonth(yearMonth?.yearMonth[0].month * 1);
    //   setGetYear(yearMonth?.yearMonth[0].year * 1);
    //   setIsSkipped(true);
    // }
  }, [yearMonth?.yearMonth]);

  let monthLength = 0;
  let month = 1;
  let year = 2024;
  const currentDay = new Date().getDate();
  switch (month) {
    case 0:
      monthLength = 31;
      break;
    case 1:
      monthLength = 29;
      break;
    case 2:
      monthLength = 31;
      break;
    case 3:
      monthLength = 30;
      break;
    case 4:
      monthLength = 31;
      break;
    case 5:
      monthLength = 30;
      break;
    case 6:
      monthLength = 31; //july
      break;
    case 7:
      monthLength = 31; //august
      break;
    case 8:
      monthLength = 30;
      break;
    case 9:
      monthLength = 31; //octobar
      break;
    case 10:
      monthLength = 30;
      break;
    case 11:
      monthLength = 31;
      break;
    default:
      monthLength = 5;
  }
  const getMonthString = (desireMonth) => {
    let desireMonthString = 0;
    switch (desireMonth) {
      case "January":
        desireMonthString = 0;
        break;
      case "February":
        desireMonthString = 1;
        break;
      case "March":
        desireMonthString = 2;
        break;
      case "April":
        desireMonthString = 3;
        break;
      case "May":
        desireMonthString = 4;
        break;
      case "June":
        desireMonthString = 5;
        break;
      case "July":
        desireMonthString = 6;
        break;
      case "August":
        desireMonthString = 7;
        break;
      case "September":
        desireMonthString = 8;
        break;
      case "October":
        desireMonthString = 9;
        break;
      case "November":
        desireMonthString = 10;
        break;
      case "December":
        desireMonthString = 11;
        break;
      default:
        desireMonthString = undefined;
    }
    return desireMonthString;
  };
  useEffect(() => {
    if (isMealStatusError) {
      alert(mealStatusError?.data?.message);
    }
  }, [isMealStatusError]);

  // useEffect(() => {
  //   if (isUpdateMoneyError) {
  //     alert(updateMoneyError?.data?.message)
  //   }
  // }, [isUpdateMoneyError])
  useEffect(() => {
    if (fullMealUpdateError) {
      alert(fullMealError?.data?.message);
    }
  }, [fullMealUpdateError]);

  const [dates, setDates] = useState([]);

  useEffect(() => {
    let days = [];
    for (let i = 1; i <= monthLength; i++) {
      const time = readableDate(new Date(year, month, i));
      const readableYear = time.year;
      const readableMonth = time.month;
      const readableDay = time.day;
      days.push({
        date: `${readableDay} ${readableMonth} ${readableYear}`,
      });
    }
    // setDates(days);
    let borderIds = [];
    if (users?.borders?.length > 0) {
      users.borders.map((el) => {
        borderIds.push(el.name);
      });
      days = days.map((el) => {
        return {
          date: el.date,
          day: el.date.split(" ")[0],
          month,
          year,
          mealManager: "6570001d7e42deb0b24b9657",
        };
      });
    }
    setDates([...days]);
  }, [users?.borders]);

  useEffect(() => {
    if (user && user.role !== "admin" && user && user.role !== "superadmin") {
      setCurrentUser(user.name + " " + user._id);
    } else {
      setCurrentUser("all");
    }
  }, [user]);
  useEffect(() => {
    if (user && registeredUsers?.length > 0) {
      const index = registeredUsers.findIndex(
        (item) => item.name === user.name
      );
      if (user.role !== "admin" && user.role !== "superadmin") {
        setCurrentIndex(index);
      }
    }
  }, [user, registeredUsers]);
  useEffect(() => {
    // updateMeal({data:needUpdateObj,id})
  }, [needUpdateObj]);
  useEffect(() => {
    if (isSuccess) {
      setIsChanged(false);
      setUpdatedArrOfMeals([]);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (monthlyMeals?.monthlyMeals?.length > 0) {
      setRegisteredUsers([
        ...(monthlyMeals &&
          monthlyMeals.monthlyMeals &&
          monthlyMeals.monthlyMeals[0] &&
          monthlyMeals.monthlyMeals[0].border),
      ]);
      const mealsArr = monthlyMeals?.monthlyMeals?.map((el) => {
        return {
          id: el._id,
          date: el.date,
          month: el.month,
          year: el.year,
          breakfast: el.breakfast,
          launch: el.launch,
          dinner: el.dinner,
          money: el.money,
          shop: el.shop,
          extraShop: el.extraShop,
        };
      });
      setArrOfMeals(mealsArr);
      setPrevArrOfMeals(mealsArr);
    }
  }, [monthlyMeals?.monthlyMeals]);
  // submain branch
  useEffect(() => {
    if (prevArrOfMeals?.length > 0) {
      const changedArr = arrOfMeals.filter((item, i) => {
        if (
          JSON.stringify(item.breakfast) !==
            JSON.stringify(prevArrOfMeals[i].breakfast) ||
          JSON.stringify(item.launch) !==
            JSON.stringify(prevArrOfMeals[i].launch) ||
          JSON.stringify(item.dinner) !==
            JSON.stringify(prevArrOfMeals[i].dinner)
        ) {
          return true;
        }
      });
      setUpdatedArrOfMeals([...changedArr]);
      if (changedArr.length > 0) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }
  }, [prevArrOfMeals, arrOfMeals]);

  useEffect(() => {
    let totalBorderDeposite = 0;
    let totalBorderShop = 0;
    let totalBorderExtraShop = 0;
    if (arrOfMeals.length > 0) {
      const totalMealsCalc = arrOfMeals.map((el) => {
        const totalBreakfast = el.breakfast.reduce((f, c) => f + c[0], 0);
        const totalLaunch = el.launch.reduce((f, c) => f + c[0], 0);
        const totalDinner = el.dinner.reduce((f, c) => f + c[0], 0);
        totalBorderDeposite += el.money[currentIndex];
        totalBorderShop += el.shop[currentIndex];
        totalBorderExtraShop += el.extraShop[currentIndex];
        return {
          id: el.id,
          date: el.date,
          totalBreakfast,
          totalLaunch,
          totalDinner,
        };
      });
      setTotalMeals([
        ...totalMealsCalc.sort(
          (a, b) => a.date.split(" ")[0] - b.date.split(" ")[0]
        ),
      ]);
    }
    setBorderTotalDeposite(totalBorderDeposite);
    setBorderTotalShop(totalBorderShop);
    setBorderTotalExtraShop(totalBorderExtraShop);
  }, [arrOfMeals, currentIndex]);

  const updateMealHandler = (e, date, id, mealIndex, mealName, type) => {
    setId(id);
    const dateIndex = arrOfMeals.findIndex((item) => item.id === id);
    const copyArrOfMeals = [...arrOfMeals];
    const obj = copyArrOfMeals[dateIndex];
    const mealArr = obj[mealName];
    const copyMealArr = [...mealArr];
    const singleMeal = copyMealArr[mealIndex];
    const copySingleMeal = [...singleMeal];
    copySingleMeal[0] =
      type === "checkbox" && e.target.value === "on"
        ? 0
        : e.target.value === "off"
        ? mealName === "breakfast"
          ? 0.5
          : 1
        : e.target.value * 1;
    copySingleMeal[1] =
      type === "checkbox" ? (e.target.value === "on" ? "off" : "on") : "on";
    copyMealArr[mealIndex] = copySingleMeal;
    // const newMealArr = (obj[mealName] = mealArr);

    copyArrOfMeals[dateIndex] = { ...obj, [mealName]: copyMealArr };
    setArrOfMeals([...copyArrOfMeals]);
    // let updatedArr = [];
    const updatedDateObj = { ...obj, [mealName]: copyMealArr };
    let mealError = "";
    if (
      user?.role === "user" &&
      mealName === "breakfast" &&
      new Date() >
        new Date(
          updatedDateObj.year,
          updatedDateObj.month,
          updatedDateObj.date.split(" ")[0],
          6
        )
    ) {
      mealError = "You can't change previous Meal";
    }
    if (
      user?.role === "user" &&
      mealName === "launch" &&
      new Date() >
        new Date(
          updatedDateObj.year,
          updatedDateObj.month,
          updatedDateObj.date.split(" ")[0],
          10
        )
    ) {
      mealError = "You can't change previous Meal";
    }
    if (
      user?.role === "user" &&
      mealName === "dinner" &&
      new Date() >
        new Date(
          updatedDateObj.year,
          updatedDateObj.month,
          updatedDateObj.date.split(" ")[0],
          18
        )
    ) {
      mealError = "You can't change previous Meal";
    }
    if (
      user?.role === "admin" &&
      (mealName === "breakfast" ||
        mealName === "launch" ||
        mealName === "dinner") &&
      new Date() >
        new Date(
          updatedDateObj.year,
          updatedDateObj.month,
          updatedDateObj.date.split(" ")[0],
          24
        )
    ) {
      mealError = "Admin can't change previous days Meal";
    }

    if (mealError) {
      alert(mealError);
      prevArrOfMeals[dateIndex] = { ...obj, [mealName]: mealArr };
      setArrOfMeals([...prevArrOfMeals]);
      return;
    }
    updateMyMealStatus({
      id,
      [mealName]: updatedDateObj[mealName],
      mealName,
      year: updatedDateObj.date.split(" ")[2] * 1,
      month: getMonthString(updatedDateObj.date.split(" ")[1]),
      day: updatedDateObj.date.split(" ")[0],
      mealIndex,
      userIndex: registeredUsers.findIndex((item) => item._id === user._id),
    });
    setNeedUpdateObj(updatedDateObj);
  };
  const saveUpdate = () => {
    updatedArrOfMeals.map((el) => {
      updateMeal({ data: el, id: el.id });
    });
  };
  useEffect(() => {
    if (headRef.current) {
      setHeadHeight(headRef.current.offsetHeight);
    }
  }, [headRef?.current]);
  // useEffect(() => {
  //   signUp();
  // }, []);

  // useEffect(() => {
  //   window.addEventListener("scroll", function () {
  //     tableBodyRef?.current?.scrollTo(0, window.pageYOffset);
  //     dateRef?.current?.scrollTo(0, window.pageYOffset);
  //     nameRef?.current?.scrollTo(window.pageXOffset, 0);
  //   });
  // }, [window.pageYOffset, window.pageXOffset]);
  useEffect(() => {
    setMoneyOption("Deposite");
    setScreenWidth(window.screen.availWidth);
    window.addEventListener("resize", function () {
      setScreenWidth(window.screen.availWidth);
      setMoneyOption((prev) => (prev === "" ? "Deposite" : prev));
      if (window.screen.availWidth > 600) {
        setMoneyOption("Deposite");
      }
    });
  }, [window.screen]);
  useEffect(() => {
    let timer;
    if (arrOfMeals?.length > 0) {
      // window.scrollTo(0, (todayDate - 1) * 100);
      // window.scrollTo({ top: (todayDate - 1) * 100, scrollBehavior: "smooth" });
      dateRef?.current?.scrollTo({
        top: (todayDate - 1) * 100,
        behavior: "smooth",
      });
      tableBodyRef?.current?.scrollTo({
        top: (todayDate - 1) * 100,
        behavior: "smooth",
      });
      timer = setTimeout(() => {
        setNowScroll(true);
      }, (todayDate - 1) * 100);
    }
    // return () => clearTimeout(timer)
  }, [arrOfMeals?.length]);
  return (
    <div>
      <div
        ref={headRef}
        style={{
          position: "fixed",
          top: "40px",
          right: "0",
          left: "0",
          background: "gray",
          zIndex: "100",
          // display: "none",
        }}
      >
        <FilterBox
          setGetYear={setGetYear}
          setGetMonth={setGetMonth}
          style={style}
          yearMonth={yearMonth}
          registeredUsers={registeredUsers}
          setCurrentIndex={setCurrentIndex}
          setCurrentUser={setCurrentUser}
          user={user}
          todayMonth={todayMonth}
          todayYear={todayYear}
          isLoading={isLoading}
          isChanged={isChanged}
        />

        {/* <button
          style={{
            display: user?.role !== "admin" ? "none" : "",
            color: "black",
          }}
          onClick={() => createMeal(dates)}
        >
          Create Meal
        </button> */}
        <div style={{ background: "" }}>
          {arrOfMeals?.length > 0 && (
            <TableDateAndMealHeader
              currentUser={currentUser}
              headRef={headRef}
              screenWidth={screenWidth}
            />
          )}

          {/* Border's Name */}
          <div
            ref={nameRef}
            onScroll={() => {
              if (nowScroll) {
                tableBodyRef?.current?.scrollTo(
                  nameRef.current.scrollLeft,
                  tableBodyRef.current.scrollTop
                );
              }
            }}
            style={{
              position: "fixed",
              left:
                currentUser !== "all"
                  ? "35%"
                  : screenWidth > 1000
                  ? "23%"
                  : "150px",
              top: headRef,
              right:
                screenWidth > 1000
                  ? currentUser === "all"
                    ? "18%"
                    : "11%"
                  : "0",
              color: "black",
              height: "50px",
              overflowX: "scroll",
              width: currentUser !== "all" ? "" : "",
              // display:'none'
            }}
          >
            <table
              style={{
                width:
                  currentUser !== "all"
                    ? "100%"
                    : registeredUsers?.length * 150 + 0.5 + "px",
                height: "100%",
                background: "white",
                borderBottom: "2px solid black",
                borderRight: currentUser == "all" ? "1px solid black" : "",
                // display: "none",
                // scrollBehavior: "smooth",
              }}
            >
              <thead>
                <tr
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  {registeredUsers
                    ?.filter((el) => {
                      if (currentUser !== "all") {
                        if (el._id === currentUser?.split(" ")[1]) {
                          return true;
                        }
                      } else {
                        return true;
                      }
                    })
                    ?.map((el) => {
                      return (
                        // Start Here
                        <td
                          style={{
                            width: currentUser !== "all" ? "100%" : "150px",
                            borderRight:
                              currentUser == "all" ? "2px solid green" : "",
                            textAlign: "center",
                            borderLeft: "1px solid blue",
                          }}
                        >
                          <table
                            style={{
                              height: "100%",
                              width: currentUser !== "all" ? "100%" : "100%",
                              // background: 'red',
                              // scrollBehavior: "smooth",
                            }}
                          >
                            <tr
                              style={{
                                // borderBottom: "1px solid red",
                                width: "100%",
                                height: "100%",
                              }}
                            >
                              <th
                                style={{
                                  width:
                                    currentUser !== "all" ? "65%" : "150px",
                                }}
                              >
                                {/* {currentUser !== "all"
                                  ? `Total Deposite: ${borderTotalDeposite}`
                                  : el.name} */}
                                {currentUser !== "all" ? (
                                  <table
                                    style={{
                                      width: "100%",
                                      textAlign: "center",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          width: "25%",
                                        }}
                                      >
                                        <span
                                          style={{
                                            display: "inline-block",
                                            marginLeft: "-1.4rem",
                                          }}
                                        >
                                          Meal
                                        </span>
                                      </td>
                                      {/* <td>jsj</td> */}
                                      <td
                                        style={{
                                          width: "25%",
                                          position: "relative",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <p
                                          style={{
                                            position: "absolute",
                                            top: "-.2rem",
                                            width: "100%",
                                            textAlign: "center",
                                          }}
                                        >
                                          {screenWidth < 600 ? (
                                            <select
                                              style={{ fontSize: "14px" }}
                                              onChange={(e) => {
                                                setMoneyOption(e.target.value);
                                              }}
                                            >
                                              <option>Deposite</option>
                                              <option>Shopping</option>
                                              <option>Extra</option>
                                            </select>
                                          ) : (
                                            <p style={{ fontSize: "14px" }}>
                                              Deposite
                                            </p>
                                          )}
                                        </p>
                                        <p
                                          style={{
                                            position: "absolute",
                                            width: "100%",
                                            textAlign: "center",
                                            marginTop: "3px",
                                          }}
                                        >
                                          {moneyOption === "Deposite"
                                            ? borderTotalDeposite
                                            : moneyOption === "Shopping"
                                            ? borderTotalShop
                                            : moneyOption === "Extra"
                                            ? borderTotalExtraShop
                                            : ""}{" "}
                                          Tk
                                        </p>
                                      </td>

                                      <td
                                        style={{
                                          width: "25%",
                                          position: "relative",
                                          fontSize: "12px",
                                          display:
                                            screenWidth < 600 ? "none" : "",
                                        }}
                                      >
                                        <p
                                          style={{
                                            position: "absolute",
                                            top: "-.2rem",
                                            width: "100%",
                                            textAlign: "center",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Shopping
                                        </p>
                                        <p
                                          style={{
                                            position: "absolute",
                                            width: "100%",
                                            textAlign: "center",
                                            marginTop: "3px",
                                          }}
                                        >
                                          {borderTotalShop} Tk
                                        </p>
                                      </td>
                                      <td
                                        style={{
                                          width: "25%",
                                          position: "relative",
                                          fontSize: "12px",
                                          display:
                                            screenWidth < 600 ? "none" : "",
                                        }}
                                      >
                                        <p
                                          style={{
                                            position: "absolute",
                                            top: "-.2rem",
                                            width: "100%",
                                            textAlign: "center",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Extra Shop
                                        </p>
                                        <p
                                          style={{
                                            position: "absolute",
                                            width: "100%",
                                            textAlign: "center",
                                            marginTop: "3px",
                                          }}
                                        >
                                          {borderTotalExtraShop} Tk
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                ) : (
                                  el.name
                                )}
                              </th>
                            </tr>
                          </table>
                        </td>
                      );
                    })}
                  {/* {arrOfMeals?.length > 0 && (
                    <th
                      style={{
                        // width: currentUser !== "all" && "150px",
                        // minWidth: currentUser !== "all" && "150px",
                        width: "150px",
                        // borderRight: "2px solid black",
                        display: currentUser !== "all" ? "none" : "",
                      }}
                    >
                      Total Meal
                    </th>
                  )} */}
                </tr>
              </thead>
            </table>
            {arrOfMeals?.length > 0 && (
              <div
                style={{
                  position: "fixed",
                  right: "11%",
                  top: headHeight + 90 - 50 + "px",
                  // borderBottom: "5px solid black",
                  height: "50px",
                  bottom: "0",
                  // background: "red",
                  width: "7%",
                  zIndex: "100000",
                  // borderRight: "1px solid black",
                  borderLeft: "1px solid black",
                  // boxShadow: "3px 0 6px -3px #888",

                  boxShadow: "1px 0 4px -2px black",

                  display: currentUser !== "all" ? "none" : "",
                }}
              >
                <table
                  style={{
                    borderBottom: "2px solid black",
                    width: "100%",
                    height: "50px",
                  }}
                >
                  <tr>
                    {arrOfMeals?.length > 0 && (
                      <th
                        style={{
                          // width: currentUser !== "all" && "150px",
                          // minWidth: currentUser !== "all" && "150px",
                          // borderRight: "2px solid black",
                          display: currentUser !== "all" ? "none" : "",
                        }}
                      >
                        Total Meal
                      </th>
                    )}
                  </tr>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <div ref={tableBodyRef} style={{ marginLeft: "150px" }}> */}
      <div
        style={{
          position: "fixed",
          top: headHeight + 90 - 50 + "px",
          bottom: "0",
          left: "0",
          right: "0",
          zIndex: "1000",
          color: "black",

          display: !isMealsLoading ? "none" : "flex",
          justifyContent: "center",
          fontweight: "bold",
          fontSize: "20px",
          // scrollBehavior: "smooth",
          // display:'none'
        }}
      >
        <p style={{ marginTop: "10rem", opacity: ".7" }}>
          Loading Meals, please wait...
        </p>
      </div>

      <TableMealBody
        arrOfMeals={arrOfMeals}
        currentDay={currentDay}
        registeredUsers={registeredUsers}
        currentUser={currentUser}
        setArrOfMeals={setArrOfMeals}
        updateMealHandler={updateMealHandler}
        updatePersonFullMeal={updatePersonFullMeal}
        user={user}
        prevArrOfMeals={prevArrOfMeals}
        screenWidth={screenWidth}
        moneyOption={moneyOption}
        item={item}
        setItem={setItem}
        totalMeals={totalMeals}
        tableBodyRef={tableBodyRef}
        headHeight={headHeight}
        dateRef={dateRef}
        nowScroll={nowScroll}
        nameRef={nameRef}
        todayDate={todayDate}
      />
      {/* </div> */}
      {/* fixed */}
      {arrOfMeals?.length > 0 && (
        <TableDateAndMealBody
          dateRef={dateRef}
          currentUser={currentUser}
          headHeight={headHeight}
          arrOfMeals={arrOfMeals}
          currentDay={currentDay}
          todayDate={todayDate}
          tableBodyRef={tableBodyRef}
          nowScroll={nowScroll}
          screenWidth={screenWidth}
        />
      )}
    </div>
  );
};

export default Meal;
