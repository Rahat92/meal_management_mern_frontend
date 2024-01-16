import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import style from "./AdminDashboard.module.css";
const AdminDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);
  return (
    <div className={style.wrapper}>
      <div className={style.createMealSheet}>
        <h1>Meal Sheets</h1>
      </div>
      <div className={style.users}>
        <h1>Users</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
