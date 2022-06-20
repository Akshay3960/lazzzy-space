import axios from "axios";
import { store } from "react-notifications-component";
import { boardActions } from "./board-slice";
import { boardsActions } from "./boards-slice";

export const createBoard = (boardTitle, adminId, recipientIds) => {
  return async (dispatch) => {
    const API_FETCH = async () => {
      console.log(1);
      const BACKEND_URL = process.env.REACT_APP_API_URL;
      const data = {
        title: boardTitle,
        ruserIds: recipientIds,
      };
      const response = await axios.post(
        BACKEND_URL + "api/boards/create_board/" + adminId,
        data
      );

      console.log(response);

      return response;
    };

    try {
      const boardData = await API_FETCH();
      dispatch(
        boardsActions.addBoard({
          id: boardData.data._id,
          title: boardData.data.title,
          isFavorite: false,
          members: {},
          groups: boardData.data.groups,
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

export const fetchGroupData = (boardId) => {
  return async (dispatch) => {
    const LIST_FETCH = async () => {
      const BACKEND_URL = process.env.REACT_APP_API_URL;
      const response = await axios.get(
        BACKEND_URL + "api/list/get_list/" + boardId
      );
      return response.data;
    };

    try {
      const boardData = await LIST_FETCH();
      dispatch(boardActions.replaceGroupsData(boardData));
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
// Fetch member data for board(bid)
export const fetchMemberData = (boardId) => {
  return async (dispatch) => {
    const MEMBER_FETCH = async () => {
      const BACKEND_URL = process.env.REACT_APP_API_URL;
      const response = await axios.post(
        BACKEND_URL + `api/boards/${boardId}/members`
      );
      return response.data;
    };

    try {
      const memberData = await MEMBER_FETCH();
      let members = {
        ids: [],
        members: {},
      };
      memberData.forEach((member) => {
        console.log("member", member);
        members.ids.push(member.member._id);
        members.members[member.member._id] = {
          ...member.member,
          acronym: member.member.username
            .toUpperCase()
            .match(/\b(\w)/g)
            .slice(0, 2),
        };
      });
      dispatch(boardActions.replaceMembersData(members));
    } catch (error) {
      store.addNotification({
        title: "Error",
        message: "Failed to get members",
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

    let Res;
    try {
      Res = await axios.post(BACKEND_URL + "api/list/create_list/" + id, data);
    } catch (e) {
      console.log(e);
    }
    dispatch(
      boardActions.addGroupToBoard({
        _id: Res.data.id,
        listname: name,
        cardList: [],
      })
    );
  };
};

export const popGroupFromBoard = (groupId, boardId) => {
  return async (dispatch) => {
    const BACKEND_URL = process.env.REACT_APP_API_URL;

    let Res;
    try {
      Res = await axios.delete(
        BACKEND_URL + "api/list/delete_list/" + groupId + "/" + boardId
      );
      console.log(Res.data);
    } catch (err) {
      console.log(err);
    }
    dispatch(boardActions.removeGroupFromBoard(groupId));
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
    let Res;
    try {
      Res = await axios.put(BACKEND_URL + "api/list/" + id, data);
    } catch (e) {
      console.log(e);
    }
    dispatch(
      boardActions.addCardToGroup({
        groupId: id,
        item: { _id: Res.data.id, cardname: name, description: description },
      })
    );
  };
};

export const popCardFromGroup = ({ groupId: lid, cardId: cid }) => {
  return async (dispatch) => {
    const BACKEND_URL = process.env.REACT_APP_API_URL;
    let Res;
    console.log(lid, cid);
    try {
      Res = await axios.delete(
        BACKEND_URL + "api/list/delete_card/" + lid + "/" + cid
      );
      console.log(Res.data);
    } catch (err) {
      console.error(err);
    }
    dispatch(
      boardActions.removeCardFromGroup({
        groupId: lid,
        cardId: cid,
      })
    );
  };
};

export const moveEnterGroup = ({ source, destination, draggableId }) => {
  return async (dispatch) => {
    const BACKEND_URL = process.env.REACT_APP_API_URL;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      await axios.post(
        BACKEND_URL +
          "api/list/" +
          source.droppableId +
          "/" +
          draggableId +
          "/" +
          destination.droppableId +
          "/" +
          destination.index
      );
    } catch (e) {
      console.log("error in moveEnterGroup");
      console.log(e);
    }
    dispatch(
      boardActions.dragEnterGroup({
        source,
        destination,
        draggableId,
      })
    );
  };
};
