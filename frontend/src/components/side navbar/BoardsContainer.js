import { useSelector, useDispatch } from "react-redux";
import { Button, ScrollArea } from "@mantine/core";

import styles from "./BoardsContainer.module.css";
import { boardsActions } from "../../store/boards-slice";
import { boardActions } from "../../store/board-slice";
import NavItem from "./NavItem";

const BoardsContainer = (props) => {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards);
  const boardIds = useSelector((state) => state.boards[props.boardIds]);

  const deleteBoardHandler = (id) => {
    dispatch(boardsActions.deleteBoard(id));
  };

  const selectBoardHandler = (id) => {
    dispatch(boardActions.replaceBoard(boards[id]));
    props.onClose();
  };

  return (
    <div className={styles.module}>
      <header>
        <div>{props.title}</div>
        <Button classNames={{ root: styles["add-button"] }} variant="default">
          <p>Add Workspace</p>
        </Button>
      </header>
      <div className={styles["nav-container"]}>
        <ScrollArea classNames={{ root: styles.scroll }}>
          <div className={styles["nav-grid"]}>
            {boardIds.map((item, itemIndex) => (
              <NavItem
                key={item}
                onClick={selectBoardHandler.bind(null, item)}
                title={boards[item].title}
                onDelete={deleteBoardHandler.bind(null, item)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BoardsContainer;
