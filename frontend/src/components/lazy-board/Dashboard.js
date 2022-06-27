import { useRef, useState, useEffect } from "react";
import { ScrollArea } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";

import styles from "./Dashboard.module.css";
import Tasks from "../tasks/Tasks";
import { moveEnterGroup } from "../../store/board-actions";
import { fetchGroupData, pushGroupToBoard, fetchMemberData } from "../../store/board-actions";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Dashboard = () => {
  const dispatch = useDispatch();
  const axiosSecure = useAxiosSecure()
  const [enterTaskList, setEnterTaskList] = useState(false);
  const taskList = useSelector((state) => state.board.groups);
  const boardId = useSelector((state) => state.board._id);
  const taskListInputRef = useRef();

  useEffect(() => {
    const groupFetch = async() => {
      let groupRes = await axiosSecure.get("api/list/get_list/" + boardId)
      return groupRes
    }
    const membersFetch = async() => {
      let membersRes = await axiosSecure.post(
        `api/boards/${boardId}/members`
      )
      return membersRes
    }
    const dataFetch = async() => {
    let groupRes = await groupFetch()
    dispatch(fetchGroupData(groupRes));
    let membersRes = await membersFetch()
    dispatch(fetchMemberData(membersRes))

    }
    dataFetch()
    
  }, [dispatch, boardId, axiosSecure]);

  const openAddTaskListHandler = () => {
    setEnterTaskList(true);
  };
  const closeAddTaskListHandler = () => {
    setEnterTaskList(false);
  };

  const addTaskListHandler = async () => {
    let listRes = await axiosSecure.post(
      "api/list/create_list/" + boardId,
      {
        listname: taskListInputRef.current.value,
        cardList: []
      }
    )
    dispatch(pushGroupToBoard(taskListInputRef.current.value, listRes));
    setEnterTaskList(false);
  };

  const onDragEndHandler = async(result) => {
    
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    let moveCardRes = await axiosSecure.post(
      "api/list/" +
          source.droppableId +
          "/" +
          draggableId +
          "/" +
          destination.droppableId +
          "/" +
          destination.index
    )
    dispatch(moveEnterGroup(result, moveCardRes));
  };

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
    <ScrollArea classNames={{ viewport: styles.scroll, scrollbar: styles.scrollbar}}>
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
    </ScrollArea>
  );
};

export default Dashboard;
