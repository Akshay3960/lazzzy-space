import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiEditBoxLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { IoTrashSharp } from "react-icons/io5";

import { pushCardToGroup } from "../../store/board-actions";
import { boardActions } from "../../store/board-slice";
import DropdownMenu from "../UI/DropdownMenu";
import styles from "./Tasks.module.css";
import TaskItem from "./TaskItem";

const Tasks = (props) => {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.board.groups).find(
    (item) => item._id === props.id
  );
  const [toAddTask, setToAddTask] = useState(false);
  const taskInputRef = useRef();
  const [isEdit, setIsEdit] = useState(false);

  const deleteTaskListHandler = (tasksId) => {
    dispatch(boardActions.removeGroupFromBoard(tasksId));
  };

  const isEditList = [
    { title: "Edit List", icon: <MdModeEdit />, onClick: () => {} },
    {
      title: "Delete List",
      icon: <IoTrashSharp />,
      onClick: () => {
        deleteTaskListHandler(props.id);
      },
    },
  ];


  const removeTaskHandler = (taskId) => {
    console.log("124");
    dispatch(
      boardActions.removeCardFromGroup({
        groupId: props.id,
        cardId: taskId,
      })
    );
  };

  const taskList = group.cardList.map((task, taskIndex) => (
    <TaskItem
      key={task._id}
      tasksIndex={props.tasksIndex}
      taskIndex={taskIndex}
      tasksId={props.id}
      id={task._id}
      title={task.cardname}
      isDrag={props.isDrag}
      onDragStart={props.onDragStart}
      onDragging={props.onDragging}
      onDragEnter={props.onDragEnter}
      onRemove = {removeTaskHandler}
    />
  ));

  const addTaskHandler = () => {
    console.log("1212");
    dispatch(pushCardToGroup(props.id, taskInputRef.current.value, ""));
    setToAddTask(false);
  };

  const toEnterTaskHandler = () => {
    setToAddTask(true);
  };
  const closeAddTaskHandler = () => setToAddTask(false);

  const AddTaskForm = () => {
    return (
      <div>
        <div className={styles["form-control"]}>
          <label htmlFor="value">Enter Value:</label>
          <input type="text" id="title" ref={taskInputRef} />
        </div>

        <div className={styles["form-actions"]}>
          <button type="button" onClick={closeAddTaskHandler}>
            Close
          </button>
          <button type="submit" onClick={addTaskHandler}>
            {" "}
            Save{" "}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles["tasks-container"]}>
      <header>
        <h3>{group.listname}</h3>
        <button onClick={() => setIsEdit((state) => !state)}>
          <RiEditBoxLine />
        </button>
        {isEdit ? (
          <DropdownMenu className={styles["editmenu"]} items={isEditList} />
        ) : undefined}
      </header>
      <div
        className={styles["groups"]}
        onDragEnter={
          props.isDrag && !group.cardList.length
            ? (e) => {
                return props.onDragEnter(e, {
                  tasksIndex: props.tasksIndex,
                  taskIndex: 0,
                });
              }
            : null
        }
      >
        {taskList}
        {toAddTask && <AddTaskForm />}
      </div>
      <footer>
        {!toAddTask && <button onClick={toEnterTaskHandler}>Add a card</button>}
      </footer>
    </div>
  );
};

export default Tasks;
