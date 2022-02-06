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
      isFavorite: true,
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
  const [windowList, setWindowList] = useState(DUMMY_WINDOWS);

  const selectWindowHandler = (windowIndex) => {
    dispatch(boardActions.replaceBoard(windowList[windowIndex]));
  };

  const onAddWindowHandler = (title) => {
    console.log("onAddWIndowHere");
    setWindowList((state) => {
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

  return (
    <div className={styles["container"]}>
      <SideNav
        onAdd={onAddWindowHandler}
        windows={windowList}
        onSelect={selectWindowHandler}
      />
      <div className={styles["content"]}>
        <BoardBar />
        <Dashboard />
      </div>
    </div>
  );
};

export default BoardPage;
