import { Fragment,useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { store } from "react-notifications-component";
import { FaYoast } from "react-icons/fa";
import { BsBellFill, BsSearch } from "react-icons/bs";
import { Avatar, Menu, Divider } from "@mantine/core";
import { BsImageFill, BsPeopleFill } from "react-icons/bs";
import { ImUser, ImCross } from "react-icons/im";
import { FaPowerOff, FaCheck } from "react-icons/fa";


import styles from "./Navbar.module.css";
import AuthContext from "../../store/auth-context";
import { boardActions } from "../../store/board-slice";
import { boardsActions } from "../../store/boards-slice";
import DropModal from "../modals/DropModal";

const DUMMY_NOTES = [
  {
    _id: Math.random(),
    board: "Academic Tasks",
    invitee: "Ron Jacob",
    time: "8:45am",
  },
  {
    _id: Math.random(),
    board: "Distributed Systems",
    invitee: "Akshay Babu",
    time: "6:30pm",
  },
  {
    _id: Math.random(),
    board: "Computer Security",
    invitee: "Ananthanan",
    time: "12:00pm",
  },
];

const Navbar = (props) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const [notifications, setNotifications] = useState(DUMMY_NOTES);
  const [ openDropModal, setOpenDropModal ] = useState(false);
  const FILE_MIME_TYPE  = [
    "image/jpeg",
    "image/jpg",
    "image/png"
  ]

  const onLogoutHandler = () => {
    dispatch(boardActions.resetBoard());
    dispatch(boardsActions.resetBoards());
    authCtx.onLogout();
  };

  const onAcceptNotification = (id, board) => {
    store.addNotification({
      title: "Accepted",
      message: `You have joined ${board}`,
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate_animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });

    setNotifications((state) => state.filter((item) => item._id !== id));
  };

  const onRejectNotification = (id, board) => {
    store.addNotification({
      title: "Message Sent",
      message: `The request to join ${board} has been rejected`,
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate_animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
    setNotifications((state) => state.filter((item) => item._id !== id));
  };

  const notificationsList = notifications.map((item) => (
    <Menu.Item>
      <p>{item.time}</p>
      <header>{item.board}</header>
      <div
        className={styles["note-content"]}
      >{`${item.invitee} has invited you to join ${item.board}`}</div>
      <div className={styles["note-actions"]}>
        <button
          onClick={() => onAcceptNotification(item._id, item.board)}
          style={{ backgroundColor: "green" }}
        >
          <FaCheck />
        </button>
        <button
          onClick={() => onRejectNotification(item._id, item.board)}
          style={{ backgroundColor: "red" }}
        >
          <ImCross />
        </button>
      </div>
    </Menu.Item>
  ));

  return (
    <Fragment>
    {openDropModal && (
      <DropModal
        files = {FILE_MIME_TYPE}
        text = "Attach an image, must be below 20mb"
        isOpen = {openDropModal}
        isClose = {() => setOpenDropModal(false)}
      />
    )}
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
        <Menu
          size="lg"
          classNames={{ body: styles["note-menu"], item: styles["note-item"] }}
          control={
            <div className={`${styles.item} ${styles.notify}`}>
              <BsBellFill />
              <div>{notifications.length}</div>
            </div>
          }
        >
          {notifications.length === 0 && (
            <Menu.Item>
              <p className = {styles["no-notifications"]}>No notifications found</p>
            </Menu.Item>
          )}
          {notificationsList}
        </Menu>
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
          <Menu.Item onClick = {() => setOpenDropModal(true)} icon={<BsImageFill />}>Insert image</Menu.Item>
          <Menu.Item icon={<ImUser />}>Edit Profile</Menu.Item>
          <Menu.Item icon={<BsPeopleFill />}>Friends</Menu.Item>
          <Menu.Item onClick={onLogoutHandler} icon={<FaPowerOff />}>
            Logout
          </Menu.Item>
        </Menu>
        <div className={styles.spacer}></div>
      </div>
    </div>

    </Fragment>
  );
};

export default Navbar;
