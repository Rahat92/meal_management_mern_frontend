import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { useCreateMealMutation, useGetUsersQuery } from "../features/bikri/bikriApi";
import { readableDate } from "../utils/readableDate";
import getCurrentMonthLength from "../utils/getCurrentMonthLength";

const AddSheetModal = ({ showModal, setShowModal }) => {
  const [createMeal, {isLoading, isError, error, isSuccess}] = useCreateMealMutation()
  const { data: users } = useGetUsersQuery();
  let year = 2024;
  let month = 8;
  const [dates, setDates] = useState([]);
  const monthLength = getCurrentMonthLength(4, 2024);
  useEffect(() => {
    let days = [];
    for (let i = 1; i <= monthLength; i++) {
      const time = readableDate(new Date(year, month, i));
      const readableYear = time.year;
      const readableMonth = time.month;
      const readableDay = time.day;
      days.push({
        date: `${readableDay} ${readableMonth} ${readableYear}`,
      });
    }
    // setDates(days);
    let borderIds = [];
    if (users?.borders?.length > 0) {
      users.borders.map((el) => {
        borderIds.push(el.name);
      });
      days = days.map((el) => {
        return {
          date: el.date,
          day: el.date.split(" ")[0],
          month,
          year,
          mealManager: "6570001d7e42deb0b24b9657",
        };
      });
    }
    setDates([...days]);
  }, [users?.borders]);

  return createPortal(
    <div className="relative w-full h-screen bg-green-500 flex flex-col justify-center items-center z-50 gap-[2rem] font-sans">
      <div
        className="absolute top-[50px] right-[50px] text-3xl cursor-pointer"
        onClick={() => setShowModal(false)}
      >
        <IoMdClose />
      </div>
      <h1 className="text-3xl mt-[-100px]">Create Meal Sheet</h1>
      <div className="rounded-md p-4 bg-green-200 text-black flex flex-col md:flex-row justify-center gap-[2rem] items-center">
        <form className="text-2xl">
          <select>
            <option>January</option>
            <option>February</option>
            <option>Merch</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </form>
        <h1 className="md:text-2xl text-3xl font-bold">2024</h1>
        <button onClick={() => {
          createMeal(dates)
        }} className="btn border border-blue-500 bg-red-500 text-white text-xl">
          Create
        </button>
      </div>
    </div>,
    document.getElementById("modal")
  );
};
export default AddSheetModal;
