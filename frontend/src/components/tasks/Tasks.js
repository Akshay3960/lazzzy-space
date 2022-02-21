import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "@mantine/core";
import { Droppable } from "react-beautiful-dnd";
import { RiEditBoxLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { IoTrashSharp } from "react-icons/io5";

import { popGroupFromBoard, pushCardToGroup } from "../../store/board-actions";
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
  const boardId = useSelector((state) => state.board._id);

  const deleteTaskListHandler = (tasksId) => {
    dispatch(popGroupFromBoard(tasksId, boardId));
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

  const taskList = group.cardList.map((task, taskIndex) => (
    <TaskItem
      key={task._id}
      description = {task.description}
      tasksIndex={props.tasksIndex}
      taskIndex={taskIndex}
      tasksId={props.id}
      id={task._id}
      title={task.cardname}
    />
  ));

  const addTaskHandler = () => {
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
      <ScrollArea style={{ maxHeight: 300, marginBottom:10}}>
        <div style = {{ width: 255, maxHeight: 300}}>
          <Droppable droppableId={props.id}>
            {(provided) => (
              <div
                className={styles["groups"]}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {taskList}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </ScrollArea>
      <footer>
        {toAddTask && <AddTaskForm />}
        {!toAddTask && <button onClick={toEnterTaskHandler}>Add a card</button>}
      </footer>
    </div>
  );
};

export default Tasks;
