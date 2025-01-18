import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import style from "./MealSheets.module.css";
import { useDeleteYearMonthMutation, useGetYearMonthQuery } from "../features/bikri/bikriApi";
import AddSheetModal from "../components/AddSheetModal";

import { Button } from "../components/TailwindStyledComponent/Button";
const MealSheets = () => {
  const { data: yearMonths } = useGetYearMonthQuery();
  const [deleteYearMonth, {isSuccess}] = useDeleteYearMonthMutation()
  const dispatch = useDispatch();
  const [showModal, setShowModal] = React.useState(false);
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);

  useEffect(() => {
    if(isSuccess){
      alert('Successfully Delete A month!')
    }
  }, [isSuccess])
  return (
    <div className={`${style.mealSheets} z-[-100]`}>
      <div>

        <Button $primary={true} onClick={() => setShowModal(true)}>
          Add Sheet
        </Button>

      </div>
      <h1>Meal Sheets</h1>
      {showModal && <AddSheetModal showModal={showModal} setShowModal={setShowModal} />}
      <div className={`${style.tableWrapper}`}>
        <div
          className={style.tableHeder}
          style={{ position: "sticky", background: "red", top: "0" }}
        >
          <table>
            <tr>
              <td>Month</td>
              <td>Action</td>
            </tr>
          </table>
        </div>
        <table>
          {yearMonths?.yearMonth?.map((yearMonth) => (
            <tr>
              <td>
                {yearMonth?.month == "0"
                  ? "January"
                  : yearMonth?.month == "1"
                    ? "February"
                    : yearMonth?.month == "2"
                      ? "March"
                      : yearMonth?.month == "3"
                        ? "April"
                        : yearMonth?.month == "4"
                          ? "May"
                          : yearMonth?.month == "5"
                            ? "June"
                            : yearMonth?.month == "6"
                              ? "July"
                              : yearMonth?.month == "7"
                                ? "August"
                                : yearMonth?.month == "8"
                                  ? "September"
                                  : yearMonth?.month == "9"
                                    ? "Octobor"
                                    : yearMonth?.month == "10"
                                      ? "November"
                                      : yearMonth?.month == "11"
                                        ? "December"
                                        : ""}{" "}
                {yearMonth?.year}
              </td>
              <td>
                <button
                  onClick={() => {
                    const isConfirm = window.confirm('Are you sure you want to delete a month completely?')
                    if(isConfirm){
                      deleteYearMonth(yearMonth)
                    }
                  }}
                  className={style.btn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default MealSheets;
