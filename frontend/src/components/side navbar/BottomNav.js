import { Fragment, useState, useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Drawer, Avatar, Modal, Button } from "@mantine/core";
import { MdDoubleArrow } from "react-icons/md";
import axios from "axios";

import styles from "./BottomNav.module.css";
import AuthContext from "../../store/auth-context";
import { boardsActions } from "../../store/boards-slice";
import BoardsContainer from "./BoardsContainer";

const BottomNav = (props) => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const boardInputRef = useRef();

  const closeDrawerHandler = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    let Res;
    let windows = [];

    const API_FETCH = async () => {
      const BACKEND_URL = process.env.REACT_APP_API_URL;
      const user_id = authCtx._id;
      try {
        Res = await axios.get(BACKEND_URL + "api/boards/" + user_id);
        Res.data.forEach((item) => {
          return windows.push({
            _id: item.board._id,
            title: item.board.title,
            isFavorite: item.isFavourite,
            members: item.board.members,
            groups: item.board.lists,
          });
        });

        dispatch(
          boardsActions.replaceBoards({ id: user_id, boards: Res.data })
        );
      } catch (err) {
        console.log(err);
      }
    };

    API_FETCH();
  }, [authCtx, dispatch]);

  const submitBoardHandler = async (event) => {
    event.preventDefault();

    if (boardInputRef.current.value.trim() === "") return;

    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const user_id = authCtx._id;
    let Res;
    const data = {
      title: boardInputRef.current.value,
    };
    try {
      Res = await axios.post(
        BACKEND_URL + "api/boards/create_board/" + user_id,
        data
      );

      dispatch(
        boardsActions.addBoard({
          id: Res.data._id,
          title: Res.data.title,
          isFavorite: false,
          members: Res.data.members,
          groups: Res.data.groups,
        })
      );
    } catch (err) {
      console.error(err);
    }

    setOpenModal(false);
  };

  return (
    <Fragment>
      <Drawer
        classNames={{ drawer: styles.drawer }}
        position="bottom"
        transitionDuration={500}
        transitionTimingFunction="ease"
        opened={openDrawer}
        onClose={() => setOpenDrawer(false)}
        size="xl"
        hideCloseButton
      >
        <div className={styles.header}>
          <Avatar
            color={authCtx.color}
            styles={{ root: { fontSize: "1.5rem" } }}
            size="3rem"
          >
            {authCtx.nameAcronym}
          </Avatar>
          <div className={styles.title}>
            <header>{authCtx.name}</header>
            <p style={{ fontSize: "0.8rem" }}>{`id:${authCtx._id.slice(
              17
            )}`}</p>
          </div>
          <Button
            onClick={() => setOpenModal(true)}
            classNames={{ root: styles["add-button"] }}
            variant="default"
          >
            <p>Add Workspace</p>
          </Button>
        </div>
        <div className={styles.lists}>
          <BoardsContainer
            onClose={closeDrawerHandler}
            title="Favorites"
            boardIds="favoriteBoards"
            isFavorite
          />
          <div className={styles.divider} />
          <BoardsContainer
            onClose={closeDrawerHandler}
            title="Others"
            boardIds="otherBoards"
          />
        </div>
      </Drawer>
      <div onClick={() => setOpenDrawer(true)} className={styles["bar"]}>
        <MdDoubleArrow className={styles["open-button"]} />
      </div>
      <Modal
        styles={{ title: { fontWeight: "bold" } }}
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Workspace"
      >
        <form onSubmit={submitBoardHandler}>
          <div className={styles["form-control"]}>
            <label>Enter Name of Workspace:</label>
            <input
              type="input"
              id="board"
              ref={boardInputRef}
              placeholder="Add new Workspace"
            />
          </div>
          <div className={styles["form-actions"]}>
            <Button type="submit" size="xs" variant="default">
              Save
            </Button>
            <Button
              onClick={() => setOpenModal(false)}
              size="xs"
              variant="default"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </Fragment>
  );
};
export default BottomNav;
