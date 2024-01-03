import React from "react";
import { useState } from "react";
import { useLoginMutation } from "../features/bikri/bikriApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import style from "./SignIn.module.css";
const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const [login, { isSuccess }] = useLoginMutation();
  useEffect(() => {
    if (isSuccess) {
      navigate("/meals");
    }
  }, [isSuccess]);
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);
  return (
    <div className={style.tableWrapper}>
      <div className={style.wrapper}>
      <h1>Sign In</h1>
      <table>
        <tr>
          <td>Email</td>
        </tr>
        <tr>
          <td>
            <input
              onChange={(e) =>
                setFormValue({ ...formValue, email: e.target.value })
              }
              value={formValue.email}
              type="Email"
            />
          </td>
        </tr>
        <tr>
          <td>Password</td>
        </tr>
        <tr>
          <td>
            <input
              onChange={(e) =>
                setFormValue({ ...formValue, password: e.target.value })
              }
              type="password"
            />
          </td>
        </tr>
      </table>
      <button onClick={() => login(formValue)}>Login</button>
      </div>
    </div>
  );
};

export default SignIn;
