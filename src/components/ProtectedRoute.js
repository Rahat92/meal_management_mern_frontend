import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const {auth} = useSelector((state) => state);
  const {user} = auth;
  let content;
  if (user === undefined) {
    content = <>Checking authentication</>;
  } else if (user === null) {
    content = <Navigate to='/' />
  }
  else content = <Outlet />;
  return content
};

export default ProtectedRoute;
