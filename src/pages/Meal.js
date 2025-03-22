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
  useUpdateExtraShopMoneyMutation,
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
import FilterBox from "../components/FilterBox";
import TableDateAndMealHeader from "../components/TableDateAndMealHeader";
import TableMealBody from "../components/TableMealBody";
import TableDateAndMealBody from "../components/TableDateAndMealBody";
import UserHomeTableHeadContent from "../components/UserHomeTableHeadContent";
import LoaderComponent from "../components/LoaderComponent";
import getCurrentMonthLength from "../utils/getCurrentMonthLength";
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


  const [
    updateMoney,
    { data: money, isSuccess: isDepositeUpdateSuccess, isError: isUpdateMoneyError, error: updateMoneyError },
  ] = useUpdateMoneyMutation();
  const [
    updateShopMoney,
    { data: shopMoney, isSuccess: isShopMoneyUpdateSuccess, isError: isShopMoneyError, error: shopMoneyError },
  ] = useUpdateShopMoneyMutation();
  const [
    updateExtraShopMoney,
    {
      data: extraShopMoney,
      isSuccess: isExtraShopMoneyUpdateSuccess,
      isError: isShopExtraMoneyError,
      error: extraShopMoneyError,
    },
  ] = useUpdateExtraShopMoneyMutation();

  const [deposite, setDeposite] = useState({});
  const [shopping, setShopping] = useState({});
  const [extraShopping, setExtraShopping] = useState({});
  useEffect(() => {
    if (isUpdateMoneyError) {
      alert(updateMoneyError?.data.message);
    }
    if (isDepositeUpdateSuccess) {
      alert("Deposite updated successfully")
      console.log(deposite.money)
      console.log(money)
      // fetch(`http://45.120.38.242/api/sendsms?api_key=01319193270.VXMtkxGPG7XwoldS2a&type=text&phone=${registeredUsers[index].phoneNo}&senderid=URCL&message=Dear ${registeredUsers[index].name} (vai), you are currently deposite ${deposite.money} Tk. Your total deposite is ${borderTotalDeposite} TK. Rahat(Meal Manager)=> Bachelor Point`).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err))
    }
  }, [isUpdateMoneyError, isDepositeUpdateSuccess]);
  useEffect(() => {
    if (isShopMoneyError) {
      alert(shopMoneyError?.data?.message);
    }
    // if (isShopMoneyUpdateSuccess) {
    //   alert("Shopping updated successfully")
    //   // fetch(`http://45.120.38.242/api/sendsms?api_key=01319193270.VXMtkxGPG7XwoldS2a&type=text&phone=${registeredUsers[index].phoneNo}&senderid=URCL&message=Dear ${registeredUsers[index].name} (vai), you are currently deposite ${deposite.money} Tk. Your total deposite is ${borderTotalDeposite} TK. Rahat(Meal Manager)=> Bachelor Point`).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err))
    //   fetch(`http://45.120.38.242/api/sendsms?api_key=01319193270.VXMtkxGPG7XwoldS2a&type=text&phone=${registeredUsers[index].phoneNo}&senderid=URCL&message=Dear ${registeredUsers[index].name}, you've done shopping worth ${shopping.shop} taka is added successfully. Rahat(Meal Manager)=> Bachelor Point`).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err))
    // }
  }, [isShopMoneyError, isShopMoneyUpdateSuccess]);

  useEffect(() => {
    if (isShopExtraMoneyError) {
      alert(extraShopMoneyError?.data?.message);
    }
    if (isExtraShopMoneyUpdateSuccess) {
      alert("Extra shopping updated successfully")
    }
  }, [isShopExtraMoneyError, isExtraShopMoneyUpdateSuccess]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (deposite?.id) {
        updateMoney({
          id: deposite.id,
          year: deposite.year,
          month: deposite.month,
          borderIndex: deposite.borderIndex,
          money: deposite.money,
        });
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [deposite]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (shopping?.id) {
        updateShopMoney({
          id: shopping.id,
          year: shopping.year,
          month: shopping.month,
          borderIndex: shopping.borderIndex,
          shop: shopping.shop,
        });
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [shopping]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (extraShopping?.id) {
        updateExtraShopMoney({
          id: extraShopping.id,
          year: extraShopping.year,
          month: extraShopping.month,
          borderIndex: extraShopping.borderIndex,
          extraShop: extraShopping.extraShop,
        });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [extraShopping]);

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
  console.log(monthlyMeals)
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
  let year = 2024;
  let month = 11;
  const currentDay = new Date().getDate();
  const monthLength = getCurrentMonthLength(month, year)

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
  console.log(user)
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
  console.log(registeredUsers)

  return (
    <>
      <div className="font-sans hidden">
        <div
          ref={headRef}
          style={{
            position: "fixed",
            top: "40px",
            right: "0",
            left: "0",
            background: "gray",
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
                    : currentUser === "all"
                      ? "15%"
                      : "0",
                color: "black",
                height: "50px",
                overflowX: "scroll",
                width: currentUser !== "all" ? "" : "",
                boxShadow: "1px 0 4px -2px black",
                display: arrOfMeals?.length === 0 ? "none" : "",
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
                  // display:'none'
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
                                    <UserHomeTableHeadContent
                                      screenWidth={screenWidth}
                                      setMoneyOption={setMoneyOption}
                                      moneyOption={moneyOption}
                                      borderTotalDeposite={borderTotalDeposite}
                                      borderTotalShop={borderTotalShop}
                                      borderTotalExtraShop={borderTotalExtraShop}
                                    />
                                  ) : (
                                    el.name
                                  )}
                                </th>
                              </tr>
                            </table>
                          </td>
                        );
                      })}
                  </tr>
                </thead>
              </table>
              {arrOfMeals?.length > 0 && (
                <div
                  style={{
                    position: "fixed",
                    right: screenWidth > 1000 ? "11%" : "0",
                    top: headHeight + 90 - 50 + "px",
                    // borderBottom: "5px solid black",
                    height: "50px",
                    bottom: "0",
                    // background: "red",
                    width: screenWidth > 1000 ? "7%" : "15%",
                    background: "white",
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

        <div
          style={{
            position: "fixed",
            top: headHeight + 90 - 50 + "px",
            bottom: "0",
            left: "0",
            right: "0",
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
            <LoaderComponent />
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
          borderTotalDeposite={borderTotalDeposite}
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

      {/* Redesigned mealsheet */}
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
      <div className="max-w-[900px] h-[80vh] max-h-[80vh] rounded-lg bg-white text-black m-auto mt-[10vh] mb-8 relative overflow-x-scroll">
        <table className="absolute left-0 right-0 top-0 bottom-0 w-full">
          {/* table header */}
          <thead className="sticky top-0 z-10">
            <tr className="h-[50px]">
              <td style={{ textAlign: 'center' }} className={`${currentUser === 'all' ? 'min-w-[50px]' : 'min-w-[50px]'} bg-white text-black sticky left-0 z-[100]`}>Date</td>
              <td className="w-1 sticky left-[50px] bg-black">&nbsp;</td>
              <td style={{ textAlign: 'center' }} className="min-w-[100px] sticky left-[54px] bg-white text-black ">Type</td>
              <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 sticky left-[154px] bg-black`}>&nbsp;</td>
              <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 bg-black`}>&nbsp;</td>

              {registeredUsers
                ?.filter((el) => {
                  if (currentUser !== "all") {
                    if (el._id === currentUser?.split(" ")[currentUser?.split(" ").length - 1]) {
                      return true;
                    }
                  } else {
                    return true;
                  }
                })
                ?.map((el) => {
                  return (
                    <>
                      <td
                        style={{
                          width: currentUser !== "all" ? "100%" : "150px",
                          textAlign: "center",
                        }}
                        className="min-w-[200px] bg-white text-black"
                      >
                        <table
                          style={{
                            height: "100%",
                            width: currentUser !== "all" ? "100%" : "100%",
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
                              {currentUser !== "all" ? (
                                <UserHomeTableHeadContent
                                  screenWidth={screenWidth}
                                  setMoneyOption={setMoneyOption}
                                  moneyOption={moneyOption}
                                  borderTotalDeposite={borderTotalDeposite}
                                  borderTotalShop={borderTotalShop}
                                  borderTotalExtraShop={borderTotalExtraShop}
                                />
                              ) : (
                                el.name
                              )}
                            </th>
                          </tr>
                        </table>
                      </td>
                      <td className="w-1 bg-black"></td>
                    </>
                  );
                })}
              <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 sticky right-[100px] bg-black`}>&nbsp;</td>
              <td className={`${currentUser === 'all' ? '' : 'hidden'} min-w-[100px] sticky right-0 bg-white text-black text-center font-bold`}>Total Meal</td>
            </tr>

            <tr className="h-1 bg-black">
              <td className=""></td>
              <td className="sticky left-[50px]"></td>
              <td className=""></td>
              <td className=""></td>
              <td></td>
              <td></td>

              {registeredUsers?.length > 0 && registeredUsers.map(el => {
                return (
                  <>
                    <td></td>
                    <td className="w-1 bg-black"></td>
                  </>
                )
              })}
              <td className="w-1 sticky right-[100px] bg-black z-[-100]"></td>
            </tr>

          </thead>

          <tbody className="w-full">
            <tr className={`h-1 bg-black`}>
              {/* Table head bottom border start */}
              <td></td>
              {/* Table head bottom border end */}
              <td className="sticky left-[50px]"></td>
              <td className={""}></td>
              <td className=""></td>
              <td></td>
              <td></td>
              {registeredUsers?.length > 0 && registeredUsers.map(el => {
                return (
                  <>
                    <td></td>
                    <td className="w-1 bg-black"></td> {/* partial horizontal header border indicator */}
                  </>
                )
              })}
              {/* problem */}
              <td className="w-1 sticky right-[100px] bg-black z-[-100]"></td>
            </tr>

            {/* table body rows */}
            {
              arrOfMeals?.length > 0 && arrOfMeals.map((el, i) => {
                return (
                  <tr className={`h-[100px] ${i !== arrOfMeals.length - 1 && 'border-b-8'} border-black-500`}> {/* Horizontal body meal border*/}
                    {/* <td className="bg-white text-black sticky left-0">{el.date}</td> */}
                    <td
                      className={`${currentUser === 'all' ? 'w-full' : 'max-w-[50px]'} bg-white text-black sticky left-0 text-center`}
                      style={{
                        // width: "50px",
                        background:
                          el.date.split(" ")[0] == todayDate ? "red" : "",
                      }}
                    >
                      {el.date?.split(" ")[0]}
                    </td>
                    <td className="w-1 bg-black sticky left-[50px]">&nbsp;</td> {/* date body vertical border */}

                    <td className={`${currentUser === 'all' ? 'w-full' : 'w-[200px]'} bg-white text-black sticky left-[54px] border-black border-b-[3px]`}>
                      <table className="w-full text-center">
                        {['Breakfast', 'Launch', 'Dinner'].map((el, i) => {
                          return (
                            <tr><td className="">{el}</td></tr>
                          )
                        })}
                      </table>
                    </td>
                    <td className={`${currentUser == 'all' ? '' : 'hidden'} bg-red-500 sticky left-[154px]`}></td> {/* Type body vertical right border element */}
                    <td className={`${currentUser === 'all' ? '' : 'hidden'} bg-black`}></td> {/* first body vertical indicator */}

                    {/* <TableMealBody
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
                      borderTotalDeposite={borderTotalDeposite}
                    /> */}
                    {/* For admin */}
                    {registeredUsers?.length > 0 && registeredUsers.map((elem, index) => {
                      return (
                        <>
                          <td
                            className={`${currentUser === 'all' ? '' : 'hidden'}`}
                            style={{
                              width: "150px",
                              textAlign: "center",
                            }}
                          >
                            <table
                              style={{
                                width: "100%",
                                height: "86px",
                              }}
                            >
                              {/* breakfast */}
                              <tr
                                style={{

                                }}
                              >
                                <td className="bg-blue-500" style={{ width: "25%" }}>
                                  <input
                                    onMouseEnter={() => {
                                      setItem({
                                        ...item,
                                        type: "text",
                                        borderIndex: index,
                                        date: el.date,
                                        mealName: "breakfast",
                                      });
                                    }}
                                    onMouseLeave={() => {
                                      setItem("text");
                                    }}
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
                                      // background: "white",
                                      border:
                                        el.breakfast &&
                                          el.breakfast[index] &&
                                          el.breakfast[index][1] !== "off"
                                          ? "1.5px solid black"
                                          : "1.5px solid red",
                                      borderRadius: "5px",
                                      width: "40px",
                                      textAlign: "center",
                                    }}
                                    type={
                                      item.type === "number" &&
                                        item.borderIndex === index &&
                                        item.date === el.date &&
                                        item.mealName === "breakfast" &&
                                        el.breakfast[index] &&
                                        el.breakfast[index][1] !== "off"
                                        ? "text"
                                        : "text"
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
                              <tr style={{}}>
                                <td>
                                  <input
                                    onMouseEnter={() => {
                                      setItem({
                                        ...item,
                                        type: "text",
                                        borderIndex: index,
                                        date: el.date,
                                        mealName: "launch",
                                      });
                                    }}
                                    onMouseLeave={() => {
                                      setItem("text");
                                    }}
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
                                      border:
                                        el.launch &&
                                          el.launch[index] &&
                                          el.launch[index][1] !== "off"
                                          ? "1.5px solid black"
                                          : "1.5px solid red",
                                      borderRadius: "5px",
                                      width: "40px",
                                      textAlign: "center",
                                    }}
                                    type={
                                      item.type === "number" &&
                                        item.borderIndex === index &&
                                        item.date === el.date &&
                                        item.mealName === "launch" &&
                                        el.launch[index] &&
                                        el.launch[index][1] !== "off"
                                        ? "text"
                                        : "text"
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

                              {/* input field */}
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
                                    onMouseEnter={() => {
                                      setItem({
                                        ...item,
                                        type: "text",
                                        borderIndex: index,
                                        date: el.date,
                                        mealName: "dinner",
                                      });
                                    }}
                                    onMouseLeave={() => {
                                      setItem("text");
                                    }}
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
                                      border:
                                        el.dinner &&
                                          el.dinner[index] &&
                                          el.dinner[index][1] !== "off"
                                          ? "1.5px solid black"
                                          : "1.5px solid red",
                                      borderRadius: "5px",
                                      width: "40px",
                                      textAlign: "center",
                                    }}
                                    type={
                                      // (el.dinner &&
                                      //   el.dinner[index] &&
                                      //   el.dinner[index][1] === "off") ||
                                      item.type === "number" &&
                                        item.borderIndex === index &&
                                        item.date === el.date &&
                                        item.mealName === "dinner" &&
                                        el.dinner &&
                                        el.dinner[index] &&
                                        el.dinner[index][1] !== "off"
                                        ? "text"
                                        : "text"
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
                          {/* for customer */}
                          <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 bg-red-500`}>&nbsp;</td> {/* Body meal vertical border element */}
                        </>
                      )
                    })}

                    {/* For customer */}
                    {registeredUsers?.length > 0 && registeredUsers.map((elem, index) => {
                      if (elem._id === currentUser.split(' ')[currentUser.split(' ').length - 1]) {
                        return (
                          <>
                            <td
                              className={`${currentUser === 'all' ? 'hidden' : ''}`}
                              style={{
                                width: "150px",
                                textAlign: "center",
                              }}
                            >
                              <table
                                style={{
                                  width: "100%",
                                  height: "86px",
                                }}
                              >
                                {/* breakfast section start */}
                                <tr>
                                  <td style={{ width: "25%" }}>
                                    <input
                                      onMouseEnter={() => {
                                        setItem({
                                          ...item,
                                          type: "text",
                                          borderIndex: index,
                                          date: el.date,
                                          mealName: "breakfast",
                                        });
                                      }}
                                      onMouseLeave={() => {
                                        setItem("text");
                                      }}
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
                                        textAlign:'center',
                                        // background: "white",
                                        border:
                                          el.breakfast &&
                                            el.breakfast[index] &&
                                            el.breakfast[index][1] !== "off"
                                            ? "1.5px solid black"
                                            : "1.5px solid red",
                                        borderRadius: "5px",
                                        width: "40px",
                                        // textAlign: "center",
                                        marginRight: ".5rem",
                                      }}
                                      type={
                                        item.type === "number" &&
                                          item.borderIndex === index &&
                                          item.date === el.date &&
                                          item.mealName === "breakfast" &&
                                          el.breakfast[index] &&
                                          el.breakfast[index][1] !== "off"
                                          ? "text"
                                          : "text"
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
                                    {/* Breakfast checkbox */}
                                    {1 === 1 && (
                                      <>
                                        {/* &nbsp;&nbsp; */}
                                        <input
                                          type="checkbox"
                                          value={el.breakfast[index][1]}
                                          onChange={(e) =>
                                            updateMealHandler(
                                              e,
                                              el.date,
                                              el.id,
                                              index,
                                              "breakfast",
                                              "checkbox"
                                            )
                                          }
                                          checked={el.breakfast[index][1] === "on" ? true : false}
                                        />
                                      </>
                                    )}
                                  </td>
                                </tr>
                                {/* breakfast section end */}

                                {/* Launch section start */}
                                <tr style={{}}>
                                  <td style={{ position: "relative" }}>
                                    <input
                                      onMouseEnter={() => {
                                        setItem({
                                          ...item,
                                          type: "text",
                                          borderIndex: index,
                                          date: el.date,
                                          mealName: "launch",
                                        });
                                      }}
                                      onMouseLeave={() => {
                                        setItem({});
                                      }}
                                      type={
                                        item.type === "number" &&
                                          item.borderIndex === index &&
                                          item.date === el.date &&
                                          item.mealName === "launch" &&
                                          el.launch[index] &&
                                          el.launch[index][1] !== "off"
                                          ? "number"
                                          : "text"
                                      }
                                      style={{
                                        color: "black",
                                        background: "white",
                                        border:
                                          el.launch &&
                                            el.launch[index] &&
                                            el.launch[index][1] !== "off"
                                            ? "1.5px solid black"
                                            : "1.5px solid red",
                                        borderRadius: "5px",
                                        width: "40px",
                                        textAlign: "center",
                                        marginRight: ".5rem",
                                      }}
                                      disabled={
                                        el.launch && el.launch[index] && el.launch[index][1] === "off"
                                      }
                                      onChange={(e) =>
                                        updateMealHandler(e, el.date, el.id, index, "launch")
                                      }
                                      value={
                                        el.launch && el.launch[index] && el.launch[index][1] === "off"
                                          ? "off"
                                          : el.launch && el.launch[index] && el.launch[index][0] === 0
                                            ? ""
                                            : el.launch && el.launch[index] && el.launch[index][0]
                                      }
                                    />
                                    {/* {currentIndex === index && ( */}

                                    {1 === 1 && (
                                      <input
                                        style={{
                                          paddingLeft: "1rem",
                                        }}
                                        type="checkbox"
                                        onChange={(e) =>
                                          updateMealHandler(
                                            e,
                                            el.date,
                                            el.id,
                                            index,
                                            "launch",
                                            "checkbox"
                                          )
                                        }
                                        value={el.launch[index][1]}
                                        checked={el.launch[index][1] === "on" ? true : false}
                                      />
                                    )}
                                    <input
                                      style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "90%",
                                        transform: "translateY(-50%)",
                                      }}
                                      checked={
                                        el["breakfast"][index][1] === "on" ||
                                        el["launch"][index][1] === "on" ||
                                        el["dinner"][index][1] === "on"
                                      }
                                      value={
                                        el["breakfast"][index][1] === "on" ||
                                          el["launch"][index][1] === "on" ||
                                          el["dinner"][index][1] === "on"
                                          ? "off"
                                          : "on"
                                      }
                                      type="checkbox"
                                      onChange={(e) => {
                                        const copyArrOfMeals = [...arrOfMeals];

                                        const desireItemIndex = copyArrOfMeals.findIndex(
                                          (item) => item.id === el.id
                                        );
                                        const desireItem = copyArrOfMeals[desireItemIndex];
                                        const breakfastArr = [...desireItem["breakfast"]];
                                        const launchArr = [...desireItem["launch"]];
                                        const dinnerArr = [...desireItem["dinner"]];

                                        breakfastArr[index] =
                                          e.target.value === "off"
                                            ? [0, "off", "admin"]
                                            : [0.5, "on", "admin"];
                                        launchArr[index] =
                                          e.target.value === "off"
                                            ? [0, "off", "admin"]
                                            : [1, "on", "admin"];
                                        dinnerArr[index] =
                                          e.target.value === "off"
                                            ? [0, "off", "admin"]
                                            : [1, "on", "admin"];

                                        const copyDesireItem = {
                                          ...desireItem,
                                          breakfast: breakfastArr,
                                          launch: launchArr,
                                          dinner: dinnerArr,
                                        };
                                        copyArrOfMeals[desireItemIndex] = copyDesireItem;
                                        console.log(el);
                                        setArrOfMeals([...copyArrOfMeals]);
                                        let mealError = "";
                                        if (
                                          new Date() >
                                          new Date(
                                            el.year,
                                            el.month,
                                            el.date.split(" ")[0] * 1,
                                            6
                                          ) &&
                                          (user.role === "user" || user.role === "admin")
                                        ) {
                                          mealError = "Full meal request time is over";
                                        }
                                        if (mealError) {
                                          alert(mealError);
                                          console.log(prevArrOfMeals);
                                          // prevArrOfMeals[desireItemIndex] = { ...obj, [mealName]: mealArr };
                                          setArrOfMeals([...prevArrOfMeals]);
                                          return;
                                        }
                                        updatePersonFullMeal({
                                          id: el.id,
                                          personIndex: index,
                                          userIndex: registeredUsers.findIndex(
                                            (item) => item._id === user._id
                                          ),
                                          month: el.month,
                                          year: el.date.split(" ")[2] * 1,
                                          day: el.date.split(" ")[0] * 1,
                                          personBreakfast: breakfastArr[index],
                                          personLaunch: launchArr[index],
                                          personDinner: dinnerArr[index],
                                        });
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{
                                      width: "25%",
                                      display:
                                        screenWidth < 600 && moneyOption !== "Deposite" ? "none" : "",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      onChange={(e) => {
                                        if (
                                          new Date() >
                                          new Date(
                                            el.year,
                                            el.month,
                                            el.date.split(" ")[0] * 1,
                                            24
                                          ) &&
                                          user?.role == "admin"
                                        ) {
                                          alert(
                                            "The date is passed. You can't update previous day's deposite"
                                          );
                                          return;
                                        }
                                        if (user?.role === "user") {
                                          alert("Only admin can update deposite");
                                          return;
                                        }
                                        const desireMealIndex = arrOfMeals.findIndex(
                                          (item) => item.id === el.id
                                        );
                                        console.log(desireMealIndex);
                                        const desireMeal = arrOfMeals[desireMealIndex];
                                        const copyDesireMeal = { ...desireMeal };
                                        // const moneys = desireMeal.money;
                                        // const desireMoney = moneys[index];
                                        // console.log(desireMoney)
                                        const moneys = copyDesireMeal.money;
                                        const copyMoneys = [...moneys];
                                        copyMoneys[index] = e.target.value * 1;
                                        arrOfMeals[desireMealIndex] = {
                                          ...copyDesireMeal,
                                          money: copyMoneys,
                                        };

                                        setArrOfMeals([...arrOfMeals]);

                                        setDeposite({
                                          id: el.id,
                                          year: el.year,
                                          month: el.month,
                                          borderIndex: index,
                                          money: e.target.value * 1,
                                        });
                                      }}
                                      value={el.money[index] === 0 ? "" : el.money[index]}
                                      placeholder="Deposite"
                                      style={{
                                        color: "black",
                                        // border: "1px solid black",
                                        // borderRadius: "5px",
                                        width: "80px",
                                        textAlign: "center",
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{
                                      width: "25%",
                                      display:
                                        screenWidth < 600 && moneyOption !== "Shopping" ? "none" : "",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      onChange={(e) => {
                                        if (
                                          new Date() >
                                          new Date(
                                            el.year,
                                            el.month,
                                            el.date.split(" ")[0] * 1,
                                            24
                                          ) &&
                                          user?.role == "admin"
                                        ) {
                                          alert(
                                            "The date is passed. You can't update previous day's shop"
                                          );
                                          return;
                                        }
                                        if (user?.role === "user") {
                                          alert("Only admin can update shop");
                                          return;
                                        }
                                        const desireMealIndex = arrOfMeals.findIndex(
                                          (item) => item.id === el.id
                                        );
                                        const desireMeal = arrOfMeals[desireMealIndex];
                                        const copyDesireMeal = { ...desireMeal };
                                        const shops = copyDesireMeal.shop;
                                        const copyshops = [...shops];
                                        copyshops[index] = e.target.value * 1;
                                        arrOfMeals[desireMealIndex] = {
                                          ...copyDesireMeal,
                                          shop: copyshops,
                                        };
                                        setArrOfMeals([...arrOfMeals]);

                                        setShopping({
                                          id: el.id,
                                          month: el.month,
                                          year: el.year,
                                          borderIndex: index,
                                          shop: e.target.value * 1,
                                        });
                                      }}
                                      placeholder="Shopping"
                                      value={el.shop[index] === 0 ? "" : el.shop[index]}
                                      style={{
                                        color: "black",
                                        width: "80px",
                                        // border: "1px solid black",
                                        // borderRadius: "5px",
                                        textAlign: "center",
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{
                                      width: "25%",
                                      display:
                                        screenWidth < 600 && moneyOption !== "Extra" ? "none" : "",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      onChange={(e) => {
                                        if (
                                          new Date() >
                                          new Date(
                                            el.year,
                                            el.month,
                                            el.date.split(" ")[0] * 1,
                                            24
                                          ) &&
                                          user?.role == "admin"
                                        ) {
                                          alert(
                                            "The date is passed. You can't update previous day's extra shop"
                                          );
                                          return;
                                        }
                                        if (user?.role === "user") {
                                          alert("Only admin can update extra shop");
                                          return;
                                        }
                                        const desireMealIndex = arrOfMeals.findIndex(
                                          (item) => item.id === el.id
                                        );
                                        const desireMeal = arrOfMeals[desireMealIndex];
                                        const copyDesireMeal = { ...desireMeal };
                                        const extraShops = copyDesireMeal.extraShop;
                                        const copyExtraShops = [...extraShops];
                                        copyExtraShops[index] = e.target.value * 1;
                                        arrOfMeals[desireMealIndex] = {
                                          ...copyDesireMeal,
                                          extraShop: copyExtraShops,
                                        };
                                        setArrOfMeals([...arrOfMeals]);
                                        setExtraShopping({
                                          id: el.id,
                                          month: el.month,
                                          year: el.year,
                                          borderIndex: index,
                                          extraShop: e.target.value * 1,
                                        });
                                      }}
                                      placeholder="Extra"
                                      value={el.extraShop[index] === 0 ? "" : el.extraShop[index]}
                                      style={{
                                        color: "black",
                                        width: "80px",
                                        // border: "1px solid black",
                                        // borderRadius: "5px",
                                        textAlign: "center",
                                      }}
                                    />
                                  </td>
                                </tr>
                                {/* dinner section end */}
                                <tr>
                                  <td>
                                    <input
                                      onMouseEnter={() => {
                                        setItem({
                                          ...item,
                                          type: "text",
                                          borderIndex: index,
                                          date: el.date,
                                          mealName: "dinner",
                                        });
                                      }}
                                      onMouseLeave={() => {
                                        setItem({});
                                      }}
                                      style={{
                                        color: "black",
                                        background: "white",
                                        border:
                                          el.dinner &&
                                            el.dinner[index] &&
                                            el.dinner[index][1] !== "off"
                                            ? "1.5px solid black"
                                            : "1.5px solid red",
                                        borderRadius: "5px",
                                        width: "40px",
                                        textAlign: "center",
                                        marginRight: ".5rem",
                                      }}
                                      disabled={
                                        el.dinner && el.dinner[index] && el.dinner[index][1] === "off"
                                      }
                                      onChange={(e) =>
                                        updateMealHandler(e, el.date, el.id, index, "dinner")
                                      }
                                      type={
                                        item.type === "number" &&
                                          item.borderIndex === index &&
                                          item.date === el.date &&
                                          item.mealName === "dinner" &&
                                          el.dinner[index] &&
                                          el.dinner[index][1] !== "off"
                                          ? "number"
                                          : "text"
                                      }
                                      value={
                                        el.dinner && el.dinner[index] && el.dinner[index][1] === "off"
                                          ? "off"
                                          : el.dinner && el.dinner[index] && el.dinner[index][0] === 0
                                            ? ""
                                            : el.dinner && el.dinner[index] && el.dinner[index][0]
                                      }
                                    />
                                    {/* {currentIndex === index && ( */}
                                    {1 === 1 && (
                                      <>
                                        <input
                                          value={el.dinner[index][1]}
                                          onChange={(e) =>
                                            updateMealHandler(
                                              e,
                                              el.date,
                                              el.id,
                                              index,
                                              "dinner",
                                              "checkbox"
                                            )
                                          }
                                          type="checkbox"
                                          checked={el.dinner[index][1] === "on" ? true : false}
                                        />
                                      </>
                                    )}
                                  </td>

                                </tr>
                              </table>
                            </td>
                            {/* for customer */}
                            <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 bg-green-500`}>&nbsp;</td>
                          </>
                        )
                      }

                    })}
                    <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 sticky right-[100px] bg-blue-500`}>&nbsp;</td> {/* Total meal left border element */}

                    {/* total meal calculation */}
                    <td className={`${currentUser == 'all' ? '' : 'hidden'} bg-white text-black sticky right-0 font-bold`}>
                      <table className="w-full text-center">
                        <tr>
                          <td style={{ textAlign: "center" }}>
                            {totalMeals.length > 0 && totalMeals.find((item) => item.date === el.date)?.totalBreakfast}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: "center" }}>
                            {totalMeals.length > 0 && totalMeals.find((item) => item.date === el.date)?.totalLaunch}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: "center" }}>
                            {totalMeals.length > 0 && totalMeals.find((item) => item.date === el.date)?.totalDinner}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Meal;
