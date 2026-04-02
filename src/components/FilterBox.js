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
  isChanged,
  saveUpdate,
  isLoading,
}) => {
  console.log(yearMonth)
  const [yearMonthArr, setYearMonthArr] = useState([]);
  useEffect(() => {
    if (todayMonth && todayYear && yearMonth?.result?.length > 0) {
      const arr = yearMonth?.result?.filter((el) => el.month !== todayMonth);
      setYearMonthArr(arr);
    }
  }, [yearMonth?.result.length, todayMonth, todayYear]);
  return (
    <div className={`max-w-[1200px] mx-auto flex justify-between items-center h-[10vh]`}>
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
          </option>

          {yearMonth?.result
            ?.filter(
              (el) => `${el.month}+${el.year}` !== `${todayMonth}+${todayYear}`
            )
            ?.map((el) => {
              return (
                <option
                  style={{ padding: "10px" }}
                  value={el.month + " " + el.year}
                >
                  {el.month === 1
                    ? "January"
                    : el.month === 2
                    ? "February"
                    : el.month === 3
                    ? "March"
                    : el.month === 4
                    ? "April"
                    : el.month === 5
                    ? "May"
                    : el.month === 6
                    ? "June"
                    : el.month === 7
                    ? "July"
                    : el.month === 8
                    ? "August"
                    : el.month === 9
                    ? "September"
                    : el.month === 10
                    ? "October"
                    : el.month === 11
                    ? "November"
                    : el.month === 12
                    ? "December"
                    : ""}{" "}
                  {el.year}
                </option>
              );
            })}
        </select>
      </form>
      <form className={filterBoxStyle.filterName}>
        <select
          style={{ color: "black", borderRadius: "10px" }}
          onChange={(e) => {
            if (e.target.value !== "all") {
              const index = registeredUsers.findIndex(
                (item) => item._id === e.target.value.split(" ")[1]
              );
              setCurrentIndex(index);
            }
            setCurrentUser(e.target.value)
            ;
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
              ?.filter((el) => el.user._id !== user?._id)
              .map((el) => {
                return (
                  <option value={el.user.name + " " + el.user._id}>{el.user.name}</option>
                );
              })}
        </select>
      </form>
      <div
        className={filterBoxStyle.saveBtn}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            color: "black",
            visibility: isChanged ? "visible" : "hidden",
            background: "none",
            fontWeight: "400",
          }}
          disabled={!isChanged || isLoading}
          onClick={saveUpdate}
        >
          Saving...
        </button>
      </div>
    </div>
  );
};

export default FilterBox;
