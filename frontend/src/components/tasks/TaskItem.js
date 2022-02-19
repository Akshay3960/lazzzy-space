import { useState } from 'react';
import { useDispatch } from "react-redux";
import { IoTrashSharp } from "react-icons/io5";
import { Draggable } from "react-beautiful-dnd";

import { popCardFromGroup } from "../../store/board-actions";
import styles from "./TaskItem.module.css";
import TaskModal from './TaskModal';

const TaskItem = (props) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenHandler = () => setIsOpen(true);
  const onCloseHandler = () => setIsOpen(false);

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
          onClick = {onOpenHandler}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles.header}>
            <label htmlFor="title">{props.title}</label>
            <button onClick={removeTaskHandler}>
              <IoTrashSharp />
            </button>
          </div>
          {isOpen && <TaskModal onClose = {onCloseHandler} opened = {isOpen} title = {props.title} description = {props.description}/>}
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
