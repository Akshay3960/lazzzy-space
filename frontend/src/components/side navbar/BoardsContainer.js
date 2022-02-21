import { useSelector, useDispatch } from "react-redux";
import { Grid, Button, ScrollArea } from "@mantine/core";

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
  }

  return (
    <div className={styles.module}>
      <header>
        <div>{props.title}</div>
        <Button classNames={{ root: styles["add-button"] }} variant="default">
          <p>Add Workspace</p>
        </Button>
      </header>
      <ScrollArea>
        <div className={styles["nav-container"]}>
          <Grid>
            {boardIds.map((item, itemIndex) => (
              <Grid.Col key={item} span={4}>
                <NavItem
                  onClick = {selectBoardHandler.bind(null,item)}
                  title={boards[item].title}
                  onDelete={deleteBoardHandler.bind(null, item)}
                />
              </Grid.Col>
            ))}
          </Grid>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BoardsContainer;
