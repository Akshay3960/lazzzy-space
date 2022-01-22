import { useState, Fragment } from "react";

import "./App.css";
import BoardPage from "./components/lazy-board/BoardPage";
import LoginForm from "./components/log-reg/LoginForm";
import RegisterForm from "./components/log-reg/RegisterForm";
import Navbar from "./components/navbar/Navbar";
import StatusCard from "./components/UI/StatusCard";

function App() {
  const [toLogin, setToLogin] = useState(false);
  const [toReg, setToReg] = useState(false);

  const [statusAction, setStatusAction] = useState();

  const onStatusActionHandler = (action) => {
    setStatusAction(action);
    console.log("yeah it's working")
  }

  const closeStatusActionHandler = () => {
    setStatusAction();
  }


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
        <Navbar onLogin={loginHandler} onRegister={toRegisterHandler} />

        {toReg && <RegisterForm onClose={registerCloseHandler} onStatus = {onStatusActionHandler} />}
        {toLogin && (
          <LoginForm
            onClose={loginCloseHandler}
            onRegister={toRegisterHandler}
            onStatus = {onStatusActionHandler}
          />
        )}
        <BoardPage />
        {statusAction && <StatusCard onCloseModal = {closeStatusActionHandler} action = {statusAction}/>}
      </div>
    </Fragment>
  );
}

export default App;
