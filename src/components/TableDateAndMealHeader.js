import React from "react";

const TableDateAndMealHeader = ({ currentUser, headRef, screenWidth }) => {
  return (
    <div
      style={{
        width:
          currentUser !== "all" ? "24%" : screenWidth > 1000 ? "12%" : "150px",
        position: "fixed",
        top: headRef,
        left: screenWidth > 1000 ? "11%" : "0",
        height: "50px",
        background: "white",
        color: "black",
        borderBottom: "2px solid black",
      }}
    >
      <table style={{ width: "100%", height: "100%" }}>
        <tr
          style={{
            borderRight: currentUser === "all" ? "2px solid black" : "",
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
  );
};

export default TableDateAndMealHeader;
