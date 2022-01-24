import { useState, useRef } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { IoTrashSharp } from "react-icons/io5";
import { store } from "react-notifications-component";

import Card from "../UI/Card";
import DropdownMenu from "../UI/DropdownMenu";
import styles from "./Tasks.module.css";
import TaskItem from "./TaskItem";
import axios from "axios";

const Tasks = (props) => {
  const [toAddTask, setToAddTask] = useState(false);
  const taskInputRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [tasks, setTasks] = useState(props.tasks);

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

  const deleteCardHandler = (id) => {
    setTasks((state) => state.filter((task) => task._id !== id));
  };

  const taskList = tasks.map((task) => (
    <TaskItem
      key={task._id}
      id={task._id}
      onDelete={deleteCardHandler}
      title={task.cardname}
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
      return false;
    }
    setToAddTask(false);
  };

  const toEnterTaskHandler = () => {
    setToAddTask(true);
  };

  const closeAddTaskHandler = () => setToAddTask(false);

  const AddTaskForm = () => {
    return (
      <li>
        <div className={styles["form-control"]}>
          <label htmlFor="value">Enter Value:</label>
          <input type="text" id="title" ref={taskInputRef} />
        </div>

        <div className={styles["form-actions"]}>
          <button type="button" onClick={closeAddTaskHandler}>
            Close
          </button>
          <button onClick={addTaskHandler}> Save </button>
        </div>
      </li>
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
      <ul>
        {taskList}
        {toAddTask && <AddTaskForm />}
      </ul>
      <footer>
        {!toAddTask && <button onClick={toEnterTaskHandler}>Add a card</button>}
      </footer>
    </div>
  );
};

export default Tasks;
