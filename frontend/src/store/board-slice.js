import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",
  initialState: {
    _id: "",
    title: "Academic Tasks",
    members: [],
    groups: [
      {
        _id: Math.random(),
        listname: "Group 1",
        cardList: [
          {
            cardname: "1",
            description: "",
          },
          {
            cardname: "2",
            description: "",
          },
          {
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
            cardname: "1",
            description: "",
          },
          {
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
      state.groups = state.groups.filter((item) => item._id === id);
    },
    addCardToGroup(state, action) {
      const newCard = action.payload.item;
      const changedGroup = state.groups.find(
        (item) => item._id === action.payload.groupId
      ).cardList;
      changedGroup.push(newCard);
    },
    removeCardFromGroup(state, action) {
      console.log(state)
      const groupId = action.payload.groupId;
      const cardId = action.payload.cardId;
      let changedGroup = state.groups.find((item) => item.id === groupId).cardList;
      changedGroup = changedGroup.filter((item) => item.id !== cardId);

    },
    dragEnterGroup(state, action) {
      const dragItem = action.payload.dragItem;
      const targetItem = action.payload.targetItem;
      console.log("DragItem", dragItem, "targetItem", targetItem);
      console.log("groups:", state.groups);
      state.groups[targetItem.groupIndex].cardList.splice(
        targetItem.cardIndex,
        0,
        state.groups[dragItem.groupIndex].cardList.splice(dragItem.cardIndex, 1)[0]
      );
    },
  },
});

export const boardActions = boardSlice.actions;

export default boardSlice;
