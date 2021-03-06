import { createSlice } from "@reduxjs/toolkit";

import { DUMMY_MEMBERS } from "../components/modals/BoardsModal";


const boardSlice = createSlice({
  name: "board",
  initialState: {
    _id: "",
    title: "",
    owner: "",
    isFavorite: false,
    members: {ids:[], members:{}},
    groups: [],
  },
  reducers: {
    replaceBoard(state, action) {
      state._id = action.payload._id;
      state.title = action.payload.title;
      state.owner = action.payload.owner;
      state.isFavorite = action.payload.isFavorite;
      // state.members = action.payload.members;
    },
    replaceGroupsData(state, action) {
      state.groups = action.payload;
    },
    replaceMembersData(state, action) {
      state.members = action.payload;
    },
    addGroupToBoard(state, action) {
      const group = action.payload;
      state.groups.push(group);
    },
    removeGroupFromBoard(state, action) {
      const id = action.payload;
      state.groups = state.groups.filter((item) => item._id !== id);
    },
    addCardToGroup(state, action) {
      const newCard = action.payload.item;
      const changedGroup = state.groups.find(
        (item) => item._id === action.payload.groupId
      ).cardList;
      changedGroup.push(newCard);
    },
    removeCardFromGroup(state, action) {
      const groupId = action.payload.groupId;
      const cardId = action.payload.cardId;
      const changedGroup = state.groups.find(
        (item) => item._id === groupId
      ).cardList;
      state.groups.find((item) => item._id === groupId).cardList =
        changedGroup.filter((item) => item._id !== cardId);
    },
    dragEnterGroup(state, action) {
      const source = action.payload.source;
      const destination = action.payload.destination;
      state.groups
        .find((item) => item._id === destination.droppableId)
        .cardList.splice(
          destination.index,
          0,
          state.groups
            .find((item) => item._id === source.droppableId)
            .cardList.splice(source.index, 1)[0]
        );
    },
    toggleFavorites(state) {
      state.isFavorite = !state.isFavorite;
    },
    resetBoard(state) {
      state._id = "";
      state.title = "";
      state.members = [];
      state.groups = [];
    },
  },
});

export const boardActions = boardSlice.actions;

export default boardSlice;
