import React from "react";

const TableDateAndMealBody = ({
  dateRef,
  currentUser,
  headHeight,
  arrOfMeals,
  currentDay,
  todayDate,
  tableBodyRef,
  nowScroll,
  screenWidth,
}) => {
  return (
    <div
      ref={dateRef}
      onScroll={() => {
        // window.scrollTo(window.pageXOffset, dateRef.current.scrollTop, {
        //   scrollBehavior: "smooth",
        // });
        if (nowScroll) {
          tableBodyRef?.current?.scrollTo(
            tableBodyRef?.current?.scrollLeft,
            dateRef?.current?.scrollTop
          );
        }
      }}
      style={{
        position: "fixed",
        width:
          currentUser !== "all"
            ? screenWidth > 1000
              ? "24%"
              : "35%"
            : screenWidth > 1000
            ? "12%"
            : "150px",
        top: headHeight + 90 + "px",
        bottom: "0",
        background: "white",
        overflowY: "scroll",
        overflowX: "hidden",
        // background:"red",
        left: screenWidth > 1000 ? "11%" : "0",
        // display: "none",
        // scrollBehavior: "smooth",
        // borderLeft: "2px solid black",
        boxShadow: "-1px 0 4px -2px black",
      }}
    >
      <table
        style={{
          width: "100%",
          color: "black",
          borderTop: "1px solid blue",
        }}
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
                    borderRight: currentUser === "all" ? "2px solid black" : "",
                    borderBottom: "2px solid green",
                    width: "100%",
                  }}
                >
                  <td
                    style={{
                      borderRight: "2px solid green",
                      width: "50px",
                      textAlign: "center",
                      background:
                        el.date.split(" ")[0] == todayDate ? "red" : "",
                    }}
                  >
                    {el.date?.split(" ")[0]}
                  </td>
                  <td
                    style={{
                      height: "100px",
                      color: "black",
                    }}
                  >
                    <table style={{ width: "100%", height: "86px" }}>
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
  );
};

export default TableDateAndMealBody;
