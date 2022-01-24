import { IoTrashSharp } from "react-icons/io5";

import styles from "./TaskItem.module.css";
const TaskItem = (props) => {
  return (
    <li>
      <div className={styles.header}>
        <label htmlFor="title">{props.title}</label>
        <button onClick={() => props.onDelete(props.id)}>
          {" "}
          <IoTrashSharp />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
