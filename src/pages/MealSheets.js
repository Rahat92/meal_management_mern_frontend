import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import style from "./MealSheets.module.css";
const MealSheets = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);
  return (
    <div className={style.mealSheets}>
      <h1>Meal Sheets</h1>
      <div className={style.tableWrapper}>
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
          <tr>
            <td>January 2024</td>
            <td>Delete</td>
          </tr>
          <tr>
            <td>February 2024</td>
            <td>Delete</td>
          </tr>
          <tr>
            <td>January 2024</td>
            <td>Delete</td>
          </tr>
          <tr>
            <td>January 2024</td>
            <td>Delete</td>
          </tr>
          <tr>
            <td>January 2024</td>
            <td>Delete</td>
          </tr>
          <tr>
            <td>January 2024</td>
            <td>Delete</td>
          </tr>
          <tr>
            <td>January 2024</td>
            <td>Delete</td>
          </tr>
          <tr>
            <td>January 2024</td>
            <td>Delete</td>
          </tr>
          <tr>
            <td>December 2024</td>
            <td>Delete</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default MealSheets;
