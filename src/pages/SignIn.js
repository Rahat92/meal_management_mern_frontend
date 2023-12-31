import React from "react";
import { useState } from "react";
import { useLoginMutation } from "../features/bikri/bikriApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const [login, { isSuccess }] = useLoginMutation();
  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);
  return (
    <div>
      <table>
        <tr>
          <td>Email</td>
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
  );
};

export default SignIn;
