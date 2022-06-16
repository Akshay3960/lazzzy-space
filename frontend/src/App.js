import React, { Fragment, useContext } from "react";
import "react-notifications-component/dist/theme.css";

import "./App.css";
// import pic from "./images/0137.jpg";
import BoardPage from "./components/lazy-board/BoardPage";
import BottomNav from "./components/side navbar/BottomNav"
import LoginForm from "./components/log-reg/LoginForm";
import RegisterForm from "./components/log-reg/RegisterForm";
import Navbar from "./components/navbar/Navbar";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);


  return (
    <Fragment>
      <div className="App">
        {!authCtx.isLoggedIn && authCtx.openRegister && <RegisterForm />}
        {!authCtx.isLoggedIn && !authCtx.openRegister && <LoginForm />}
        <Navbar />
        <BoardPage />
        <BottomNav/>
      </div>
    </Fragment>
  );
}

export default App;
