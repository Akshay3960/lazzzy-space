import { useContext } from "react";
import { useDispatch } from "react-redux";
import { FaYoast } from "react-icons/fa";
import { BsBellFill, BsSearch } from "react-icons/bs";
import { Avatar, Menu, Divider } from "@mantine/core";
import { BsImageFill, BsPeopleFill } from "react-icons/bs";
import { ImUser } from "react-icons/im";
import { FaPowerOff } from "react-icons/fa";

import styles from "./Navbar.module.css";
import AuthContext from "../../store/auth-context";
import { boardActions } from '../../store/board-slice';
import { boardsActions } from '../../store/boards-slice';

const Navbar = (props) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);

  const onLogoutHandler = () => {
    dispatch(boardActions.resetBoard());
    dispatch(boardsActions.resetBoards());
    authCtx.onLogout();
  };

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
        <Menu
          size="sm"
          classNames={{ body: styles.editmenu, itemHovered: styles.menu }}
          control={
            <div className={styles.user}>
              <Avatar color={authCtx.color} size="40px" radius="xl">
                {authCtx.nameAcronym}
              </Avatar>
            </div>
          }
        >
          <Menu.Label>Profile Options</Menu.Label>
          <Divider />
          <Menu.Item icon={<BsImageFill />}>Insert image</Menu.Item>
          <Menu.Item icon={<ImUser />}>Edit Profile</Menu.Item>
          <Menu.Item icon={<BsPeopleFill />}>Friends</Menu.Item>
          <Menu.Item onClick={onLogoutHandler} icon={<FaPowerOff />}>
            Logout
          </Menu.Item>
        </Menu>
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
};

export default Navbar;
