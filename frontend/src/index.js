import React from "react";
import { Provider } from "react-redux";
import ReactNotification from "react-notifications-component";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./store/auth-context";
import store from "./store/index";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
      <ReactNotification className = "notification-above" />

        <App />
      </AuthContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
