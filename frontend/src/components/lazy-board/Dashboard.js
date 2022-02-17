import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";

import styles from "./Dashboard.module.css";
import Tasks from "../tasks/Tasks";
import { moveEnterGroup } from "../../store/board-actions";
import { fetchGroupData, pushGroupToBoard } from "../../store/board-actions";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [enterTaskList, setEnterTaskList] = useState(false);
  const taskList = useSelector((state) => state.board.groups);
  const boardId = useSelector((state) => state.board._id);
  const taskListInputRef = useRef();

  useEffect(() => {
    dispatch(fetchGroupData(boardId));
  }, [dispatch, boardId]);

  const openAddTaskListHandler = () => {
    setEnterTaskList(true);
  };
  const closeAddTaskListHandler = () => {
    setEnterTaskList(false);
  };

  const addTaskListHandler = async () => {
    dispatch(pushGroupToBoard(taskListInputRef.current.value, boardId));
    setEnterTaskList(false);
  };

  const onDragEndHandler = (result) => {
    dispatch(moveEnterGroup(result));
  }

  const dashboard = taskList.map((item, itemIndex) => {
    return <Tasks key={item._id} id={item._id} tasksIndex={itemIndex} />;
  });

  const EnterTaskListForm = () => {
    return (
      <div className={styles["form-content"]}>
        <div className={styles["form-control"]}>
          <label htmlFor="value">Enter Value:</label>
          <input type="text" id="title" ref={taskListInputRef} />
        </div>

        <div className={styles["form-actions"]}>
          <button type="button" onClick={closeAddTaskListHandler}>
            Close
          </button>
          <button onClick={addTaskListHandler}> Save </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles["dashboard"]}>
      <DragDropContext onDragEnd={onDragEndHandler}>
        {dashboard}
      </DragDropContext>
      {enterTaskList && <EnterTaskListForm />}
      {!enterTaskList && (
        <button
          className={styles["dash-button"]}
          onClick={openAddTaskListHandler}
        >
          Add another list
        </button>
      )}
    </div>
  );
};

export default Dashboard;
