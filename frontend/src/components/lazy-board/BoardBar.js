import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsFillStarFill, BsStar } from "react-icons/bs";
import { Menu, Divider } from "@mantine/core";
import { TrashIcon } from "@modulz/radix-icons";
import { MdModeEdit } from "react-icons/md";

import styles from "./BoardBar.module.css";
import { boardActions } from "../../store/board-slice";
import { boardsActions } from "../../store/boards-slice";
import AuthContext from "../../store/auth-context";
import axios from "axios";

const BoardBar = (props) => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const title = useSelector((state) => state.board.title);
  const boardId = useSelector((state) => state.board._id);
  const isFavorite = useSelector((state) => state.board.isFavorite);

  const toggleFavoritesHandler = async () => {
    dispatch(boardActions.toggleFavorites());
    dispatch(boardsActions.toggleFavorites({ id: boardId }));

    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const user_id = authCtx._id;

    const data = {
      isFavourite: isFavorite,
    };
    try {
      await axios.put(
        BACKEND_URL + "api/users/setfav/" + user_id + "/" + boardId,
        data
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBoardsHandler = () => {
    dispatch(boardsActions.deleteBoard(boardId));
  };

  return (
    <div className={styles["nav-container"]}>
      <div className={styles["nav-left"]}>
        <div className={styles["nav-item"]}>
          <h2> {title} </h2>
        </div>
        <div className={styles["nav-item"]}>
          <button onClick={toggleFavoritesHandler}>
            {isFavorite ? (
              <BsFillStarFill className={`${styles.favorites}`} />
            ) : (
              <BsStar className={`${styles.favorites}`} />
            )}
          </button>
        </div>
        <div className={styles["nav-item"]}>
          <button> members </button>
        </div>
      </div>
      <div className={styles["nav-right"]}>
        <div className={styles["nav-item"]}>
          <button> filter </button>
        </div>
        <Menu
          classNames={{ itemHovered: styles.menu }}
          control={
            <div className={styles["nav-item"]}>
              <button> Settings </button>
            </div>
          }
        >
          <Menu.Label>Board Options</Menu.Label>
          <Menu.Item icon={<MdModeEdit />}>Edit Title</Menu.Item>
          <Menu.Item
            onClick={deleteBoardsHandler}
            color="red"
            icon={<TrashIcon />}
          >
            Delete Board
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default BoardBar;
