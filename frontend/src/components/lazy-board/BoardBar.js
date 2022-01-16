import styles from "./BoardBar.module.css";

const BoardBar = (props) => {
  return (
    <div className={styles["nav-container"]}>
      <div className={styles["nav-left"]}>
        <div className={styles["nav-item"]}>
          <h2> {props.title} </h2>
        </div>
        <div className={styles["nav-item"]}>
          <button> members </button>
        </div>
      </div>
      <div className={styles["nav-right"]}>
        <div className={styles["nav-item"]}>
          <button> filter </button>
        </div>
        <div className={styles["nav-item"]}>
          <button> Settings </button>
        </div>
      </div>
    </div>
  );
};

export default BoardBar;
