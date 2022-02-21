import { configureStore } from "@reduxjs/toolkit";

import boardSlice from "./board-slice";
import boardsSlice from "./boards-slice";

const store = configureStore({
  reducer: {
    board: boardSlice.reducer,
    boards: boardsSlice.reducer,
  },
});

export default store;
