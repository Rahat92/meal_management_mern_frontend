import React from "react";

const TableDateAndMealHeader = ({ currentUser, headRef }) => {
  return (
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
  );
};

export default TableDateAndMealHeader;
