import { useState, Fragment } from "react";

import "./App.css";
import LoginForm from "./components/log-reg/LoginForm";
import RegisterForm from "./components/log-reg/RegisterForm";
import Navbar from "./components/navbar/Navbar";
function App() {
  const [toLogin, setToLogin] = useState(false);
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
      <Navbar onLogin={loginHandler} onRegister= {toRegisterHandler}/>
      <div className="App">
        {toReg && <RegisterForm onClose={registerCloseHandler} />}
        {toLogin && (
          <LoginForm
            onClose={loginCloseHandler}
            onRegister={toRegisterHandler}
          />
        )}
        {!toLogin && !toReg && (
          <button onClick={loginHandler} onClose>
            {" "}
            log in{" "}
          </button>
        )}
      </div>
    </Fragment>
  );
}

export default App;
