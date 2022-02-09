import { useSelector, useDispatch } from "react-redux";
import { BsFillStarFill, BsStar } from "react-icons/bs";

import styles from "./BoardBar.module.css";
import { boardActions } from "../../store/board-slice";

const BoardBar = (props) => {
  const dispatch = useDispatch();
  const title = useSelector((state) => state.board.title);
  const isFavorite = useSelector((state) => state.board.isFavorite);
  console.log(isFavorite)

  const toggleFavoritesHandler = () => {
    dispatch(boardActions.toggleFavorites());
  }
  
  return (
    <div className={styles["nav-container"]}>
      <div className={styles["nav-left"]}>
        <div className={styles["nav-item"]}>
          <h2> {title} </h2>
        </div>
        <div className={styles["nav-item"]}>
          <button onClick = {toggleFavoritesHandler}>{isFavorite ? <BsFillStarFill className = {`${styles.favorites}`}/> : <BsStar className = {`${styles.favorites}`}/>}</button>
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
