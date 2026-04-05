import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import { useDeleteYearMonthMutation, useGetYearMonthQuery } from "../features/bikri/bikriApi";
import AddSheetModal from "../components/AddSheetModal";
import { Button } from "../components/TailwindStyledComponent/Button";

const MealSheets = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user)
  const { data: yearMonths } = useGetYearMonthQuery(user?._id, {
    skip: !user?._id,
  });
  const [deleteYearMonth, { isSuccess }] = useDeleteYearMonthMutation();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);

  useEffect(() => {
    if (isSuccess) {
      alert('Successfully Delete A month!');
    }
  }, [isSuccess]);

  const getMonthName = (monthNumber) => {
    console.log(monthNumber)
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    console.log(months[parseInt(monthNumber-1)])
    return months[parseInt(monthNumber-1)] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        
        .meal-sheets-container {
          font-family: 'Poppins', sans-serif;
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .table-row {
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease-out backwards;
        }
        
        .table-row:nth-child(1) { animation-delay: 0.1s; }
        .table-row:nth-child(2) { animation-delay: 0.15s; }
        .table-row:nth-child(3) { animation-delay: 0.2s; }
        .table-row:nth-child(4) { animation-delay: 0.25s; }
        .table-row:nth-child(5) { animation-delay: 0.3s; }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .table-row:hover {
          background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05));
          transform: translateX(4px);
        }
        
        .delete-btn {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .delete-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }
        
        .delete-btn:hover::before {
          width: 100px;
          height: 100px;
        }
        
        .delete-btn:hover {
          transform: scale(1.1);
        }
        
        .delete-btn:active {
          transform: scale(0.95);
        }
        
        .add-btn-wrapper {
          animation: slideDown 0.6s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="meal-sheets-container max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3 tracking-tight">
            Meal Sheets
          </h1>
          <p className="text-slate-500 text-lg font-light">
            Manage monthly meal planning sheets
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Add Sheet Button */}
        <div className="add-btn-wrapper flex justify-center mb-8">
          <Button
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            $primary={true}
            onClick={() => setShowModal(true)}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Sheet
            </span>
          </Button>
        </div>

        {showModal && <AddSheetModal showModal={showModal} setShowModal={setShowModal} />}

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="grid grid-cols-2 gap-4 text-white font-semibold text-sm md:text-base">
              <div>Month & Year</div>
              <div className="text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {yearMonths?.result?.length > 0 ? (
              yearMonths.result.map((month, index) => (
                <div
                  key={index}
                  className="table-row grid grid-cols-2 gap-4 px-6 py-4 items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-slate-800 font-semibold text-lg">
                        {getMonthName(month?.month)} {month?.year}
                      </div>
                      <div className="text-slate-400 text-sm">
                        Meal planning period
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        const isConfirm = window.confirm('Are you sure you want to delete this month completely?');
                        if (isConfirm) {
                          deleteYearMonth(month);
                        }
                      }}
                      className="delete-btn p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-300 relative"
                      title="Delete this month"
                    >
                      <svg
                        className="w-6 h-6 text-red-500 relative z-10"
                        fill="currentColor"
                        viewBox="0 0 48 48"
                      >
                        <path d="M 20.5 4 A 1.50015 1.50015 0 0 0 19.066406 6 L 14.640625 6 C 12.796625 6 11.086453 6.9162188 10.064453 8.4492188 L 7.6972656 12 L 7.5 12 A 1.50015 1.50015 0 1 0 7.5 15 L 40.5 15 A 1.50015 1.50015 0 1 0 40.5 12 L 40.302734 12 L 37.935547 8.4492188 C 36.913547 6.9162187 35.202375 6 33.359375 6 L 28.933594 6 A 1.50015 1.50015 0 0 0 27.5 4 L 20.5 4 z M 8.9726562 18 L 11.125 38.085938 C 11.425 40.887937 13.77575 43 16.59375 43 L 31.40625 43 C 34.22325 43 36.574 40.887938 36.875 38.085938 L 39.027344 18 L 8.9726562 18 z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-lg font-medium">No meal sheets available</p>
                <p className="text-slate-400 text-sm mt-2">Click "Add New Sheet" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        {yearMonths?.yearMonth?.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-blue-800 text-sm font-medium">
                Total Sheets: {yearMonths?.yearMonth?.length}
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Manage your meal planning sheets by month and year
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealSheets;