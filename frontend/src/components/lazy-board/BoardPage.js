import BoardBar from "./BoardBar";
import Dashboard from "./Dashboard";
import styles from "./BoardPage.module.css";

const BoardPage = () => {
  return (
    <div className={styles["container"]}>
      <div className={styles["content"]}>
        <BoardBar />
        <Dashboard />
      </div>
    </div>
  );
};

export default BoardPage;
