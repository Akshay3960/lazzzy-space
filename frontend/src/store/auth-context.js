import React, { useState, useReducer } from "react";

const AuthContext = React.createContext({
  _id: "",
  name: "",
  nameAcronym: "",
  email: "",
  color: "",
  profileImage: "",
  accessToken: "",
  openRegister: false,
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (name, email, password) => {},
  onOpenRegister: () => {},
  onCloseRegister: () => {},
  filterNotifications: (notifyId) => {},
  setToken:(accessToken) => {}
});

const defaultUserState = {
  isLoggedIn: false,
  _id: "",
  name: "",
  email: "",
  color: "",
  profileImage: "",
  accessToken: "",
  notifications: [],
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
      accessToken: action.accessToken,
      notifications: action.notifications,
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
      accessToken: "",
      notifications: [],
    };
  }

  if(action.type==="TOKEN") {
    return {
      ...state,
      accessToken: action.accessToken
    };
  }

  if (action.type === "SEND_ACK") {
    let notifications = state.notifications.filter(
      (item) => item._id !== action.notifyId
    );
    return {
      ...state,
      notifications,
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

  const loginHandler = (_id, name, email, color, notifications, accessToken) => {

    dispatchUserAction({
      type: "LOG_IN",
      _id,
      name,
      email,
      notifications,
      color,
      accessToken
    });
  };

  const filterNotifications = (notifyId) => {
    dispatchUserAction({
      type: "SEND_ACK",
      notifyId,
    });
  };

  const setAccessToken = (accessToken) => {
    dispatchUserAction({
      type: "TOKEN",
      accessToken,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        _id: userState._id,
        name: userState.name,
        nameAcronym: userState.nameAcronym,
        email: userState.email,
        color: userState.color,
        notifications: userState.notifications,
        profileImage: userState.profileImage,
        accessToken:userState.accessToken,
        isLoggedIn: userState.isLoggedIn,
        openRegister: openRegister,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        onOpenRegister: onOpenRegisterHandler,
        onCloseRegister: onCloseRegisterHandler,
        filterNotifications,
        setToken: setAccessToken
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
