import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea, Menu, Divider } from "@mantine/core";
import { Droppable } from "react-beautiful-dnd";
import { RiEditBoxLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { TrashIcon } from "@modulz/radix-icons";

import { popGroupFromBoard, pushCardToGroup } from "../../store/board-actions";
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

  const taskList = group.cardList.map((task, taskIndex) => (
    <TaskItem
      key={task._id}
      description={task.description}
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
        <Menu
          classNames = {{"body": styles.editmenu, "itemHovered": styles.menu}}
          size = "sm"
          control={
            <button>
              <RiEditBoxLine />
            </button>
          }
        >
          <Menu.Label>Options</Menu.Label>
          <Menu.Item icon={<MdModeEdit />}>Edit List</Menu.Item>
          <Menu.Item onClick = {() => deleteTaskListHandler(props.id)} icon={<TrashIcon />}>Delete list</Menu.Item>
        </Menu>
      </header>
      <ScrollArea style={{ maxHeight: 300, marginBottom: 10 }}>
        <div style={{ width: 250, maxHeight: 300 }}>
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
