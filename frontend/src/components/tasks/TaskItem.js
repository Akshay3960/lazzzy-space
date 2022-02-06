import { useDispatch } from "react-redux";
import { IoTrashSharp } from "react-icons/io5";
import { popCardFromGroup } from "../../store/board-actions";
import styles from "./TaskItem.module.css";
import { boardActions } from "../../store/board-slice";

const TaskItem = (props) => {
  const dispatch = useDispatch();

  const removeTaskHandler = () => {
    dispatch(
      popCardFromGroup({
        groupId: props.tasksId,
        cardId: props.id,
      })
    );
  };

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
          tasksId: props.tasksId,
          tasksIndex: props.tasksIndex,
          taskId: props.id,
          taskIndex: props.taskIndex,
        })
      }
      onDragEnter={
        props.isDrag
          ? (e) =>
              props.onDragEnter(e, {
                tasksId: props.tasksId,
                tasksIndex: props.tasksIndex,
                taskId: props.id,
                taskIndex: props.taskIndex,
              })
          : undefined
      }
    >
      <div className={styles.header}>
        <label htmlFor="title">{props.title}</label>
        <button onClick={removeTaskHandler}>
          <IoTrashSharp />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
