// import axios from "axios";
import { store } from "react-notifications-component";
import { boardActions } from "./board-slice";
import { boardsActions } from "./boards-slice";

export const createBoard = (boardRes) => {
  return async (dispatch) => {
    // console.log(boardRes)
    try {
      if(boardRes?.data){
        dispatch(
          boardsActions.addBoard({
            id: boardRes.data._id,
            title: boardRes.data.title,
            isFavorite: false,
            members: {},
            groups: boardRes.data.groups,
          })
        );
      }else{
        throw new Error("error in fetching board data")
      }
      
    } catch(err) {
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

export const fetchGroupData = (boardData) => {
  return async (dispatch) => {
    // const LIST_FETCH = async () => {
    //   const BACKEND_URL = process.env.REACT_APP_API_URL;
    //   const response = await axios.get(
    //     BACKEND_URL + "api/list/get_list/" + boardId
    //   );
    //   return response.data;
    // };
    // console.log(boardData.data)
  try {
    if(boardData?.data){
      dispatch(boardActions.replaceGroupsData(boardData?.data));
    }else{
      throw new Error("error in fetching members")
    }
    } catch(err) {
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
export const fetchMemberData = (membersRes) => {
  return async (dispatch) => {
    // const MEMBER_FETCH = async () => {
    //   const BACKEND_URL = process.env.REACT_APP_API_URL;
    //   const response = await axios.post(
    //     BACKEND_URL + `api/boards/${boardId}/members`
    //   );
    //   return response.data;
    // };
    // console.log(membersRes)
    try {
      if(!membersRes?.data){
        throw new Error("error in fetching members")
      }
      const memberData = membersRes?.data;
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

export const pushGroupToBoard = (name, listRes) => {
  //TODO: Ron could make save button disabled without input as alt
  // if (name.trim() === "") {
  //   store.addNotification({
  //     title: "Error",
  //     message: "The title of the list cannot be empty",
  //     type: "danger",
  //     insert: "top",
  //     container: "bottom-right",
  //     animationIn: ["animate__animated", "animate__fadeIn"],
  //     animationOut: ["animate_animated", "animate__fadeOut"],
  //     dismiss: {
  //       duration: 5000,
  //       onScreen: true,
  //     },
  //   });
  //   return;
  // }
  return async (dispatch) => {
    // const BACKEND_URL = process.env.REACT_APP_API_URL;
    // const data = {
    //   listname: name,
    //   cardList: [],
    // };

    try {
      if(!listRes?.data){
        throw new Error("error in adding list")
      }
    } catch (e) {
      console.log(e.message);
    } 
    dispatch(
      boardActions.addGroupToBoard({
        _id: listRes.data.id,
        listname: name,
        cardList: [],
      })
    );
  };
};

export const popGroupFromBoard = (groupId,removeCardRes) => {
  return async (dispatch) => {
    // const BACKEND_URL = process.env.REACT_APP_API_URL;

    // let Res;
    // try {
    //   Res = await axios.delete(
    //     BACKEND_URL + "api/list/delete_list/" + groupId + "/" + boardId
    //   );
    //   console.log(Res.data);
    // } catch (err) {
    //   console.log(err);
    // }
    try {
      if(!removeCardRes?.data){
        throw new Error("error in removing list")
      }
    } catch (e) {
      console.log(e.message);
    } 
    dispatch(boardActions.removeGroupFromBoard(groupId));
  };
};

export const pushCardToGroup = (id, name,addCardRes, description) => {
  //TODO: Ron could make save button disabled without input as alt
  // if (name === "") {
  //   store.addNotification({
  //     title: "Error",
  //     message: "The title of the card cannot be empty",
  //     type: "danger",
  //     insert: "top",
  //     container: "bottom-right",
  //     animationIn: ["animate__animated", "animate__fadeIn"],
  //     animationOut: ["animate_animated", "animate__fadeOut"],
  //     dismiss: {
  //       duration: 5000,
  //       onScreen: true,
  //     },
  //   });
  //   return;
  // }
  return async (dispatch) => {
    // const BACKEND_URL = process.env.REACT_APP_API_URL;
    // const data = {
    //   cardList: {
    //     cardname: name,
    //     description: description,
    //   },
    // };
    // let Res;
    try {
      if(!addCardRes?.data){
        throw new Error("error in adding card")
      }
    } catch (e) {
      console.log(e.message);
    } 
    dispatch(
      boardActions.addCardToGroup({
        groupId: id,
        item: { _id: addCardRes.data.id, cardname: name, description: description },
      })
    );
  };
};

export const popCardFromGroup = ({ groupId: lid, cardId: cid, popCardRes: Res }) => {
  return async (dispatch) => {
    // const BACKEND_URL = process.env.REACT_APP_API_URL;
    // let Res;
    // console.log(lid, cid);
    try {
      if(!Res?.data){
        throw new Error("error in popping card")
      }
    } catch (e) {
      console.log(e.message);
    }
    dispatch(
      boardActions.removeCardFromGroup({
        groupId: lid,
        cardId: cid,
      })
    );
  };
};

export const moveEnterGroup = ({ source, destination, draggableId }, moveCardRes) => {
  return async (dispatch) => {
    // const BACKEND_URL = process.env.REACT_APP_API_URL;

    // if (!destination) {
    //   return;
    // }

    // if (
    //   destination.droppableId === source.droppableId &&
    //   destination.index === source.index
    // ) {
    //   return;
    // }

    try {
      // await axios.post(
      //   BACKEND_URL +
      //     "api/list/" +
      //     source.droppableId +
      //     "/" +
      //     draggableId +
      //     "/" +
      //     destination.droppableId +
      //     "/" +
      //     destination.index
      // );
      if(!moveCardRes?.data){
        throw new Error("error in moveEnterGroup")
      }
    } catch (e) {
      console.log(e.message);
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
