import React from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";

const AddSheetModal = ({ showModal, setShowModal }) => {
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
        <button className="btn border border-blue-500 bg-red-500 text-white text-xl">
          Create
        </button>
      </div>
    </div>,
    document.getElementById("modal")
  );
};
export default AddSheetModal;
