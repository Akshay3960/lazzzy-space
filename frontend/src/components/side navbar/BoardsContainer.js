import { useRef, useContext  } from "react";
import { FaSearch } from "react-icons/fa";
import axios from 'axios';

import { useSelector, useDispatch } from "react-redux";
import { ScrollArea } from "@mantine/core";

import styles from "./BoardsContainer.module.css";
import { boardsActions } from "../../store/boards-slice";
import { boardActions } from "../../store/board-slice";
import authContext from "../../store/auth-context";
import NavItem from "./NavItem";




const BoardsContainer = (props) => {
  const dispatch = useDispatch();
  const authCtx = useContext(authContext);
  const boards = useSelector((state) => state.boards.boards);
  const searchInputRef = useRef();
  const boardIds = useSelector((state) => state.boards[props.boardIds]);

  const toggleFavoriteHandler = async (id, event) => {
    event.stopPropagation();

    const user_id = authCtx._id;
    
    try{
      const BACKEND_URL = process.env.REACT_APP_API_URL
      await axios.put(BACKEND_URL + `api/users/setfav/${user_id}/${id}`)
    }catch(err){
      console.log(err);
    }

    dispatch(boardsActions.toggleFavorites({ id }));

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
              <div key = {item} id="item-wrapper">
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
