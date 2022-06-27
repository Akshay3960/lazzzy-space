import { useContext } from "react";
import { store } from "react-notifications-component";
import axios from "../../api/axios";

import styles from "./LoginForm.module.css";
import Card from "../UI/Card";
import useInput from "../../hooks/use-input";
import AuthContext from "../../store/auth-context";
// import useRefreshToken from "../../hooks/useRefreshToken";
const Login = () => {
  // const refresh = useRefreshToken();
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


  const submitHandler = async (event) => {
    event.preventDefault();

    if (!formIsValid) return;

    const data = {
      email: email,
      password: password,
    };
    let Res;
    try {
      Res = await axios.post("/api/auth/login", data,
      {
        withCredentials:true
      });
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

    authCtx.onLogin(
      Res.data.result._id,
      Res.data.result.username, 
      Res.data.result.email,
      Res.data.result.color,
      Res.data.result.notification);

      authCtx.setToken(Res.data.accessToken)


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

export default Login;



