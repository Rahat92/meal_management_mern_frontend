import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Meal from "./pages/Meal";
import AllMonthsStats from "./pages/AllMonthsStats";
import SignIn from "./pages/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userLoggedIn } from "./features/auth/authSlice";
import Test from "./pages/Test";
import SignUp from "./pages/SignUp";
import NavBar from "./components/NavBar";
import AuthRoute from "./components/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import MealSheets from "./pages/MealSheets";
import Conversation from "./pages/Conversations";
import CurrentStatus from "./pages/CurrentStatus";
const App = () => {
  const { pathname } = useSelector((state) => state.currentPath);
  const dispatch = useDispatch();
  useEffect(() => {
    const localAuth = JSON.parse(localStorage.getItem("auth"));
    dispatch(
      userLoggedIn({ accessToken: localAuth?.token || null, user: localAuth?.user || null })
    );
  }, [dispatch]);

  return (
    <div className="font-sans bg-green-500/20">
      <Router>
        {pathname !== "/" && pathname && <NavBar />}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/current-status" element={<CurrentStatus />} />
          <Route path="/meal-sheets" element={<MealSheets />} />
          <Route path="/conversations" element={<Conversation />} />

          <Route path="/test" element={<Test />} />
          <Route element={<AuthRoute />}>
            <Route path="/" element={<SignIn />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/all-month-stats" element={<AllMonthsStats />} />
            <Route path="/meals" element={<Meal />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
