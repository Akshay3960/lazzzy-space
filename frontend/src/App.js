import { useState, Fragment } from "react";

import "./App.css";
import LoginForm from "./components/log-reg/LoginForm";
import RegisterForm from "./components/log-reg/RegisterForm";

function App() {
  const [toLogin, setToLogin] = useState(true);
  const [toReg, setToReg] = useState(false);

  const toRegisterHandler = () => {
    setToLogin(false);
    setToReg(true);
  };


  const registerCloseHandler = () => {
    setToReg(false);
  };

  const loginHandler = () => {
    setToLogin(true);
  };

  const loginCloseHandler = () => {
    setToLogin(false);
  };

  return (
    <Fragment>
      <div className="App">
        {toReg && <RegisterForm onClose={registerCloseHandler} />}
        {toLogin && (
          <LoginForm
            onClose={loginCloseHandler}
            onRegister={toRegisterHandler}
          />
        )}
        <button onClick={loginHandler} onClose> log in </button>
      </div>
    </Fragment>
  );
}

export default App;
