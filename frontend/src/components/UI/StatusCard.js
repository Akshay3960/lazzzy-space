import styles from "./StatusCard.module.css";
const StatusCard = (props) => {
  return (
    <section className={`${styles[props.action.type]} ${styles.container}`}>
      <i class="fas fa-info-circle"></i>
      <h2>{props.action.message}</h2>
      <div>
        <i class="fas fa-times" onClick={props.onCloseModal}></i>
      </div>
    </section>
  );
};

export default StatusCard;
