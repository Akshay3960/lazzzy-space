import { Fragment } from "react";
import axios from "axios";

import styles from "./LoginForm.module.css";
import Card from "../UI/Card";
import useInput from "../../hooks/use-input";

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
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
      props.onStatus({
        type: "error",
        message: "Account doesn't exist",
      });
      resetEmail();
      resetPassword();
      return false;
    }
    props.onClose();
    props.onStatus({
      type: "success",
      message: "Login Successful",
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
            <p>You don't have an account?</p>
            <p className={styles["signin"]} onClick={props.onRegister}>
              Sign In
            </p>
          </section>
        </div>
        <div className={styles["form-actions"]}>
          <button type="button" onClick={props.onClose}>
            Close
          </button>
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
      <Backdrop onClose={props.onClose} />
      <ModalOverlay
        onClose={props.onClose}
        onRegister={props.onRegister}
        onStatus={props.onStatus}
      />
    </Fragment>
  );
};

export default Login;
