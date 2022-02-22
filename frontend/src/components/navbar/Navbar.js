import { useContext } from "react";
import { FaYoast } from "react-icons/fa";
import { BsBellFill, BsSearch } from "react-icons/bs";
import { Avatar } from "@mantine/core";

import styles from "./Navbar.module.css";
import AuthContext from "../../store/auth-context";

const Navbar = (props) => {
  // 'dark' | 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'orange' |
  const authCtx = useContext(AuthContext);
  console.log(authCtx.color);


  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.header}>
          LAZZ <FaYoast size="2em" className={styles.icon} />
          SPACE
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.search}>
          <BsSearch color="white" />
          <input placeholder="Search" />
        </div>
        <div className={styles.item}>
          <BsBellFill />
        </div>
        <div className={styles.user}>
          <Avatar color={authCtx.color} size="40px" radius="xl">
            {authCtx.nameAcronym}
          </Avatar>
        </div>
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
};

export default Navbar;
