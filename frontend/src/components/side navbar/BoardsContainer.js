import { useState, useRef, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { Button, ScrollArea, Modal } from "@mantine/core";

import styles from "./BoardsContainer.module.css";
import { boardsActions } from "../../store/boards-slice";
import { boardActions } from "../../store/board-slice";
import NavItem from "./NavItem";
import AuthContext from "../../store/auth-context";

const BoardsContainer = (props) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const boards = useSelector((state) => state.boards.boards);
  const searchInputRef = useRef();
  const boardIds = useSelector((state) => state.boards[props.boardIds]);

  const toggleFavoriteHandler = async (id, event) => {
    event.stopPropagation();
    dispatch(boardsActions.toggleFavorites({ id }));

    // const BACKEND_URL = process.env.REACT_APP_API_URL;
    // const user_id = authCtx._id;

    // const data = {
    //   isFavourite: !props.isFavorite
    // }

    // try{
    //   await axios.put(
    //     BACKEND_URL +
    //     'api/users/setfav/' +
    //     user_id +
    //     '/' +
    //     id
    //     , data);

    // }
    // catch(err){
    //   console.log(err);
    // }
  };

  const selectBoardHandler = (id) => {
    dispatch(boardActions.replaceBoard(boards[id]));
    props.onClose();
  };

  const onSearchHandler = () => {
    dispatch(
      boardsActions.onSearchBoards({
        value: searchInputRef.current.value,
        isFavorite: props.isFavorite,
      })
    );
  };

  return (
    <div className={styles.module}>
      <header>
        <div>{props.title}</div>
        <div className={styles.search}>
          <FaSearch className={styles["search-icon"]} />
          <input
            type="search"
            ref={searchInputRef}
            onChange={onSearchHandler}
            placeholder="Search Workspace"
          />
        </div>
      </header>
      <div className={styles["nav-container"]}>
        <ScrollArea classNames={{ root: styles.scroll }}>
          <div className={styles["nav-grid"]}>
            {boardIds.map((item, itemIndex) => (
              <div id="item-wrapper">
                <NavItem
                  key={item}
                  isFavorite={props.isFavorite}
                  onClick={selectBoardHandler.bind(null, item)}
                  title={boards[item].title}
                  onFavorite={toggleFavoriteHandler.bind(null, item)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BoardsContainer;
