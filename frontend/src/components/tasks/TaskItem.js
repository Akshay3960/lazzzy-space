import { useState } from 'react';
import { useDispatch } from "react-redux";
import { IoTrashSharp } from "react-icons/io5";
import { Draggable } from "react-beautiful-dnd";

import { popCardFromGroup } from "../../store/board-actions";
import styles from "./TaskItem.module.css";
import TaskModal from '../modals/TaskModal';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const TaskItem = (props) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenHandler = () => setIsOpen(true);
  const onCloseHandler = () => setIsOpen(false);
  const axiosSecure = useAxiosSecure()

  const removeTaskHandler = async(event) => {
    event.stopPropagation();
    let popCardRes = await axiosSecure.delete(
      "api/list/delete_card/"+ props.tasksId+"/"+props.id
    );
    dispatch(
      popCardFromGroup({
        groupId: props.tasksId,
        cardId: props.id,
        popCardRes: popCardRes
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
            <button onClick={(e) => removeTaskHandler(e)}>
              <IoTrashSharp />
            </button>
          </div>
          {isOpen && <TaskModal id = {props.id} onClose = {onCloseHandler} opened = {isOpen} title = {props.title} description = {props.description}/>}
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
