import React, { useEffect, useRef } from "react";
import UserHomeTable from "./UserHomeTable";
import { useSelector } from "react-redux";
import { setTotalMealBodyRef } from "../features/refSlice";

const TableMealBody = ({
  arrOfMeals,
  currentDay,
  registeredUsers,
  currentUser,
  setArrOfMeals,
  updateMealHandler,
  updatePersonFullMeal,
  user,
  updateExtraShopMoney,
  prevArrOfMeals,
  screenWidth,
  moneyOption,
  item,
  setItem,
  totalMeals,
  tableBodyRef,
  headHeight,
  dateRef,
  nowScroll,
  nameRef,
  todayDate,
}) => {
  const totalMealBodyRef = useRef();
  // const { totalMealBodyRef: totalMealRefBody } = useSelector(state => state.totalMealBodyRef)
  // console.log(totalMealRefBody)
  useEffect(() => {
    if (arrOfMeals?.length > 0) {
      totalMealBodyRef?.current?.scrollTo({
        top: (todayDate - 1) * 100,
        behavior: "smooth",
      });
    }
  }, [arrOfMeals?.length]);
  return (
    <div
      onScroll={() => {
        if (nowScroll) {
          dateRef?.current?.scrollTo(
            tableBodyRef?.current?.scrollLeft,
            tableBodyRef?.current?.scrollTop
          );
          totalMealBodyRef?.current?.scrollTo(
            tableBodyRef?.current?.scrollLeft,
            tableBodyRef?.current?.scrollTop
          );
          nameRef?.current?.scrollTo(
            tableBodyRef?.current?.scrollLeft,
            tableBodyRef?.current?.scrollTop
          );
        }
      }}
      ref={tableBodyRef}
      style={{
        position: "fixed",
        top: headHeight + 90 + "px",
        right:
          screenWidth > 1000
            ? currentUser === "all"
              ? "18%"
              : "11%"
            : currentUser === "all"
            ? "15%"
            : "0",
        bottom: "0",
        left:
          currentUser !== "all" ? "35%" : screenWidth > 1000 ? "23%" : "150px",
        overflow: "scroll",
      }}
    >
      <table
        style={{
          width:
            currentUser !== "all"
              ? "100%"
              : registeredUsers?.length * 150 + 0.5 + "px",

          // marginTop: headHeight + 90 + "px",
          // marginLeft: currentUser !== "all" ? "35%" : "150px",
          borderRight: currentUser === "all" ? "1px solid black" : "",
          borderLeft: "1px solid blue",
          borderTop: "1px solid blue",
          scrollBehavior: "smooth",
          // borderRight: "1px solid black",
        }}
      >
        <tbody
          style={{
            scrollBehavior: "smooth",
            // boxShadow: "1px 0 4px -2px black",
          }}
        >
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
                          updateExtraShopMoney={updateExtraShopMoney}
                          prevArrOfMeals={prevArrOfMeals}
                          screenWidth={screenWidth}
                          moneyOption={moneyOption}
                          item={item}
                          setItem={setItem}
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
                            // background:
                            //   el.date.split(" ")[0] == todayDate ? "red" : "",
                          }}
                        >
                          <table
                            style={{
                              width: "100%",
                              height: "86px",
                            }}
                          >
                            <tr
                              style={{
                                borderBottom: "1px solid white",
                              }}
                            >
                              <td>
                                <input
                                  onMouseEnter={() => {
                                    setItem({
                                      ...item,
                                      type: "number",
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
                                      ? "number"
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
                            <tr style={{ borderBottom: "1px solid white" }}>
                              <td>
                                <input
                                  onMouseEnter={() => {
                                    setItem({
                                      ...item,
                                      type: "number",
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
                                      ? "number"
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
                                      type: "number",
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
                                      ? "number"
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
                      );
                    }
                  })}
                  {/* <td
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
                  </td> */}
                  {/* fixed total meal count div */}
                </tr>
              );
            })}
        </tbody>
      </table>
      {arrOfMeals?.length > 0 && (
        <div
          ref={totalMealBodyRef}
          onScroll={() => {
            if (nowScroll) {
              tableBodyRef?.current?.scrollTo(
                tableBodyRef?.current?.scrollLeft,
                totalMealBodyRef?.current?.scrollTop
              );
            }
          }}
          style={{
            position: "fixed",
            width: screenWidth > 1000 ? "7%" : "15%",
            right: screenWidth > 1000 ? "11%" : "0",
            top: headHeight + 90 + "px",
            bottom: "0",
            background: "white",
            overflow: "scroll",
            textAlign: "center",
            zIndex: "10000",
            // borderRight: "1px solid black",
            borderLeft: "1px solid black",
            boxShadow: "1px 0 4px -2px black",
            // display: currentUser !== "all" ? "none" : "",
            visibility: currentUser !== "all" ? "hidden" : "",
          }}
        >
          <table
            style={{
              width: "100%",
              // borderTop: "1px solid blue",

              borderTop: "1px solid black",
            }}
          >
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
                      // border: "2px solid green",
                      // borderLeft: "0",
                      borderTop: "1px solid blue",
                      borderBottom: "2px solid green",
                      height: "100px",
                    }}
                  >
                    <td
                      style={{
                        display: currentUser !== "all" ? "none" : "",
                        height: "100px",
                      }}
                    >
                      <table
                        style={{
                          color: "black",
                          // width: "148px",
                          width: "100%",
                          height: "100%",
                          // height: "100px",
                          // borderBottom: "2px solid green",
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
          </table>
        </div>
      )}
    </div>
  );
};

export default TableMealBody;
