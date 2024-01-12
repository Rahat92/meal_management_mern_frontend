import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import style from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/bikri/bikriApi";
import { useSelector } from "react-redux";
const NavBar = () => {
  const dropdownBox = useRef();
  const [logout, { isSuccess }] = useLogoutMutation();
  const [showDropDown, setShowDropDown] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownBox.current.contains(e.target)) {
        setShowDropDown(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showDropDown]);
  return (
    <div className={style.navbarWrapper}>
      <div className={style.wrapper}>
        <div className={style.brand}>
          <Link to="/meals">Home</Link>
        </div>
        <div className={style.brand}>
          <Link to="/all-month-stats">Summery</Link>
        </div>
        <div
          ref={dropdownBox}
          onClick={(e) => {
            setShowDropDown((prev) => !prev);
          }}
          className={style.btnDiv}
        >
          <div
            style={{
              width: "25px",
              height: "25px",
              background: "violet",
              borderRadius: "50%",
              fontSize: "13px",
              color: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "3000",
            }}
          >
            {user?.name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ padding: "0 .2rem" }}>{user?.name}</div>
          <FontAwesomeIcon style={{ fontSize: "1.2rem" }} icon={faAngleDown} />
          <div
            style={{
              position: "absolute",
              top: "75%",
              right: "25px",
              transform: "translateY(-50%) rotate(180deg)",
              border: "20px solid transparent",
              borderTopColor: "#fff",
              display: showDropDown ? "" : "none",
              zIndex: "5000",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "120%",
              left: "25px",
              width: "80px",
              justifyContent: "center",
              zIndex: "3000",
              boxShadow: "1px 5px 10px black",
              display: showDropDown ? "" : "none",
              borderRadius: "40%",
              overflow: "hidden",
              background: "green",
              textAlign: "center",
            }}
          >
            <ul
              style={{ background: "white", padding: ".3rem 0" }}
              onClick={(e) => e.stopPropagation()}
            >
              <li
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  // padding: ".5rem 0 .5rem .5rem",
                  background: "white",
                  color: "black",
                  cursor: "pointer",
                }}
              >
                Account
              </li>
              <li
                style={{
                  border: "1.2px solid violet",
                  borderRadius: "5px",
                  width: "55%",
                  // marginLeft: ".5rem",
                  margin: "0 auto",
                }}
              ></li>
              <li
                style={{
                  // padding: ".5rem 0 .5rem .5rem",
                  color: "black",
                  cursor: "pointer",
                  background: "white",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
