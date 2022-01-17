import { useState, useRef } from "react";

import Card from "../UI/Card";
import styles from "./Tasks.module.css";
import TaskItem from "./TaskItem";

const Tasks = (props) => {
  const [toAddTask, setToAddTask] = useState(false);
  const taskInputRef = useRef();

  
  const taskList = props.tasks.map((task) => (
    <TaskItem key={Math.random()} title={task} />
  ));

  const addTaskHandler = () => {
    props.tasks.push(taskInputRef.current.value);
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
    <Card className={styles["tasks-container"]}>
      <header>
        <h3>{props.title}</h3>
      </header>
      <ul>
        {taskList}
        {toAddTask && <AddTaskForm />}
      </ul>
      <footer>
        {!toAddTask && <button onClick={toEnterTaskHandler}>Add a card</button>}
      </footer>
    </Card>
  );
};

export default Tasks;
