import { Fragment, useContext } from "react";
import { store } from "react-notifications-component";
import axios from "axios";

import styles from "./RegisterForm.module.css";
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
    value: name,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName,
  } = useInput(isNotEmpty);

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput((value) => {
    return value.includes("@");
  });

  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(isNotEmpty);

  let formIsValid = false;

  if (nameIsValid && passwordIsValid && emailIsValid) formIsValid = true;

  const BACKEND_URL = process.env.REACT_APP_API_URL;

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!formIsValid) return;

    // const data = new FormData();
    // data.append("username", name);
    // data.append("email", email);
    // data.append("password", password);
    const data = {
      username: name,
      email: email,
      password: password,
    };

    // const config = {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // };

    try {
      await axios.post(BACKEND_URL + "api/auth/signup", data);
    } catch (e) {
      console.log(e);
      store.addNotification({
        title: "Error",
        message: "Account already Exist",
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
      return;
    }
    authCtx.onCloseRegister();
    resetName();
    resetEmail();
    resetPassword();
    store.addNotification({
      title: "Success",
      message: "Registration Successful",
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

  const nameInputClasses = nameHasError
    ? `${styles["form-control"]} ${styles["invalid"]}`
    : `${styles["form-control"]}`;
  const emailInputClasses = emailHasError
    ? `${styles["form-control"]} ${styles["invalid"]}`
    : `${styles["form-control"]}`;
  const passwordInputClasses = passwordHasError
    ? `${styles["form-control"]} ${styles["invalid"]}`
    : `${styles["form-control"]}`;

  return (
    <Card className={styles.modal}>
      <header className={styles.header}>
        <h2>Register Page</h2>
      </header>
      <form onSubmit={submitHandler}>
        <div className={nameInputClasses}>
          <label htmlFor="name">Your Name</label>
          <input
            type="name"
            id="name"
            onBlur={nameBlurHandler}
            onChange={nameChangeHandler}
            value={name}
          />
          {nameHasError ? (
            <p className={styles["error-text"]}>Put Something here for name</p>
          ) : (
            <p />
          )}
        </div>
        <div className={emailInputClasses}>
          <label htmlFor="email">Your E-mail</label>
          <input
            type="email"
            id="email"
            onBlur={emailBlurHandler}
            onChange={emailChangeHandler}
            value={email}
          />
          {emailHasError ? (
            <p className={styles["error-text"]}>Email must include @</p>
          ) : (
            <p />
          )}
        </div>
        <div className={passwordInputClasses}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onBlur={passwordBlurHandler}
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
            <p className={styles["signin"]} onClick={authCtx.onCloseRegister}>
              Log In
            </p>
          </section>
        </div>
        <div className={styles["form-actions"]}>
          <button disabled={!formIsValid} className={styles.submit}>
            Register
          </button>
        </div>
      </form>
    </Card>
  );
};
const RegisterForm = (props) => {
  return (
    <Fragment>
      <Backdrop />
      <ModalOverlay />
    </Fragment>
  );
};

export default RegisterForm;
