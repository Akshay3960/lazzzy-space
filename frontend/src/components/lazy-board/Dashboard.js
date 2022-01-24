import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { store } from "react-notifications-component";

import styles from "./Dashboard.module.css";
import Tasks from "../tasks/Tasks";

const Dashboard = () => {
  const taskListInputRef = useRef();
  const [enterTaskList, setEnterTaskList] = useState(false);

  const [taskList, setTaskList] = useState([]);

  //Fetch the list, Card data
  useEffect(() => {
    let Res;
    const API_FETCH = async () => {
      const BACKEND_URL = process.env.REACT_APP_API_URL;

      try {
        Res = await axios.get(BACKEND_URL + "api/list/get_list");
        console.log(Res.data);
      } catch (e) {
        console.log(e);
        return;
      }
      const loadedTasks = [...Res.data];
      setTaskList(loadedTasks);
    };
    API_FETCH();
  }, []);

  const openAddTaskListHandler = () => {
    setEnterTaskList(true);
  };
  const closeAddTaskListHandler = () => {
    setEnterTaskList(false);
  };

  const addTaskListHandler = async () => {
    if (taskListInputRef.current.value.trim() === "") {
      store.addNotification({
        title: "Error",
        message: "The title of the list cannot be empty",
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
    setTaskList((prevState) => {
      return [
        ...prevState,
        {
          _id: Math.random(),
          listname: taskListInputRef.current.value,
          cardList: [],
        },
      ];
    });

    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const data = {
      listname: taskListInputRef.current.value,
      cardList: [],
    };

    try {
      await axios.post(BACKEND_URL + "api/list/create_list", data);
    } catch (e) {
      console.log(e);

      return false;
    }

    setEnterTaskList(false);
  };

  const deleteTaskListHandler = (id) => {
    console.log(id);
    setTaskList((state) => state.filter((taskList) => taskList._id !== id));
  };

  const dashboard = taskList.map((item) => (
    <Tasks
      key={item._id}
      id={item._id}
      onDelete={deleteTaskListHandler}
      title={item.listname}
      tasks={item.cardList}
    />
  ));

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
