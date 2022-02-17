import { useDispatch } from "react-redux";
import { IoTrashSharp } from "react-icons/io5";
import { Draggable } from "react-beautiful-dnd";

import { popCardFromGroup } from "../../store/board-actions";
import styles from "./TaskItem.module.css";

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
    <Draggable draggableId={props.id} index={props.taskIndex}>
      {(provided) => (
        <div className={` ${styles["card-container"]}`}
          ref = {provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles.header}>
            <label htmlFor="title">{props.title}</label>
            <button onClick={removeTaskHandler}>
              <IoTrashSharp />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
