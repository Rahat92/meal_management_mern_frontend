import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AuthRoute = () => {
  const { user } = useSelector((state) => state.auth);
  if (user) {
    return <Navigate to="/meals" />;
  }
  return <Outlet />;
};

export default AuthRoute;
