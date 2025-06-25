import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import style from "./MealSheets.module.css";
import { useDeleteYearMonthMutation, useGetYearMonthQuery } from "../features/bikri/bikriApi";
import AddSheetModal from "../components/AddSheetModal";

import { Button } from "../components/TailwindStyledComponent/Button";
const MealSheets = () => {
  const { data: yearMonths } = useGetYearMonthQuery();
  const [deleteYearMonth, { isSuccess }] = useDeleteYearMonthMutation()
  const dispatch = useDispatch();
  const [showModal, setShowModal] = React.useState(false);
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);

  useEffect(() => {
    if (isSuccess) {
      alert('Successfully Delete A month!')
    }
  }, [isSuccess])
  return (
    <div className={`${style.mealSheets} z-[-100] mt-8 p-3 flex flex-col justify-center items-center`}>
      <div className="max-w-[150px] text-center">
        <Button className="md:mt-10" $primary={true} onClick={() => setShowModal(true)}>
          Add Sheet
        </Button>
      </div>
      <h1 className="z-10 my-3">Meal Sheets</h1>
      {showModal && <AddSheetModal showModal={showModal} setShowModal={setShowModal} />}
      <div className={`${style.tableWrapper} top-[0] border-2`}>
        <table>
          <thead className="bg-green-500 font-bold">
            <tr>
              <td>Month</td>
              <td className="w-full text-center">Action</td>
            </tr>
          </thead>
          <tbody className="">
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
                <td className="text-center w-full">
                  <button
                    onClick={() => {
                      const isConfirm = window.confirm('Are you sure you want to delete a month completely?')
                      if (isConfirm) {
                        deleteYearMonth(yearMonth)
                      }
                    }}
                    className={style.btn}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                      <path d="M 20.5 4 A 1.50015 1.50015 0 0 0 19.066406 6 L 14.640625 6 C 12.796625 6 11.086453 6.9162188 10.064453 8.4492188 L 7.6972656 12 L 7.5 12 A 1.50015 1.50015 0 1 0 7.5 15 L 40.5 15 A 1.50015 1.50015 0 1 0 40.5 12 L 40.302734 12 L 37.935547 8.4492188 C 36.913547 6.9162187 35.202375 6 33.359375 6 L 28.933594 6 A 1.50015 1.50015 0 0 0 27.5 4 L 20.5 4 z M 8.9726562 18 L 11.125 38.085938 C 11.425 40.887937 13.77575 43 16.59375 43 L 31.40625 43 C 34.22325 43 36.574 40.887938 36.875 38.085938 L 39.027344 18 L 8.9726562 18 z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MealSheets;
