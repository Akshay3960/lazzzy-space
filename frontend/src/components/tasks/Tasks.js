import { useState, useRef } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { IoTrashSharp } from "react-icons/io5";
import { store } from "react-notifications-component";

import DropdownMenu from "../UI/DropdownMenu";
import styles from "./Tasks.module.css";
import TaskItem from "./TaskItem";
import axios from "axios";

const Tasks = (props) => {
  const [toAddTask, setToAddTask] = useState(false);
  const taskInputRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const isEditList = [
    { title: "Edit List", icon: <MdModeEdit />, onClick: () => {} },
    {
      title: "Delete List",
      icon: <IoTrashSharp />,
      onClick: () => {
        props.onDelete(props.id);
      },
    },
  ];

  const deleteCardHandler = (ord,tasksId,taskId) =>{
    props.onDeleteCard(tasksId).cardList.splice(ord.taskIndex,1)
    
  }

  const taskList = props.tasks.map((task, taskIndex) => (
    <TaskItem
      key={task._id}
      tasksIndex={props.tasksIndex}
      taskIndex={taskIndex}
      tasksId = {props.id}
      id={task._id}
      title={task.cardname}
      isDrag={props.isDrag}
      onDragStart={props.onDragStart}
      onDragging={props.onDragging}
      onDragEnter={props.onDragEnter}
      onDelete={deleteCardHandler}
    />
  ));

  const addTaskHandler = async () => {
    if (taskInputRef.current.value.trim() === "") {
      store.addNotification({
        title: "Error",
        message: "The title of the card cannot be empty",
        type: "danger",
        insert: "top",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate_animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      return;
    }
    props.tasks.push({ cardname: taskInputRef.current.value, description: "" });
    //update list with data cardname, description, list id.
    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const data = {
      cardList: {
        cardname: taskInputRef.current.value,
        description: "",
      },
    };

    try {
      const Res = await axios.put(BACKEND_URL + "api/list/" + props?.id, data);
      console.log(Res.data);
    } catch (e) {
      console.log(e);
    }
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
          <button type = "submit" onClick={addTaskHandler}> Save </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles["tasks-container"]}>
      <header>
        <h3>{props.title}</h3>
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
          props.isDrag && !props.tasks.length
            ? (e) => {
                return props.onDragEnter(e, {
                  tasksIndex: props.tasksIndex,
                  taskIndex: 0,
                });
              }
            : null
        }
      >
        <div></div>
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
