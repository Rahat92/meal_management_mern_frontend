import React, { useEffect, useState } from "react";
import filterBoxStyle from "./FilterBox.module.css";
const FilterBox = ({
  setGetYear,
  setGetMonth,
  style,
  yearMonth,
  registeredUsers,
  setCurrentIndex,
  setCurrentUser,
  user,
  todayMonth,
  todayYear,
}) => {
  const [yearMonthArr, setYearMonthArr] = useState([]);
  useEffect(() => {
    if (todayMonth && todayYear && yearMonth?.yearMonth?.length > 0) {
      const arr = yearMonth?.yearMonth?.filter((el) => el.month !== todayMonth);
      console.log(arr);
      setYearMonthArr(arr);
    }
  }, [yearMonth?.yearMonth.length, todayMonth, todayYear]);
  console.log(yearMonth);
  console.log(todayMonth, todayYear);
  console.log(yearMonth?.yearMonth?.filter((el) => el.month!==todayMonth));
  return (
    <div className={filterBoxStyle.wrapper}>
      <form className={filterBoxStyle.filterDate}>
        <select
          style={{ borderRadius: "10px" }}
          className={style.selectMonthYear}
          onChange={(e) => {
            setGetYear(e.target.value.split(" ")[1] * 1);
            setGetMonth(e.target.value.split(" ")[0] * 1);
          }}
        >
          <option value={todayMonth + " " + todayYear}>
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
          </option>
          {yearMonth?.yearMonth
            ?.filter((el) => `${el.month}+${el.year}` !== `${todayMonth}+${todayYear}`)
            ?.map((el) => {
              return (
                <option value={el.month + " " + el.year}>
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
                </option>
              );
            })}
        </select>
      </form>
      <form>
        <select
          style={{ color: "black", borderRadius: "10px" }}
          onChange={(e) => {
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
            <option value={user?.name + " " + user?._id}>{user?.name}</option>
          )}
          <option>all</option>
          {user?.role === "admin" && (
            <option value={user?.name + " " + user?._id}>{user?.name}</option>
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
  );
};

export default FilterBox;
