import { Fragment, useContext } from "react";
import { store } from "react-notifications-component";
import axios from "axios";

import styles from "./LoginForm.module.css";
import Card from "../UI/Card";
import useInput from "../../hooks/use-input";
import AuthContext from "../../store/auth-context";

const Backdrop = (props) => {
  return <div className={styles.backdrop} />;
};

const ModalOverlay = (props) => {
  const authCtx = useContext(AuthContext);
  const isNotEmpty = (value) => {
    return value.trim() !== "";
  };

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    //inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput((value) => {
    return value.includes("@");
  });

  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    //inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(isNotEmpty);

  let formIsValid = false;

  if (passwordIsValid && emailIsValid) formIsValid = true;

  const BACKEND_URL = process.env.REACT_APP_API_URL;

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!formIsValid) return;

    const data = {
      email: email,
      password: password,
    };

    try {
      await axios.post(BACKEND_URL + "api/auth/login", data);
    } catch (e) {
      console.log(e);
      store.addNotification({
        title: "Error",
        message: "Account doesn't exist/User Info incorrect",
        type: "danger",
        insert: "top",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate_animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      resetEmail();
      resetPassword();
      return false;
    }
    authCtx.onLogin('',email,password)
    store.addNotification({
      title: "Success",
      message: "Login Successful",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate_animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  };

  return (
    <Card className={styles.modal}>
      <header className={styles.header}>
        <h2>Login Page</h2>
      </header>
      <form onSubmit={submitHandler}>
        <div className={styles["form-control"]}>
          <label htmlFor="email">Your E-mail</label>
          <input
            type="email"
            id="email"
            onChange={emailChangeHandler}
            value={email}
          />
          {emailHasError ? (
            <p className={styles["error-text"]}>Email must include @</p>
          ) : (
            <p />
          )}
        </div>
        <div className={styles["form-control"]}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={passwordChangeHandler}
            value={password}
          />
          {passwordHasError ? (
            <p className={styles["error-text"]}>
              Put Something here for password
            </p>
          ) : (
            <p />
          )}
        </div>
        <div className={styles["form-control"]}>
          <section>
            <p>Don't have an account?</p>
            <p className={styles["signin"]} onClick={authCtx.onOpenRegister}>
              Sign In
            </p>
          </section>
        </div>
        <div className={styles["form-actions"]}>
          <button className={styles.submit} disabled={!formIsValid}>
            Log in
          </button>
        </div>
      </form>
    </Card>
  );
};
const Login = (props) => {
  return (
    <Fragment>
      <Backdrop />
      <ModalOverlay/>
    </Fragment>
  );
};

export default Login;
