import React, { useState, useReducer } from "react";

const AuthContext = React.createContext({
  _id: "",
  name: "",
  nameAcronym: "",
  email: "",
  color: "",
  profileImage: "https://avatars.githubusercontent.com/u/68094522?s=88&v=4",
  openRegister: false,
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (name, email, password) => {},
  onOpenRegister: () => {},
  onCloseRegister: () => {},
});

const defaultUserState = {
  isLoggedIn: false,
  _id: "",
  name: "",
  email: "",
  color: "",
  profileImage: "https://avatars.githubusercontent.com/u/68094522?s=88&v=4",
};


const userReducer = (state, action) => {
  if (action.type === "LOG_IN") {
    return {
      isLoggedIn: true,
      _id: action._id,
      name: action.name,
      nameAcronym: action.name
        .toUpperCase()
        .match(/\b(\w)/g)
        .slice(0, 2),

      email: action.email,
      color: action.color,
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
      nameAcronym: "",
      email: "",
      color: "",
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

  const loginHandler = (_id, name, email, color) => {
    dispatchUserAction({
      type: "LOG_IN",
      _id,
      name,
      email,
      color,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        _id: userState._id,
        name: userState.name,
        nameAcronym: userState.nameAcronym,
        email: userState.email,
        color: userState.color,
        profileImage: userState.profileImage,
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
