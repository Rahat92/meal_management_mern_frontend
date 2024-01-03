import React, { useEffect } from "react";
import style from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/bikri/bikriApi";
const NavBar = () => {
  const [logout, { isSuccess }] = useLogoutMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);
  return (
    <div className={style.navbarWrapper}>
      <div className={style.wrapper}>
        <div className={style.brand}>
          <Link to="/meals">Home</Link>
        </div>
        <div className={style.brand}>
          <Link to="/all-month-stats">Summery</Link>
        </div>
        <div className={style.btnDiv}>
          <button onClick={() => logout()}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
