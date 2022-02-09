import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",
  initialState: {
    _id: "",
    title: "Academic Tasks",
    isFavorite: false,
    members: [],
    groups: [
      {
        _id: Math.random(),
        listname: "Group 1",
        cardList: [
          {
            _id: Math.random(),
            cardname: "1",
            description: "",
          },
          {
            _id: Math.random(),
            cardname: "2",
            description: "",
          },
          {
            _id: Math.random(),
            cardname: "3",
            description: "",
          },
        ],
      },
      {
        _id: Math.random(),
        listname: "Group 2",
        cardList: [
          {
            _id: Math.random(),
            cardname: "1",
            description: "",
          },
          {
            _id: Math.random(),
            cardname: "2",
            description: "",
          },
        ],
      },
    ],
  },
  reducers: {
    replaceBoard(state, action) {
      state._id = action.payload._id;
      state.title = action.payload.title;
      state.members = action.payload.members;
      state.groups = action.payload.groups;
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
      const dragItem = action.payload.dragItem;
      const targetItem = action.payload.targetItem;
      console.log("DragItem", dragItem, "targetItem", targetItem);
      console.log("groups:", state.groups);
      state.groups[targetItem.groupIndex].cardList.splice(
        targetItem.cardIndex,
        0,
        state.groups[dragItem.groupIndex].cardList.splice(
          dragItem.cardIndex,
          1
        )[0]
      );
    },
    toggleFavorites(state) {
      state.isFavorite = !state.isFavorite;
    },
  },
});

export const boardActions = boardSlice.actions;

export default boardSlice;
