import { Fragment } from "react";

import styles from "./Card.module.css";

const Backdrop = (props) => {
  return <div className={`${styles.backdrop} ${props.className}`} />;
};

const Card = (props) => {
  return (
    <Fragment>
      <Backdrop className = {props.backdrop}/>
      <div className={` ${styles.card} ${props.className}`}>
        {props.children}
      </div>
    </Fragment>
  );
};

export default Card;
