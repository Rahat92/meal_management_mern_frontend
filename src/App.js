import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Meal from "./pages/Meal";
import AllMonthsStats from "./pages/AllMonthsStats";
import SignIn from "./pages/SignIn";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { userLoggedIn } from "./features/auth/authSlice";
import Test from "./pages/Test";
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const localAuth = JSON.parse(localStorage.getItem("auth"));
    dispatch(
      userLoggedIn({ accessToken: localAuth?.token, user: localAuth?.user })
    );
  }, []);
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/meal" element={<Meal />} />
          <Route path="/all-month-stats" element={<AllMonthsStats />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
