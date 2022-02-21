import { AvatarsGroup, Avatar } from "@mantine/core";
import { IoTrashSharp } from "react-icons/io5";

import styles from "./NavItem.module.css";

const NavItem = (props) => {
  return (
    <div className={styles.container} onClick = {props.onClick}>
      <header>
        {props.title}
        <button onClick = {props.onDelete} className={styles["button"]}>
          <IoTrashSharp />
        </button>
      </header>
      <div>
        <p>Members:</p>
        <AvatarsGroup classNames={{"root":styles["avatar"]}} size="1.5rem" limit={2}>
          <Avatar size="s" color="red">
            RJ
          </Avatar>
          <Avatar size="s" color="cyan">
            AP
          </Avatar>
          <Avatar size="s" color="blue">
            KN
          </Avatar>
          <Avatar size="s" color="orange">
            AR
          </Avatar>
        </AvatarsGroup>
      </div>
      <Avatar size = "1.8rem" classNames = {{"root": styles["owner"]}}>RJ</Avatar>
    </div>
  );
};

export default NavItem;
