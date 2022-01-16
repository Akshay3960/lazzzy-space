import { Fragment } from "react";
import styles from "./RegisterForm.module.css";
import Card from "../UI/Card";

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <Card className={styles.modal}>
      <header className={styles.header}>
        <h2>Register Page</h2>
      </header>
      <form onSubmit={submitHandler}>
        <div className={styles["form-control"]}>
          <label htmlFor="name">Your Name</label>
          <input type="name" id="name" />
        </div>
        <div className={styles["form-control"]}>
          <label htmlFor="email">Your E-mail</label>
          <input type="email" id="email" />
        </div>
        <div className={styles["form-control"]}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>
        <div className={styles["form-control"]}>
          <section>
            <p>You don't have an account?</p>
          </section>
        </div>
        <div className={styles["form-actions"]}>
          <button type="button" onClick = {props.onClose}>Close</button>
          <button className={styles.submit} onClick={props.onClose}>
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
      <ModalOverlay onClose={props.onClose} />
    </Fragment>
  );
};

export default RegisterForm;
