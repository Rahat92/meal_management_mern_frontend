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
        <div className="p-[50px] bg-red-500 shrink-0 basis-[50%] rounded-[20px]">
          <h1>
            <Link to="/meal-sheets">Meal Sheets</Link>
          </h1>
        </div>
        <div className="p-[50px] bg-green-200 shrink-0 rounded-[20px] basis-[50%]">
          <h1>Meal Sheets</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
