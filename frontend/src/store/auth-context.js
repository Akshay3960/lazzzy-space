import React, { useState, useReducer } from "react";

const AuthContext = React.createContext({
  _id:"",
  name: "",
  email: "",
  profileImage: "",
  openRegister: false,
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (name, email, password) => {},
  onOpenRegister: () => {},
  onCloseRegister: () => {},
});

const defaultUserState = {
  isLoggedIn: true,
  _id:"",
  name: "",
  email: "",
  profileImage: "https://avatars.githubusercontent.com/u/68094522?s=88&v=4",
};

const userReducer = (state, action) => {
  if (action.type === "LOG_IN") {
    return {
      isLoggedIn: true,
      _id: action.id,
      name: action.name,
      email: action.email,
      profileImage: action.profileImage
        ? action.profileImage
        : state.profileImage,
    };
  }
  if (action.type === "LOG_OUT") {
    return {
      isLoggedIn: false,
      _id: "",
      name: "",
      email: "",
      profileImage: "",
    };
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

  const loginHandler = (_id, name, email) => {
    dispatchUserAction({
      type: "LOG_IN",
      _id,
      name,
      email,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        _id:userState._id,
        name: userState.name,
        email: userState.email,
        profileImage:userState.profileImage,
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
