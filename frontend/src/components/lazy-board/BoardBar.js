import { useContext  } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsFillStarFill, BsStar} from "react-icons/bs";
import { Menu } from "@mantine/core";
import { Avatar, AvatarsGroup } from "@mantine/core";
import { TrashIcon } from "@modulz/radix-icons";
import { MdModeEdit } from "react-icons/md";

import styles from "./BoardBar.module.css";
import { boardActions } from "../../store/board-slice";
import { boardsActions } from "../../store/boards-slice";
import AuthContext from "../../store/auth-context";
import { searchMembers,sendNotify } from "../../store/members-actions";
import MembersList from "./MembersList";
import useHttp from "../../hooks/use-http";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const BoardBar = () => {
  const axiosSecure = useAxiosSecure()
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const title = useSelector((state) => state.board.title);
  const boardId = useSelector((state) => state.board._id);
  console.log(boardId,"boardId")
  const isFavorite = useSelector((state) => state.board.isFavorite);
  const {ids:memberIds, members} = useSelector((state) => state.board.members);

  const {
    sendRequest: searchRequest,
    data: searchedMembersData,
    handleNotify: searchException,
    clearRequest:clearSearch,
  } = useHttp(searchMembers, []);

  const {
    sendRequest: inviteRequest,
    handleNotify
  } = useHttp(sendNotify)

  const { ids: searchedMemberIds } = searchedMembersData;

  const onSearchHandler = (event, search) => {
    event.preventDefault();
    if (search.trim() === "") {
      searchException("The id must not be empty");
      return;
    }
    if (search.length < 7) {
      searchException("Length of Id must be 7 characters");
      return;
    }

    if (authCtx._id.includes(search)){
      searchException("This id is already invited");
      return;
    }
let l=0;
    memberIds.forEach((id) => {
      if(id.includes(search)){
        searchException("This id is already invited");
        l=1
      }
    })
    if(l===1){return}
    searchRequest(search);

    if (!searchedMemberIds){
      searchException("The Id is not found!!")
    }
  };

  const onAddMembersHandler = (userId) => {

    let data = {senderId:authCtx._id,boardId, recipientId:userId}
    inviteRequest(data);
    handleNotify("The Request has been sent!!")
  }

  const toggleFavoritesHandler = async () => {
    dispatch(boardActions.toggleFavorites());
    dispatch(boardsActions.toggleFavorites({ id: boardId }));

    const user_id = authCtx._id;

    const data = {
      isFavourite: isFavorite,
    };
    try {
      await axiosSecure.put("/api/users/setfav/" + user_id + "/" + boardId,
        data
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBoardsHandler = () => {
    dispatch(boardsActions.deleteBoard(boardId));
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
        <MembersList button="members" members = {{ids:memberIds,
        members}}/>
        <div className={styles["nav-item"]}>
          <AvatarsGroup size="md" limit={4}>
            {memberIds.map((id) => {
              return (
                <Avatar key={id} radius="lg" color={members[id].color}>
                  {members[id].acronym}
                </Avatar>
              );
            })}
          </AvatarsGroup>
        </div>
      </div>
      <div className={styles["nav-right"]}>
        <MembersList button = "invite" onAdd = {onAddMembersHandler} onClose = {clearSearch} members = {searchedMembersData} onSearch = {onSearchHandler}/>
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
//930eadd
