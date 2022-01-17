import { useRef, useState } from "react";

import styles from "./Dashboard.module.css";
import Tasks from "../tasks/Tasks";

const Dashboard = () => {
  const taskListInputRef = useRef();
  const [enterTaskList, setEnterTaskList] = useState(false);

  const [taskList, setTaskList] = useState([
    {
      id: "t1",
      name: "Resources",
      tasks: ["Paper with Code", "Connected Paper", "Doc For PPL"],
    },
    {
      id: "t2",
      name: "Weekly Assignments",
      tasks: ["Doc for Computer Science", "doc For distributed system"],
    },
    {
      id: "t3",
      name: "Projects",
      tasks: ["Project A", "Project FU", "Project B"],
    },
    {
      id: "t4",
      name: "Exams",
      tasks: ["PPL exam", "distributed System", "Computer Security"],
    },
  ]);

  const dashboard = taskList.map((item) => (
    <Tasks key={item.id} id={item.id} title={item.name} tasks={item.tasks} />
  ));

  const openAddTaskListHandler = () => {
    setEnterTaskList(true);
  };
  const closeAddTaskListHandler = () => {
    setEnterTaskList(false);
  };

  const addTaskListHandler = () => {
    setTaskList((prevState) => {
      return [
        ...prevState,
        {
          id: Math.random(),
          name: taskListInputRef.current.value,
          tasks: [],
        },
      ];
    });
    setEnterTaskList(false);
  };

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
      {dashboard}
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
