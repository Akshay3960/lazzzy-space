import { useState } from "react";
import { useDispatch } from "react-redux";

import BoardBar from "./BoardBar";
import Dashboard from "./Dashboard";
import styles from "./BoardPage.module.css";
import SideNav from "../side navbar/SideNav";
import { boardActions } from "../../store/board-slice";

const BoardPage = () => {
  const dispatch = useDispatch();
  const DUMMY_WINDOWS = [
    {
      _id: Math.random(),
      title: " Academic Tasks",
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
    {
      _id: Math.random(),
      title: "ron",
      isFavorite: false,
      members: [],
      groups: [],
    },
    {
      _id: Math.random(),
      title: "akshay",
      isFavorite: false,
      members: [],
      groups: [],
    },
    {
      _id: Math.random(),
      title: "anand",
      isFavorite: false,
      members: [],
      groups: [],
    },
    {
      _id: Math.random(),
      title: "ananthan",
      isFavorite: false,
      members: [],
      groups: [],
    },
  ];

  dispatch(boardActions.replaceBoard(DUMMY_WINDOWS[0]))
  const [favoriteWindows, setFavoriteWindows] = useState(
    DUMMY_WINDOWS.filter((item) => item.isFavorite)
  );
  const [otherWindows, setOtherWindows] = useState(
    DUMMY_WINDOWS.filter((item) => !item.isFavorite)
  );

  const selectFavoriteWindowHandler = (windowIndex) => {
    dispatch(
      boardActions.replaceBoard({
        ...favoriteWindows[windowIndex],
        isFavorite: true,
      })
    );
  };

  const selectOtherWindowHandler = (windowIndex) => {
    dispatch(boardActions.replaceBoard(otherWindows[windowIndex]));
  };

  const onAddWindowHandler = (title) => {
    console.log("onAddWIndowHere");

    setOtherWindows((state) => {
      console.log(state);
      return [
        ...state,
        {
          _id: Math.random(),
          title: title,
          isFavorite: false,
          members: [],
          groups: [],
        },
      ];
    });
  };

  const onAddFavoriteWindowHandler = (id) => {
    const favoriteWindow = otherWindows.find((item) => {
      console.log(item, id);
      return item._id === id;
    });
    console.log(favoriteWindow);
    setFavoriteWindows((state) => [...state, favoriteWindow]);
    setOtherWindows((state) => state.filter((item) => item._id !== id));
  };

  const onAddOtherWindowHandler = (id) => {
    const otherWindow = favoriteWindows.find((item) => item._id === id);
    setOtherWindows((state) => [...state, otherWindow]);
    setFavoriteWindows((state) => state.filter((item) => item._id !== id));
  };

  return (
    <div className={styles["container"]}>
      <SideNav
        onAdd={onAddWindowHandler}
        favoriteWindows={favoriteWindows}
        otherWindows={otherWindows}
        onSelectFavorite={selectFavoriteWindowHandler}
        onSelectOthers={selectOtherWindowHandler}
      />
      <div className={styles["content"]}>
        <BoardBar
          onFavorite={onAddFavoriteWindowHandler}
          onOthers={onAddOtherWindowHandler}
        />
        <Dashboard />
      </div>
    </div>
  );
};

export default BoardPage;
