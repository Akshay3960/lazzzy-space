import { createSlice } from "@reduxjs/toolkit";

const boardsSlice = createSlice({
  name: "boards",
  initialState: {
    _id: "",
    boards: {},
    favoriteBoards: [],
    otherBoards: [],
  },
  reducers: {
    replaceBoards(state, action) {
      state._id = action.payload.id;
      action.payload.boards.forEach((board) => {
        state.boards = {
          ...state.boards,
          [board.board._id]: {
            _id: board.board._id,
            title: board.board.title,
            isFavorite: board.isFavourite,
            members: board.board.members,
          },
        };
      });
      state.favoriteBoards = Object.keys(state.boards).filter((key) => state.boards[key].isFavorite);
      state.otherBoards = Object.keys(state.boards).filter((key) => !state.boards[key].isFavorite);
    },
    addBoard(state, action) {
      state.boards = {
        ...state.boards,
        [action.payload.id]: {
          _id: action.payload.id,
          title: action.payload.title,
          isFavorite: action.payload.isFavorite,
          members: action.payload.members,
        },
      };
    },
    deleteBoard(state, action) {
      const id = action.payload;
      if(state.boards[`${id}`].isFavorite){
        state.favoriteBoards = state.favoriteBoards.filter((board) => board !== id);
      }else{
        state.otherBoards = state.otherBoards.filter((board) => board !== id);
      }

      delete state.boards[`${id}`];
    },
  },
});

export const boardsActions = boardsSlice.actions;
export default boardsSlice;
