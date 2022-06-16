import axios from "axios";

import { membersActions } from "./members-slice";

const BACKEND_URL = process.env.REACT_APP_API_URL;

export const searchMembers = async (memberId, invitedMembers) => {
  let data = {
    uid: memberId,
  };
  let Res = await axios.post(BACKEND_URL + "api/users/find_user", data);
  if (Res.status != 200) {
    throw new Error("Search Operation failed try again");
  }

  console.log("search members here", Res.data);

  return Res.data;
};

export const addMembersOnCreate = async (adminId, memberIds) => {
  let data = {
    userIds: memberIds,
  };
  let Res = await axios.post(
    BACKEND_URL + "api/users/create_board" + adminId,
    data
  );

  if (Res.status != 200) {
    throw new Error("Failed to add member");
  }

  return Res.data;
};

export const addMembers = async (memberIds, boardId) => {
  let data = {
    userIds: memberIds,
  };
  let Res = await axios.post(
    BACKEND_URL + "api/users/add_users/" + boardId,
    data
  );

  if (Res.status !== 200) {
    throw new Error("Failed to add members to existing board");
  }

  return Res.data;
};

export const removeMember = (memberId) => {
  return (dispatch) => {
    const API_FETCH = async () => {};
  };
};
