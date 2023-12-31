import React, { useEffect, useState } from "react";
import style from "./SignUp.module.css";
import { useSignUpMutation } from "../features/bikri/bikriApi";
const SignUp = () => {
  const [signUp, { isSuccess, isError, error, isLoading }] =
    useSignUpMutation();
  const [formValues, setFormValues] = useState({});
  useEffect(() => {
    if (isSuccess) {
      alert("User Created Successfully");
    }
    if (isError) {
      alert(error.data.message);
    }
  }, [isSuccess, isError]);
  const formHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  console.log(formValues);

  return (
    <div>
      <div className={style.signUpFormWrapper}>
        <div className={style.signUpFormDiv}>
          <h2>Signup Form</h2>
          <form
            className={style.signUpForm}
            onSubmit={(e) => {
              e.preventDefault();
              signUp(formValues);
            }}
          >
            <table className={style.signUpTable}>
              <tr>
                <td>Name</td>
                <td>
                  <input onChange={formHandler} type="text" name="name" />
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>
                  <input onChange={formHandler} type="text" name="email" />
                </td>
              </tr>
              <tr>
                <td>Password</td>
                <td>
                  <input
                    onChange={formHandler}
                    type="password"
                    name="password"
                  />
                </td>
              </tr>
              <tr>
                <td>Confirm Password &nbsp;</td>
                <td>
                  <input
                    onChange={formHandler}
                    type="password"
                    name="confirmPassword"
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input type="submit" value="Sign Up" />
                </td>
              </tr>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
