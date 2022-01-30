import { useDispatch } from "react-redux";
import { IoTrashSharp } from "react-icons/io5";

import styles from "./TaskItem.module.css";
import { boardActions } from "../../store/board-slice";

const TaskItem = (props) => {
  const dispatch = useDispatch();

  return (
    <div
      className={`${
        props.isDrag
          ? styles[
              props.onDragging({
                tasksIndex: props.tasksIndex,
                taskIndex: props.taskIndex,
              })
            ]
          : ""
      } ${styles["card-container"]}`}
      draggable="true"
      onDragStart={(e) =>
        props.onDragStart(e, {
          tasksIndex: props.tasksIndex,
          taskIndex: props.taskIndex,
        })
      }
      onDragEnter={
        props.isDrag
          ? (e) =>
              props.onDragEnter(e, {
                tasksIndex: props.tasksIndex,
                taskIndex: props.taskIndex,
              })
          : undefined
      }
    >
      <div className={styles.header}>
        <label htmlFor="title">{props.title}</label>
        <button onClick={() => props.onRemove(props.id)}>
          <IoTrashSharp />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
