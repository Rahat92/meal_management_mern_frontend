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
  useUpdateMoneyMutation,
  useUpdateMyMealStatusMutation,
  useUpdatePersonFullMealMutation,
  useUpdateShopMoneyMutation,
} from "../features/bikri/bikriApi";
import { useDispatch, useSelector } from "react-redux";
import style from "./Meal.module.css";
import UserHomeTable from "../components/UserHomeTable";
import { locationPathChanged } from "../features/locationPath";
const Meal = () => {
  const { user } = useSelector((state) => state.auth);
  const headRef = useRef();
  const tableBodyRef = useRef();
  const dateRef = useRef();
  const nameRef = useRef();
  const [arrOfMeals, setArrOfMeals] = useState([]);
  const [borderTotalDeposite, setBorderTotalDeposite] = useState([]);
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
  const [
    updateShopMoney,
    { data: shopMoney, isError: isShopMoneyError, error: shopMoneyError },
  ] = useUpdateShopMoneyMutation();
  const [createMeal, { data: meals }] = useCreateMealMutation();
  const { data: yearMonth } = useGetYearMonthQuery();
  const [getMonth, setGetMonth] = useState(yearMonth?.yearMonth[0]?.month * 1);
  const [getYear, setGetYear] = useState(
    yearMonth?.yearMonth && yearMonth.yearMonth[0]?.year * 1
  );

  const [
    updateMoney,
    { data: money, isError: isUpdateMoneyError, error: updateMoneyError },
  ] = useUpdateMoneyMutation();
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
  const { data: monthlyMeals } = useGetMonthlyMealsQuery(
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
    if (yearMonth?.yearMonth?.length > 0) {
      setGetMonth(yearMonth?.yearMonth[0].month * 1);
      setGetYear(yearMonth?.yearMonth[0].year * 1);
      setIsSkipped(true);
    }
  }, [yearMonth?.yearMonth]);

  let monthLength = 0;
  let month = 0;
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
  useEffect(() => {
    if (isShopMoneyError) {
      console.log("good");
      alert(shopMoneyError?.data?.message);
    }
  }, [isShopMoneyError]);
  useEffect(() => {
    if (isUpdateMoneyError) {
      alert(updateMoneyError?.data.message);
    }
  }, [isUpdateMoneyError]);
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
          month,
          year,
          mealManager: "6570001d7e42deb0b24b9657",
          // border: borderIds,
          // breakfast: Array(borderIds.length).fill([0, "on"]),
          // launch: Array(borderIds.length).fill([0, "on"]),
          // dinner: Array(borderIds.length).fill([0, "on"]),
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
        };
      });
      setArrOfMeals(mealsArr);
      setPrevArrOfMeals(mealsArr);
    }
  }, [monthlyMeals?.monthlyMeals]);
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
    if (arrOfMeals.length > 0) {
      const totalMealsCalc = arrOfMeals.map((el) => {
        const totalBreakfast = el.breakfast.reduce((f, c) => f + c[0], 0);
        const totalLaunch = el.launch.reduce((f, c) => f + c[0], 0);
        const totalDinner = el.dinner.reduce((f, c) => f + c[0], 0);
        const currentUserMoney = el.money[currentIndex];
        totalBorderDeposite += currentUserMoney;
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
    console.log(totalBorderDeposite);
    setBorderTotalDeposite(totalBorderDeposite);
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
        ? 0
        : e.target.value * 1;
    copySingleMeal[1] =
      type === "checkbox" ? (e.target.value === "on" ? "off" : "on") : "on";
    copyMealArr[mealIndex] = copySingleMeal;
    // const newMealArr = (obj[mealName] = mealArr);

    copyArrOfMeals[dateIndex] = { ...obj, [mealName]: copyMealArr };
    setArrOfMeals([...copyArrOfMeals]);
    // let updatedArr = [];
    const updatedDateObj = { ...obj, [mealName]: copyMealArr };
    console.log(updatedDateObj)
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
      (user?.role === "admin" || user?.role === "superadmin") &&
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
      console.log(prevArrOfMeals)
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
      console.log(headRef.current.offsetHeight);
      setHeadHeight(headRef.current.offsetHeight);
    }
  }, [headRef?.current]);
  // useEffect(() => {
  //   signUp();
  // }, []);
  useEffect(() => {
    window.addEventListener("scroll", function () {
      tableBodyRef?.current?.scrollTo(0, window.pageYOffset);
      dateRef?.current?.scrollTo(0, window.pageYOffset);
      nameRef?.current?.scrollTo(window.pageXOffset, 0);
    });
  }, [window.pageYOffset, window.pageXOffset]);
  console.log(getMonth, getYear);
  return (
    <div>
      {/* <button onClick={() => {
        signUp()
      }}>Sign Up</button> */}
      <div
        ref={headRef}
        style={{
          position: "fixed",
          top: "50px",
          right: "0",
          left: "0",
          background: "gray",
          zIndex: "100",
        }}
      >
        <div>
          <form>
            <select
              className={style.selectMonthYear}
              onChange={(e) => {
                setGetYear(e.target.value.split(" ")[1] * 1);
                setGetMonth(e.target.value.split(" ")[0] * 1);
              }}
            >
              {yearMonth?.yearMonth?.map((el) => {
                return (
                  <option value={el.month + " " + el.year}>
                    {el.month === 0
                      ? "January"
                      : el.month === 11
                      ? "December"
                      : ""}{" "}
                    {el.year}
                  </option>
                );
              })}
            </select>
          </form>
          <form>
            <select
              style={{ color: "black" }}
              onChange={(e) => {
                console.log(e.target.value);
                if (e.target.value !== "all") {
                  const index = registeredUsers.findIndex(
                    (item) => item._id === e.target.value.split(" ")[1]
                  );
                  setCurrentIndex(index);
                }
                setCurrentUser(e.target.value);
              }}
            >
              {user?.role !== "admin" && user?.role !== "superadmin" && (
                <option value={user?.name + " " + user?._id}>
                  {user?.name}
                </option>
              )}
              <option>all</option>
              {user?.role === "admin" && (
                <option value={user?.name + " " + user?._id}>
                  {user?.name}
                </option>
              )}
              {(user?.role === "admin" || user?.role === "superadmin") &&
                registeredUsers
                  ?.filter((el) => el._id !== user?._id)
                  .map((el) => {
                    return (
                      <option value={el.name + " " + el._id}>{el.name}</option>
                    );
                  })}
            </select>
          </form>
        </div>
        <div>
          <button
            style={{ color: isChanged ? "red" : "white" }}
            disabled={!isChanged || isLoading}
            onClick={saveUpdate}
          >
            Update
          </button>
        </div>

        <button
          style={{
            display: user?.role !== "admin" ? "none" : "",
            color: "black",
          }}
          onClick={() => createMeal(dates)}
        >
          Create Meal
        </button>
        <div style={{ background: "" }}>
          <div
            style={{
              width: currentUser !== "all" ? "35%" : "150px",
              position: "fixed",
              top: headRef,
              height: "50px",
              background: "white",
              color: "black",
              borderBottom: "2px solid black",
            }}
          >
            <table style={{ width: "100%", height: "100%" }}>
              <tr
                style={{
                  borderRight: "2px solid black",
                  width: "100%",
                }}
              >
                <th
                  style={{
                    textAlign: "center",
                    width: "50px",
                    borderRight: "2px solid green",
                  }}
                >
                  Dates
                </th>
                <th style={{ textAlign: "center" }}>Meal</th>
              </tr>
            </table>
          </div>
          <div
            ref={nameRef}
            style={{
              position: "fixed",
              left: currentUser !== "all" ? "35%" : "150px",
              top: headRef,
              right: "0",
              color: "black",
              height: "50px",
              overflowX: "scroll",
              width: currentUser !== "all" ? "" : "",
            }}
          >
            <table
              style={{
                // width: currentUser !== "all" ? "226px" : "1200px",
                width:
                  currentUser !== "all"
                    ? "100%"
                    : registeredUsers?.length * 150 + 151 + "px",
                height: "100%",
                background: "white",
                borderBottom: "2px solid black",
                borderRight: "2px solid black",
              }}
            >
              <thead>
                <tr
                  style={{
                    height: "100%",
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
                            borderRight: "2px solid green",
                            textAlign: "center",
                            borderLeft: "1px solid blue",
                          }}
                        >
                          <table
                            style={{
                              height: "100%",
                              width: currentUser !== "all" ? "100%" : "",
                              // background: 'red',
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
                                {currentUser !== "all"
                                  ? `Total Deposite: ${borderTotalDeposite}`
                                  : el.name}
                              </th>
                            </tr>
                          </table>
                        </td>
                      );
                    })}
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
                  {/* <th></th> */}
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>

      {/* <div ref={tableBodyRef} style={{ marginLeft: "150px" }}> */}
      <table
        ref={tableBodyRef}
        style={{
          // width: currentUser !== "all" ? "226px" : "1200px",
          width:
            currentUser !== "all"
              ? "65%"
              : registeredUsers?.length * 150 + 151 + "px",

          marginTop: headHeight + 100 + "px",
          marginLeft: currentUser !== "all" ? "35%" : "150px",
          borderRight: "2px solid black",
          borderLeft: "1px solid blue",
          borderTop: "1px solid blue",
        }}
      >
        <tbody style={{}}>
          {arrOfMeals
            .sort((a, b) => a.date.split(" ")[0] - b.date.split(" ")[0])
            .filter((item) => {
              if (1 === 0) {
                if (item.date === `${currentDay} December 2023`) {
                  return true;
                }
              } else {
                if (item.date) {
                  return true;
                }
              }
            })
            ?.map((el, i) => {
              return (
                <tr
                  style={{
                    borderBottom: "2px solid green",
                    height: "100px",
                  }}
                >
                  {registeredUsers?.map((element, index) => {
                    if (element._id === currentUser?.split(" ")[1]) {
                      return (
                        <UserHomeTable
                          el={el}
                          index={index}
                          arrOfMeals={arrOfMeals}
                          setArrOfMeals={setArrOfMeals}
                          updateMealHandler={updateMealHandler}
                          updatePersonFullMeal={updatePersonFullMeal}
                          registeredUsers={registeredUsers}
                          user={user}
                          updateMoney={updateMoney}
                          updateShopMoney={updateShopMoney}
                        />
                      );
                    } else if (currentUser === "all") {
                      return (
                        // User Breakfast
                        <td
                          style={{
                            width: "150px",
                            textAlign: "center",
                            borderRight: "2px solid green",
                          }}
                        >
                          <table style={{ width: "100%" }}>
                            <tr
                              style={{
                                borderBottom: "1px solid white",
                              }}
                            >
                              <td
                                style={
                                  {
                                    // padding: "1px 0",
                                    // paddingTop: "6px",
                                  }
                                }
                              >
                                <input
                                  disabled={
                                    (el.breakfast &&
                                      el.breakfast[index] &&
                                      el.breakfast[index][1] === "off") ||
                                    el.breakfast[index][2] === "user"
                                    // ||user?.role === "user"
                                  }
                                  onChange={(e) =>
                                    updateMealHandler(
                                      e,
                                      el.date,
                                      el.id,
                                      index,
                                      "breakfast"
                                    )
                                  }
                                  style={{
                                    color: "black",
                                    background: "white",
                                    border: "1.5px solid black",
                                    borderRadius: "5px",
                                    width: "40px",
                                    textAlign: "center",
                                  }}
                                  type={
                                    el.breakfast &&
                                    el.breakfast[index] &&
                                    el.breakfast[index][1] === "off"
                                      ? "text"
                                      : "number"
                                  }
                                  value={
                                    el.breakfast &&
                                    el.breakfast[index] &&
                                    el.breakfast[index][1] === "off"
                                      ? "off"
                                      : el.breakfast &&
                                        el.breakfast[index] &&
                                        el.breakfast[index][0] === 0
                                      ? ""
                                      : el.breakfast &&
                                        el.breakfast[index] &&
                                        el.breakfast[index][0]
                                  }
                                />
                              </td>
                            </tr>
                            {/* All User Launch */}
                            <tr style={{ borderBottom: "1px solid white" }}>
                              <td>
                                <input
                                  disabled={
                                    (el.launch &&
                                      el.launch[index] &&
                                      el.launch[index][1] === "off") ||
                                    el.launch[index][2] === "user"
                                    // ||user?.role === "user"
                                  }
                                  onChange={(e) =>
                                    updateMealHandler(
                                      e,
                                      el.date,
                                      el.id,
                                      index,
                                      "launch"
                                    )
                                  }
                                  style={{
                                    color: "black",
                                    background: "white",
                                    border: "1.5px solid black",
                                    borderRadius: "5px",
                                    width: "40px",
                                    textAlign: "center",
                                  }}
                                  type={
                                    el.launch &&
                                    el.launch[index] &&
                                    el.launch[index][1] === "off"
                                      ? "text"
                                      : "number"
                                  }
                                  value={
                                    el.launch &&
                                    el.launch[index] &&
                                    el.launch[index][1] === "off"
                                      ? "off"
                                      : el.launch &&
                                        el.launch[index] &&
                                        el.launch[index][0] === 0
                                      ? ""
                                      : el.launch &&
                                        el.launch[index] &&
                                        el.launch[index][0]
                                  }
                                />
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={
                                  {
                                    // padding: "1px 0",
                                    // paddingBottom: "6px",
                                  }
                                }
                              >
                                <input
                                  disabled={
                                    (el.dinner &&
                                      el.dinner[index] &&
                                      el.dinner[index][1] === "off") ||
                                    el.dinner[index][2] === "user"
                                    // ||user?.role === "user"
                                    // ? true
                                    // : false
                                  }
                                  onChange={(e) =>
                                    updateMealHandler(
                                      e,
                                      el.date,
                                      el.id,
                                      index,
                                      "dinner"
                                    )
                                  }
                                  style={{
                                    color: "black",
                                    background: "white",
                                    border: "1.5px solid black",
                                    borderRadius: "5px",
                                    width: "40px",
                                    textAlign: "center",
                                  }}
                                  type={
                                    el.dinner &&
                                    el.dinner[index] &&
                                    el.dinner[index][1] === "off"
                                      ? "text"
                                      : "number"
                                  }
                                  value={
                                    el.dinner &&
                                    el.dinner[index] &&
                                    el.dinner[index][1] === "off"
                                      ? "off"
                                      : el.dinner &&
                                        el.dinner[index] &&
                                        el.dinner[index][0] === 0
                                      ? ""
                                      : el.dinner &&
                                        el.dinner[index] &&
                                        el.dinner[index][0]
                                  }
                                />
                              </td>
                            </tr>
                          </table>
                        </td>
                      );
                    }
                  })}
                  <td
                    style={{
                      display: currentUser !== "all" ? "none" : "",
                    }}
                  >
                    <table
                      style={{
                        background: "white",
                        color: "black",
                        // width: "148px",
                        width: "100%",
                      }}
                    >
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          {totalMeals.length > 0 &&
                            totalMeals.find((item) => item.date === el.date)
                              ?.totalBreakfast}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          {totalMeals.length > 0 &&
                            totalMeals.find((item) => item.date === el.date)
                              ?.totalLaunch}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          {totalMeals.length > 0 &&
                            totalMeals.find((item) => item.date === el.date)
                              ?.totalDinner}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {/* </div> */}
      {/* fixed */}
      {console.log(headHeight)}
      <div
        ref={dateRef}
        style={{
          position: "fixed",
          width: currentUser !== "all" ? "35%" : "150px",
          top: headHeight + 100 + "px",
          bottom: "0",
          background: "white",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <table
          style={{ width: "100%", color: "black", borderTop: "1px solid blue" }}
        >
          <tbody>
            {arrOfMeals
              .sort((a, b) => a.date.split(" ")[0] - b.date.split(" ")[0])
              .filter((item) => {
                if (1 === 0) {
                  if (item.date === `${currentDay} December 2023`) {
                    return true;
                  }
                } else {
                  if (item.date) {
                    return true;
                  }
                }
              })
              ?.map((el, i) => {
                return (
                  <tr
                    style={{
                      border: "2px solid white",
                      borderLeft: "0",
                      borderTop: "0",
                      borderRight: "2px solid black",
                      borderBottom: "2px solid green",
                      width: "100%",
                      // height: "99.33px",
                    }}
                  >
                    <td
                      style={{
                        borderRight: "2px solid green",
                        width: "50px",
                        textAlign: "center",
                      }}
                    >
                      {el.date?.split(" ")[0]}
                    </td>
                    <td
                      style={{
                        background: "",
                        height: "100px",
                        color: "black",
                      }}
                    >
                      <table style={{ width: "100%" }}>
                        <tr style={{ borderBottom: "1px solid white" }}>
                          <td style={{ textAlign: "center" }}>Breakfast</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid white" }}>
                          <td style={{ textAlign: "center" }}>Launch</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: "center" }}>Dinner</td>
                        </tr>
                      </table>
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

export default Meal;
