import React from "react";
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
}) => {
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
          {yearMonth?.yearMonth?.map((el) => {
            return (
              <option value={el.month + " " + el.year}>
                {el.month === 0 ? "January" : el.month === 11 ? "December" : ""}{" "}
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
