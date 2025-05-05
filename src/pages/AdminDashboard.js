import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import style from "./AdminDashboard.module.css";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);
  return (
    <div className="flex items-center h-screen bg-gray-200 justify-center">
      <div className="w-full sm:w-1/2 h-1/2 items-center m-auto flex justify-center flex-col md:flex-row gap-5 text-center">
        <div className="min-w-[100%] sm:min-w-[80%] p-[50px] shrink-0 basis-[50%] bg-blue-500 font-bold text-3xl rounded-[20px]">
          <h1>
            <Link to="/meal-sheets">Meal Sheets</Link>
          </h1>
        </div>
        <div className="min-w-[100%] sm:min-w-[80%] p-[50px] shrink-0 basis-[50%] bg-blue-500 font-bold text-3xl rounded-[20px]">
          <h1>
            <Link to="/current-status">Current Meals</Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
