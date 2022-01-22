import React, { useState } from "react";

const AuthContext = React.createContext({
  name: "",
  email: "",
  password: "",
  openRegister: false,
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (name,email, password) => {},
  onOpenRegister: () => {},
  onCloseRegister: () => {},
});

export const AuthContextProvider = (props) => {
  const [openRegister, setOpenRegister] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enteredName, setIsEnteredName] = useState('');
  const [enteredEmail, setIsEnteredEmail] = useState('');
  const [enteredPassword, setIsEnteredPassword] = useState('');

  const onOpenRegisterHandler = () => {
    setOpenRegister(true);
  }

  const onCloseRegisterHandler = () => {
    setOpenRegister(false);
  }

 

  const logoutHandler = () => {
      setIsLoggedIn(false);
      setIsEnteredName('');
      setIsEnteredEmail('');
      setIsEnteredPassword('');
  }

  const loginHandler = (name,email,password) => {
      setIsLoggedIn(true);
      setIsEnteredName(name);
      setIsEnteredEmail(email);
      setIsEnteredPassword(password);
  }

  return (
      <AuthContext.Provider value = {{
        name: enteredName,
        email: enteredEmail,
        openRegister: openRegister,
        password:enteredPassword,
        isLoggedIn: isLoggedIn,
        onLogOut: logoutHandler,
        onLogin: loginHandler,
        onOpenRegister:onOpenRegisterHandler,
        onCloseRegister:onCloseRegisterHandler,
      }}>
        {props.children}
      </AuthContext.Provider>
  );
};
export default AuthContext;
