import { Fragment } from "react";
import axios from "axios"
import styles from "./RegisterForm.module.css";
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
      password: password
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
      props.onStatus({
        type: 'error',
        message:'Username does not exist'
      });
      return;
    }
    props.onClose()
    resetName();
    resetEmail();
    resetPassword();
    props.onStatus({
      type: 'success',
      message: 'Registration Success'
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
        <div className={styles["form-actions"]}>
          <button type="button" onClick={props.onClose}>
            Close
          </button>
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
      <Backdrop onClose={props.onClose} />
      <ModalOverlay onClose={props.onClose} onStatus = {props.onStatus} />
    </Fragment>
  );
};

export default RegisterForm;
