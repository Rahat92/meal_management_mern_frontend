import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { useCreateMealMutation, useGetUsersQuery } from "../features/bikri/bikriApi";
import { readableDate } from "../utils/readableDate";
import getCurrentMonthLength from "../utils/getCurrentMonthLength";

const AddSheetModal = ({ showModal, setShowModal }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [createMeal, {isLoading, isError, error, isSuccess}] = useCreateMealMutation()
  
  useEffect(() => {
    if(isSuccess){
      alert('Successfully Create Sheet')
    }
  }, [isSuccess])

  const { data: users } = useGetUsersQuery();
  let year = process.env.REACT_APP_CURRENT_YEAR || 2025;
  const [dates, setDates] = useState([]);
  const monthLength = getCurrentMonthLength(selectedMonth, year);
  useEffect(() => {
    let days = [];
    for (let i = 1; i <= monthLength; i++) {
      const time = readableDate(new Date(year, selectedMonth, i));
      const readableYear = time.year;
      const readableMonth = time.month;
      const readableDay = time.day;
      days.push({
        date: `${readableDay} ${readableMonth} ${readableYear}`,
      });
    }
    setDates(days);
    let borderIds = [];
    if (users?.borders?.length > 0) {
      users.borders.map((el) => {
        borderIds.push(el.name);
      });
      days = days.map((el) => {
        return {
          date: el.date,
          day: el.date.split(" ")[0],
          month:selectedMonth,
          year,
          mealManager: "6570001d7e42deb0b24b9657",
        };
      });
    }
    setDates([...days]);
  }, [users?.borders, selectedMonth]);
  return createPortal(
    <div className="fixed top-0 w-full h-screen bg-green-500 bg-opacity-[.9] flex flex-col justify-center items-center z-50 gap-[2rem] font-sans">
      <div
        className="absolute top-[20px] md:top-[50px] right-[20px] md:right-[50px] text-3xl cursor-pointer"
        onClick={() => setShowModal(false)}
      >
        <IoMdClose />
      </div>
      <h1 className="text-3xl mt-[-100px]">Create Meal Sheet</h1>
      <div className="rounded-md p-4 bg-green-200 text-black flex flex-col md:flex-row justify-center gap-[2rem] items-center">
        <form className="text-2xl">
          <select value={selectedMonth} onChange={(e) => {
            setSelectedMonth(e.target.value)
          }}>
            <option value={0}>January</option>
            <option value={1}>February</option>
            <option value={2}>March</option>
            <option value={3}>April</option>
            <option value={4}>May</option>
            <option value={5}>June</option>
            <option value={6}>July</option>
            <option value={7}>August</option>
            <option value={8}>September</option>
            <option value={9}>October</option>
            <option value={10}>November</option>
            <option value={11}>December</option>
          </select>
        </form>
        <h1 className="md:text-2xl text-3xl font-bold">{process.env.REACT_APP_CURRENT_YEAR}</h1>
        <button onClick={() => {
          createMeal(dates)
          // console.log(dates)
        }} className="btn border border-blue-500 bg-red-500 text-white text-xl">
          Create
        </button>
      </div>
    </div>,
    document.getElementById("modal")
  );
};
export default AddSheetModal;
