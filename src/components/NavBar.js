import React, { useEffect } from "react";
import style from "./NavBar.module.css";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/bikri/bikriApi";
const NavBar = () => {
  const [logout, {isSuccess}] = useLogoutMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess]);
  return (
    <div className={style.navbarWrapper}>
      <div className={style.wrapper}>
        <div>Navbar</div>
        <div className={style.btnDiv}>
          <button onClick={() => logout()}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
