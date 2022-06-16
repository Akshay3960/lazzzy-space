import { createSlice } from "@reduxjs/toolkit";

const membersSlice = createSlice({
  name: "members",
  initialState: {
    members:{}
  },
  reducers: {
    getMembers(state, action) {
      const members = action.payload;
      state.members = members;
    },
    addMembers(state, action) {
      const member = action.payload;
      state.members.push(member);
    },
    removeMember(state, action) {
      const id = action.payload;
      state.members = state.members.filter((item) => item._id !== id);
    },
  },
});


export const membersActions = membersSlice.actions;

export default membersSlice;