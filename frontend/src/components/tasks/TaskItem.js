
import styles from './TaskItem.module.css';
const TaskItem = (props) => {
  return (
    <li>
      <div className={styles.header}>
        <label htmlFor="title">{props.title}</label>
        {/* adding an icon here */}
      </div>

    </li>
  );
};

export default TaskItem;
