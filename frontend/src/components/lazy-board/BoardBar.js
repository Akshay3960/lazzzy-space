import { useState, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsFillStarFill, BsStar, BsSearch } from "react-icons/bs";
import { Menu, Divider } from "@mantine/core";
import { Avatar, AvatarsGroup } from "@mantine/core";
import { TrashIcon } from "@modulz/radix-icons";
import { MdModeEdit } from "react-icons/md";

import styles from "./BoardBar.module.css";
import { boardActions } from "../../store/board-slice";
import { boardsActions } from "../../store/boards-slice";
import AuthContext from "../../store/auth-context";
import useSearch from "../../hooks/use-search";
import axios from "axios";

const filterFun = () => {};

const BoardBar = (props) => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const title = useSelector((state) => state.board.title);
  const boardId = useSelector((state) => state.board._id);
  const isFavorite = useSelector((state) => state.board.isFavorite);
  let membersList = useSelector((state) => state.board.members);

  const [openMembers, setOpenMembers] = useState(false);

  const {
    initialLoad,
    isLoading,
    items: boardMembers,
    searchItems: searchBoardMembers,
    searchItemsRef: searchBoardMembersRef,
    onLoadRestart,
    submitItem: submitBoardMember,
    addItems: addMembers,
    onDeleteItems: onDeleteMembersHandler,
  } = useSearch(membersList, filterFun);

  const submitSearchMemberHandler = () => {};

  const toggleFavoritesHandler = async () => {
    dispatch(boardActions.toggleFavorites());
    dispatch(boardsActions.toggleFavorites({ id: boardId }));

    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const user_id = authCtx._id;

    const data = {
      isFavourite: isFavorite,
    };
    try {
      await axios.put(
        BACKEND_URL + "api/users/setfav/" + user_id + "/" + boardId,
        data
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBoardsHandler = () => {
    dispatch(boardsActions.deleteBoard(boardId));
  };

  const memberList = () => {
    boardMembers.map((member) => <Menu.Item key={member._id}></Menu.Item>);
  };

  return (
    <div className={styles["nav-container"]}>
      <div className={styles["nav-left"]}>
        <div className={styles["nav-item"]}>
          <h2> {title} </h2>
        </div>
        <div className={styles["nav-item"]}>
          <button onClick={toggleFavoritesHandler}>
            {isFavorite ? (
              <BsFillStarFill className={`${styles.favorites}`} />
            ) : (
              <BsStar className={`${styles.favorites}`} />
            )}
          </button>
        </div>
        <div className={styles["nav-item"]}>
          <Menu
            closeOnItemClick={false}
            control={
              <button onClick={() => setOpenMembers(true)}> members </button>
            }
            size="lg"
          >
            <Menu.Label>Add Members:</Menu.Label>
            <Menu.Item icon={<BsSearch />}>
              <input
                type="search"
                onSubmit={submitSearchMemberHandler}
                ref={searchBoardMembersRef}
                className={styles["members-search"]}
                placeholder="Enter the id"
              />
            </Menu.Item>
            <Divider />
          </Menu>
        </div>
        <div className={styles["nav-item"]}>
          <AvatarsGroup size="md" limit={4}>
            {membersList.map((member) => {
              return (
                <Avatar key={member._id} radius="lg" color={member.color}>
                  {member.acronym}
                </Avatar>
              );
            })}
          </AvatarsGroup>
        </div>
      </div>
      <div className={styles["nav-right"]}>
        <div className={styles["nav-item"]}>
          <button> Invite </button>
        </div>
        <Menu
          classNames={{ itemHovered: styles.menu }}
          control={
            <div className={styles["nav-item"]}>
              <button> Settings </button>
            </div>
          }
        >
          <Menu.Label>Board Options</Menu.Label>
          <Menu.Item icon={<MdModeEdit />}>Edit Title</Menu.Item>
          <Menu.Item
            onClick={deleteBoardsHandler}
            color="red"
            icon={<TrashIcon />}
          >
            Delete Board
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default BoardBar;
