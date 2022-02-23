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
  const [openModal, setOpenModal] = useState(false);
  const boardInputRef = useRef();

  let ids = useSelector((state) => state.boards[props.boardIds]);
  const [boardIds, setBoardIds] = useState(ids);

  const deleteBoardHandler = (id) => {
    dispatch(boardsActions.deleteBoard(id));
  };

  const selectBoardHandler = (id) => {
    dispatch(boardActions.replaceBoard(boards[id]));
    props.onClose();
  };

  const submitBoardHandler = async (event) => {
    event.preventDefault();

    if (boardInputRef.current.value.trim() === "") return;

    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const user_id = authCtx._id;
    let Res;
    const data = {
      title: boardInputRef.current.value,
    };
    try {
      Res = await axios.post(
        BACKEND_URL + "api/boards/create_board/" + user_id,
        data
      );

      dispatch(
        boardsActions.addBoard({
          id: Res.data._id,
          title: Res.data.title,
          isFavorite: false,
          members: Res.data.members,
          groups: Res.data.groups,
        })
      );
    } catch (err) {
      console.error(err);
    }

    setOpenModal(false);
  };

  const onSearchHandler = (event) => {
    const value = event.target.value.toLowerCase();
    setBoardIds(
      ids.filter((item) => boards[item].title.toLowerCase().includes(value))
    );
  };

  return (
    <div className={styles.module}>
      <Modal
        styles={{ title: { fontWeight: "bold" } }}
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Workspace"
      >
        <form onSubmit={submitBoardHandler}>
          <div className={styles["form-control"]}>
            <label>Enter Name of Workspace:</label>
            <input
              type="input"
              id="board"
              ref={boardInputRef}
              placeholder="Add new Workspace"
            />
          </div>
          <div className={styles["form-actions"]}>
            <Button type="submit" size="xs" variant="default">
              Save
            </Button>
            <Button
              onClick={() => setOpenModal(false)}
              size="xs"
              variant="default"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      <header>
        <div>{props.title}</div>
        {!props.isFavorite && (
          <Button
            onClick={() => setOpenModal(true)}
            classNames={{ root: styles["add-button"] }}
            variant="default"
          >
            <p>Add Workspace</p>
          </Button>
        )}
        <div className={styles.search}>
          <FaSearch className={styles["search-icon"]} />
          <input
            type="search"
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
                  onClick={selectBoardHandler.bind(null, item)}
                  title={boards[item].title}
                  onDelete={deleteBoardHandler.bind(null, item)}
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
