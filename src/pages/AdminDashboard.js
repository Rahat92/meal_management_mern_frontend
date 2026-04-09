import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Space+Mono:wght@400;700&display=swap');
        
        .dashboard-container {
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
        
        .card-link {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: slideIn 0.6s ease-out backwards;
        }
        
        .card-link:nth-child(1) {
          animation-delay: 0.1s;
        }
        
        .card-link:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .card-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .card-link:hover::before {
          left: 100%;
        }
        
        .card-link:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.25);
        }
        
        .card-link:active {
          transform: translateY(-4px) scale(0.98);
        }
        
        .card-icon {
          transition: transform 0.3s ease;
        }
        
        .card-link:hover .card-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .badge {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
      
      <div className="dashboard-container w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-3 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 text-lg font-light">
            Manage your meal services efficiently
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {/* Meal Sheets Card */}
          <Link to="/meal-sheets" className="card-link group block">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 border border-slate-100 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* <div className="card-icon w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div> */}
                
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">
                    Meal Sheets
                  </h2>
                  {/* <p className="text-slate-500 text-sm">
                    View and manage all meal planning sheets
                  </p> */}
                </div>
                
                <div className="badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  Click to access
                </div>
              </div>
            </div>
          </Link>
          
          {/* Current Meals Card */}
          <Link to="/current-status" className="card-link group block">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 border border-slate-100 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* <div className="card-icon w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div> */}
                
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">
                    Current Meals
                  </h2>
                  {/* <p className="text-slate-500 text-sm">
                    Monitor active meal status in real-time
                  </p> */}
                </div>
                
                <div className="badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  Click to access
                </div>
              </div>
            </div>
          </Link>

          <Link to="/users" className="card-link group block">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 border border-slate-100 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* <div className="card-icon w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div> */}
                
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">
                    Users
                  </h2>
                  {/* <p className="text-slate-500 text-sm">
                    Monitor active meal status in real-time
                  </p> */}
                </div>
                
                <div className="badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  All users
                </div>
              </div>
            </div>
          </Link>
          {/* <Link to="/users" className="card-link group block">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 border border-slate-100 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="card-icon w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">
                    Current Users
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Monitor active meal status in real-time
                  </p>
                </div>
                
                <div className="badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  Click to access
                </div>
              </div>
            </div>
          </Link> */}
          <Link to="/product-categories" className="card-link group block">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 border border-slate-100 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* <div className="card-icon w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div> */}
                
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">
                    Product Categories
                  </h2>
                  {/* <p className="text-slate-500 text-sm">
                    Monitor active meal status in real-time
                  </p> */}
                </div>
                
                <div className="badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  Click to access
                </div>
              </div>
            </div>
          </Link>
          <Link to="/meal-expense-summary" className="card-link group block">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 border border-slate-100 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* <div className="card-icon w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div> */}
                
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">
                    Meals Expense Summary
                  </h2>
                  {/* <p className="text-slate-500 text-sm">
                    Monitor active meal status in real-time
                  </p> */}
                </div>
                
                <div className="badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  Click to access
                </div>
              </div>
            </div>
          </Link>
          <Link to="/extra-expense-summary" className="card-link group block">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 border border-slate-100 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* <div className="card-icon w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div> */}
                
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">
                    Extra Expense Summary
                  </h2>
                  {/* <p className="text-slate-500 text-sm">
                    Monitor active meal status in real-time
                  </p> */}
                </div>
                
                <div className="badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  Click to access
                </div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            Select a section to get started
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;