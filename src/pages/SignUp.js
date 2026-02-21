import { useEffect, useState } from "react";
import style from "./SignUp.module.css";
import { useForgotPasswordMutation, useGetManagersQuery, useSignUpMutation } from "../features/bikri/bikriApi";
const SignUp = () => {
  const {data:managers} = useGetManagersQuery()
  const [signUp, { isSuccess, isError, error }] =
    useSignUpMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [formValues, setFormValues] = useState({});
  useEffect(() => {
    if (isSuccess) {
      alert("User Created Successfully");
    }
    if (isError) {
      alert(error.data.message);
    }
  }, [isSuccess, isError, error?.data?.message]);
  const formHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    forgotPassword()
  }, [forgotPassword])
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
                    name="passwordConfirm"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  Choose Manager &nbsp;
                </td>
                <td>
                  <select onChange={formHandler} name="manager">
                    <option value="">Select Manager</option>
                    {managers?.data?.managers?.map((manager) => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                  <br />
                  <span className="text-xs text-red-500">
                    * You can only choose a manager that is already created.
                  </span>
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
