import axios from "axios";
import { store } from "react-notifications-component";
import { boardActions } from "./board-slice";

export const fetchBoardData = () => {
  return async (dispatch) => {
    const API_FETCH = async () => {
      const BACKEND_URL = process.env.REACT_APP_API_URL;
      const response = await axios.get(BACKEND_URL + "api/list/get_list");
      return response.data;
    };

    try {
      const boardData = await API_FETCH();
      dispatch(
        boardActions.replaceBoard({
          _id: "",
          title: "Academic Tasks",
          members: [],
          groups: boardData,
        })
      );
    } catch (error) {
      store.addNotification({
        title: "Error",
        message: "Failed to the data",
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
    }
  };
};

export const pushGroupToBoard = (name, id) => {
  if (name.trim() === "") {
    store.addNotification({
      title: "Error",
      message: "The title of the list cannot be empty",
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
    return;
  }
  return async (dispatch) => {
    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const data = {
      listname: name,
      cardList: [],
    };
    try {
      await axios.post(BACKEND_URL + "api/list/create_list", data);
    } catch (e) {
      console.log(e);
    }
    dispatch(
      boardActions.addGroupToBoard({
        _id: Math.random(),
        listname: name,
        cardList: [],
      })
    );
  };
};

export const pushCardToGroup = (id, name, description) => {
  if (name === "") {
    store.addNotification({
      title: "Error",
      message: "The title of the card cannot be empty",
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
    return;
  }
  return async (dispatch) => {
    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const data = {
      cardList: {
        cardname: name,
        description: description,
      },
    };

    try {
      const Res = await axios.put(BACKEND_URL + "api/list/" + id, data);
      console.log(Res.data);
    } catch (e) {
      console.log(e);
    }
    dispatch(
      boardActions.addCardToGroup({
        groupId: id,
        item: { cardname: name, description: description },
      })
    );
  };
};
