import React, { Fragment, useContext } from "react";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import "./App.css";
import BoardPage from "./components/lazy-board/BoardPage";
import LoginForm from "./components/log-reg/LoginForm";
import RegisterForm from "./components/log-reg/RegisterForm";
import Navbar from "./components/navbar/Navbar";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Fragment>
      <div className="App">
        <ReactNotification />
        {!authCtx.isLoggedIn && authCtx.openRegister && <RegisterForm />}
        {!authCtx.isLoggedIn && !authCtx.openRegister && <LoginForm />}
        <Navbar />
        <BoardPage />
      </div>
    </Fragment>
  );
}

export default App;
