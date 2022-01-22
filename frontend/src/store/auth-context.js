import React, { useState, useReducer } from "react";

const AuthContext = React.createContext({
  name: "",
  email: "",
  password: "",
  openRegister: false,
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (name, email, password) => {},
  onOpenRegister: () => {},
  onCloseRegister: () => {},
});

const defaultUserState = {
  isLoggedIn: false,
  name: "",
  email: "",
  password: "",
};

const userReducer = (state, action) => {
  if (action.type === "LOG_IN") {
    return {
      isLoggedIn: true,
      name: action.name,
      email: action.email,
      password: action.password,
    };
  }
  if (action.type === "LOG_OUT") {
    return { isLoggedIn: false, name: "", email: "", password: "" };
  }

  return defaultUserState;
};

export const AuthContextProvider = (props) => {
  const [openRegister, setOpenRegister] = useState(false);

  const [userState, dispatchUserAction] = useReducer(
    userReducer,
    defaultUserState
  );

  const onOpenRegisterHandler = () => {
    setOpenRegister(true);
  };

  const onCloseRegisterHandler = () => {
    setOpenRegister(false);
  };

  const logoutHandler = () => {
    dispatchUserAction({
      type: "LOG_OUT",
    });
  };

  const loginHandler = (name, email, password) => {
    dispatchUserAction({
      type: "LOG_IN",
      name,
      email,
      password,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        name: userState.name,
        email: userState.email,
        password: userState.password,
        isLoggedIn: userState.isLoggedIn,
        openRegister: openRegister,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        onOpenRegister: onOpenRegisterHandler,
        onCloseRegister: onCloseRegisterHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
