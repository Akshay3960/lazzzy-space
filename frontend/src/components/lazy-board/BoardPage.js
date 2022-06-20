import BoardBar from "./BoardBar";
import Dashboard from "./Dashboard";
import styles from "./BoardPage.module.css";

const BoardPage = () => {
  return (
    <div className={styles["container"]}>
      <div className={styles["content"]}>
          <Dashboard />
      </div>
        <BoardBar />
    </div>
  );
};

export default BoardPage;
