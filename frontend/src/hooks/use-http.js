import { useReducer, useCallback } from "react";
import { store } from "react-notifications-component";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const httpReducer = (state, action) => {
  if (action.type === "SEND") {
    return {
      data: null,
      error: null,
      status: "pending",
    };
  }
  if (action.type === "SUCCESS") {
    return {
      data: action.responseData,
      error: null,
      status: "completed",
    };
  }
  if (action.type === "ERROR") {
    return {
      isLoading: false,
      data: null,
      error: action.error,
    };
  }
};

const useHttp = (requestFunction, startWithPending = false) => {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? "pending" : null,
    data: null,
    error: null,
  });


  const sendRequest = useCallback(async (requestData) => {
    dispatch({ type: "SEND" });
    try {
      const responseData = await requestFunction(requestData);
      dispatch({ type: "SUCCESS", responseData });
    } catch (error) {
      store.addNotification({
        title: "Error",
        className:"notification-above",
        message: error.message || "Something went wrong",
        type: "danger",
        insert: "top",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate_animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      dispatch({
        type:"ERROR",
        error: error.message || "Something went wrong",
        data: null,
      })

    }
  },[requestFunction]);

  const handleException = (exception) => {
    return store.addNotification({
      title: "Invalid Input",
      className:"notification-above",
      message: exception || "Something went wrong",
      type: "default",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate_animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  }

  return{
    sendRequest,
    handleException,
    ...httpState
  }
};


export default useHttp;