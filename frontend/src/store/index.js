import { configureStore } from "@reduxjs/toolkit";

import boardSlice from "./board-slice";
import boardsSlice from "./boards-slice";
import membersSlice from "./members-slice";

const store = configureStore({
  reducer: {
    board: boardSlice.reducer,
    boards: boardsSlice.reducer,
    members: membersSlice.reducer,
  },
});

export default store;
