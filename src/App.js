import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Meal from "./pages/Meal";
import AllMonthsStats from "./pages/AllMonthsStats";
import SignIn from "./pages/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userLoggedIn } from "./features/auth/authSlice";
import { locationPathChanged } from "./features/locationPath";
import Test from "./pages/Test";
import SignUp from "./pages/SignUp";
import NavBar from "./components/NavBar";
const App = () => {
  const { pathname } = useSelector((state) => state.currentPath);
  console.log(pathname);
  const dispatch = useDispatch();
  useEffect(() => {
    const localAuth = JSON.parse(localStorage.getItem("auth"));
    dispatch(
      userLoggedIn({ accessToken: localAuth?.token, user: localAuth?.user })
    );
    // dispatch(locationPathChanged(window.location.pathname))
  }, []);
  
  return (
    <div>
      <Router>
        {pathname !== "/login"&&pathname&& <NavBar />}
        <Routes>
          <Route path="/" element={<Meal />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/all-month-stats" element={<AllMonthsStats />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
