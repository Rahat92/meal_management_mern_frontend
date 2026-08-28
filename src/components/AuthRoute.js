import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AuthRoute = () => {
  const { user } = useSelector((state) => state.auth);
  if (user) {
    return <Navigate to="/advance-sheet" />;
  }
  return <Outlet />;
};

export default AuthRoute;
