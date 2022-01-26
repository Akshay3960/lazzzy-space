import { useState } from "react";
import BoardBar from "./BoardBar";
import Dashboard from "./Dashboard";
import styles from "./BoardPage.module.css";
import SideNav from "../side navbar/SideNav";

const BoardPage = () => {
  const DUMMY_WINDOWS = [
    {
      _id: Math.random(),
      title: "ron",
    },
    {
      _id: Math.random(),
      title: "akshay",
    },
    {
      _id: Math.random(),
      title: "anand",
    },
    {
      _id: Math.random(),
      title: "ananthan",
    },
  ];

  const [window, setWindow] = useState({
    _id: Math.random(),
    title: " Academic Tasks",
  });
  const selectWindowHandler = (windowIndex) => {
    setWindow(DUMMY_WINDOWS[windowIndex]);
  };

  return (
    <div className={styles["container"]}>
      <SideNav windows={DUMMY_WINDOWS} onSelect={selectWindowHandler} />
      <div className={styles["content"]}>
        <BoardBar title={window.title} />
        <Dashboard />
      </div>
    </div>
  );
};

export default BoardPage;
