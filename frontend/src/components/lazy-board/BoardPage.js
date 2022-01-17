import BoardBar from "./BoardBar";
import Dashboard from "./Dashboard";
import styles from "./BoardBar.module.css";

const BoardPage = () => {
  return (
    <div className={styles["board-container"]}>
      <BoardBar title="Academic Tasks" />
      <Dashboard />
    </div>
  );
};

export default BoardPage;
