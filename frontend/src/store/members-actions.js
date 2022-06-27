import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL;

export const searchMembers = async (memberId) => {
  let data = {
    uid: memberId,
  };
  let Res = await axios.post(BACKEND_URL + "api/users/find_user", data);
  if (Res.status !== 200) {
    throw new Error("Search Operation failed try again");
  }
  let members = {ids: [], members:{}}
  Res.data.forEach(member => {
    let memberData = {
      _id:member._id,
      username: member.username,
      color:member.color,
      acronym:member.username
      .toUpperCase()
      .match(/\b(\w)/g)
      .slice(0, 2),
      present:false,
    }
    members.ids.push(member._id)
    members.members[member._id] = memberData

  })
  return members;
};

export const addMembersOnCreate = async (adminId, memberIds) => {
  let data = {
    userIds: memberIds,
  };
  let Res = await axios.post(
    BACKEND_URL + "api/users/create_board" + adminId,
    data
  );

  if (Res.status !== 200) {
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

// export const removeMember = (memberId) => {
//   return (dispatch) => {
//     const API_FETCH = async () => {};
//   };
// };


export const sendNotify = async ({senderId, boardId, recipientId}) => {
  let Res = await axios.post(
      BACKEND_URL + `api/notify/sent_notify/${senderId}/${boardId}/${recipientId}`
  )

  if (Res.status !== 200){
    throw new Error("Failed to sent Notifications");
  }

  return Res.data
}

export const receiveNotify = async (id) => {
  let Res = await axios.get(
    BACKEND_URL + "api/notify/" + id
  );

  if (Res.status !== 200){
    throw new Error("Failed to grab Notifications")
  }

  return Res.data;
}

export const sendAcceptNotify= async ({adminId, boardId, senderId,notifyId}) => {
  const data = {
    bid:boardId,
    suid:senderId,
    decision:true,
    nid:notifyId,
  }
  console.log(boardId,senderId,adminId)
  let Res = await axios.post(
    BACKEND_URL + "api/notify/handle_notify/" + adminId, data
  )

  if (Res.status !== 200){
    throw new Error("Failed to send Acknowledgement")
  }

  return;
  
}

export const sendRejectNotify = async({adminId, boardId, senderId, notifyId}) => {

  const data = {
    bid:boardId,
    suid:senderId,
    decision:false,
    nid: notifyId,
  }
  console.log(data)
  let Res = await axios.post(
    BACKEND_URL + "api/notify/handle_notify/" + adminId, data
  )

  if (Res.status !== 200){
    throw new Error("Failed to send Acknowledgement")
  }

  return;

}