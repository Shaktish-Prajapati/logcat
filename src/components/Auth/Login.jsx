import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomCard from "../../Container/CustomCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Style from "./Login.module.scss";
import "../../css/theme.scss";
import { loginWithEmail } from "../../redux/action/AdminAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { validateEmailHelper } from "../../helper/Emails";

export default function Login() {
  const [loginForm, setLoginForm] = useState({
    email: localStorage.getItem("adminUserName")
      ? JSON.parse(localStorage.getItem("adminUserName"))
      : null,
    password: localStorage.getItem("adminUserCredential")
      ? JSON.parse(localStorage.getItem("adminUserCredential"))
      : null,
  });
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [setErrorPassword, setSetErrorPassword] = useState(null);

  const dispatch = useDispatch();
  const adminLoginReducer = useSelector((state) => state.adminLoginReducer);
  const { loading, error, adminInfo } = adminLoginReducer;
  console.log("adminLoginReducer",adminLoginReducer )

  const history = useHistory();

  // VALIDATE EMAIL
  const validateEmail = (email) => {
    const isEmailValid = validateEmailHelper(email);
    if(isEmailValid.isSuccess){
      setLoginForm({
        ...loginForm,
        email,
      });
      
      return isEmailValid.isSuccess
    }
    if(!isEmailValid.isSuccess && !isEmailValid.isEmail){
      setEmailError(isEmailValid.message);
      return isEmailValid.isSuccess
    }
    if (!isEmailValid.isSuccess && isEmailValid.isEmail) {
      setEmailError(isEmailValid.message);
      return isEmailValid.isSuccess
    }
    setEmailError(null);
    return true;
  };

  // PASSWORD VALIDATE
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Please enter your password.");
      return false;
    }
    if (password !== null) {
      var pattern = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
    }
    setLoginForm({
      ...loginForm,
      password: password,
    });
    setPasswordError(null);
    return true;
  };

  // HANDLE SUBMIT AND DISPATCH
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = validateEmail(loginForm.email);
    const password = validatePassword(loginForm.password);

    if (email && password) {
      dispatch(
        loginWithEmail(
          loginForm.email,
          loginForm.password,
        )
      );
    }
  };

  console.log("error", error);

  useEffect(() => {
    if (localStorage.getItem("ddAdminToken")) {
      history.push("/home");
    }
  }, [history, adminInfo]);

  useEffect(() => {
    setSetErrorPassword(error);
  }, [error]);

  return (
    <>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CustomCard height="400px" width="500px">
          <section className={Style.Login}>
            <div className="Login-title d-flex justify-content-start">
              <p className={Style.headerText}>Login</p>
            </div>
            <div className="Form-card">
              <form>
                <div
                  className={
                    emailError
                      ? `${Style.imputFieldsError} IFS`
                      : `${Style.imputFields} mt-4 IFS`
                  }
                >
                  <span>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    className="form-control LoginForminput "
                    id="exampleInputEmail1"
                    placeholder="Enter your email"
                    aria-describedby="emailHelp"
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    value={loginForm.email}
                  />
                </div>
                {emailError != null ? (
                  <small style={{ color: "red" }}>{emailError}</small>
                ) : (
                  ""
                )}
                <div
                  className={
                    passwordError
                      ? `${Style.imputFieldsError} mt-4 IFS`
                      : `${Style.imputFields} mt-4 IFS`
                  }
                >
                  <span>
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type="password"
                    className="form-control LoginForminput "
                    id="exampleInputEmail1"
                    placeholder="Enter your password"
                    aria-describedby="emailHelp"
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    value={loginForm.password}
                  />
                </div>
                {passwordError != null ? (
                  <small style={{ color: "red" }}>{passwordError}</small>
                ) : setErrorPassword ? (
                  <small style={{ color: "red" }}>{setErrorPassword}</small>
                ) : (
                  ""
                )}
                <section
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "end ",
                  }}
                >
                  <Link
                    to="/forgetPassword"
                    style={{
                      textDecoration: "none",
                      color: "#257d7c",
                      fontWeight: 500,
                    }}
                  >
                    Forget Password?
                  </Link>
                </section>
                <Button
                  style={{ float: "right", width: "30%", fontWeight: 700 }}
                  type="submit"
                  className="mt-4"
                  onClick={(e) => handleSubmit(e)}
                >
                  {loading ? "Loading..." : "Login"}
                </Button>
              </form>
            </div>
          </section>
        </CustomCard>
      </Container>
    </>
  );
}
