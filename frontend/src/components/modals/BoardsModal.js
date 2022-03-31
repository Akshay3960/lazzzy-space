import { Fragment, useState, useRef, useContext } from "react";
import { useDispatch } from "react-redux";
import {
  Modal,
  Button,
  Avatar,
  Badge,
  ScrollArea,
  LoadingOverlay,
} from "@mantine/core";
import { IoCloseSharp } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import axios from "axios";

import styles from "./BoardsModal.module.css";
import { boardsActions } from "../../store/boards-slice";
import AuthContext from "../../store/auth-context";
import useSearch from "../../hooks/use-search";

export const DUMMY_MEMBERS = [
  {
    _id: Math.random(),
    acronym: "AN",
    color: "red",
    name: "Ananthan",
    status: "sent",
    statusColor: "yellow",
  },
  {
    _id: Math.random(),
    acronym: "RJ",
    color: "green",
    name: "Ron Jacob",
    status: "Failed",
    statusColor: "red",
  },
  {
    _id: Math.random(),
    acronym: "AP",
    color: "orange",
    name: "Ashish Prem",
    status: "Confirmed",
    statusColor: "teal",
  },
  {
    _id: Math.random(),
    acronym: "AB",
    color: "cyan",
    name: "Akshay Babu",
    status: "Confirmed",
    statusColor: "teal",
  },
  {
    _id: Math.random(),
    acronym: "AR",
    color: "blue",
    name: "Ananthakrishnan Rajeev",
    status: "sent",
    statusColor: "yellow",
  },
];

const filterFun = async (value) => {
  const BACKEND_URL = process.env.REACT_APP_API_URL;
  
  const data = {
    uid: value,
  };

  try {
    const Res = await axios.post(BACKEND_URL + "api/users/find_user", data);
    return Res.data;
  } catch (e) {
    console.log(e);
  }
}


const BoardsModal = () => {
  const dispatch = useDispatch();
  const boardInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const [openModal, setOpenModal] = useState(false);
  const [toAddMembers, setToAddMembers] = useState(false);

  const {
    initialLoad,
    isLoading,
    items: members,
    searchItems: searchMembers,
    searchItemsRef: searchMembersRef,
    onLoadRestart,
    submitItem: submitMember,
    addItems: addMembers,
    onDeleteItems: onDeleteMembersHandler,
  } = useSearch([{
    _id: authCtx._id,
    acronym: authCtx.nameAcronym,
    color: authCtx.color,
    name: authCtx.name,
    status: "owner",
    statusColor: "violet",
  },...DUMMY_MEMBERS],filterFun);

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

      console.log(members);
      dispatch(
        boardsActions.addBoard({
          id: Res.data._id,
          title: Res.data.title,
          isFavorite: false,
          members,
          groups: Res.data.groups,
        })
      );
    } catch (err) {
      console.error(err);
    }

    setOpenModal(false);
  };

  const searchMembersList = searchMembers.map((member) => {
    return (
      <div className={styles.member} key={member._id}>
        <div className={styles["member-name-container"]}>
          <Avatar size="md" color={member.color}>
            {member.username
              .toUpperCase()
              .match(/\b(\w)/g)
              .slice(0, 2)}
          </Avatar>
          <div className={styles["member-name"]}>
            {member.username}
            <label>id: {member._id.slice(17)}</label>
          </div>
        </div>
        <div className={styles["member-status"]}>
          <button onClick={addMembers.bind(null, member)}>
            <MdAdd />
          </button>
        </div>
      </div>
    );
  });

  const membersList = members.map((item) => (
    <div className={styles.member} key={item._id}>
      <div className={styles["member-name-container"]}>
        <Avatar size="md" color={item.color}>
          {item.acronym}
        </Avatar>
        <div className={styles["member-name"]}>
          <p>{item.name}</p>
          <label>id: {item._id}</label>
        </div>
      </div>
      <div className={styles["member-status"]}>
        <Badge color={item.statusColor} variant="outline">
          {item.status}
        </Badge>
        <button
          onClick={onDeleteMembersHandler.bind(null, item._id)}
          className={styles["remove-member"]}
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  ));

  return (
    <Fragment>
      <Button
        onClick={() => setOpenModal(true)}
        classNames={{ root: styles["add-button"] }}
        variant="default"
      >
        <p>Add Workspace</p>
      </Button>
      <Modal
        size="lg"
        styles={{ title: { fontWeight: "bold" } }}
        opened={openModal}
        onClose={() => {
          onLoadRestart();
          setToAddMembers(false);
          setOpenModal(false);
        }}
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
          <div className={styles["add-members"]}>
            {!toAddMembers && (
              <Button
                onClick={() => setToAddMembers(true)}
                classNames={{ root: styles["members-button"] }}
                variant="default"
              >
                Add Members
              </Button>
            )}
          </div>
          {toAddMembers && (
            <div className={styles["members"]}>
              <h3>Members: </h3>
              <ScrollArea classNames={{ root: styles.scroll }}>
                <div className={styles["members-container"]}>{membersList}</div>
              </ScrollArea>
              <div className={styles["divider"]} />
              <div className={styles["search-members"]}>
                <div className={styles["search-input"]}>
                  <FiSearch className={styles["search-icon"]} />
                  <input
                    type="search"
                    ref={searchMembersRef}
                    placeholder="Search Members using id"
                  />
                  <Button
                    classNames={{ root: styles["search-button"] }}
                    onClick={submitMember}
                  >
                    Search
                  </Button>
                  <div className={styles["divider"]} />
                </div>
                <div className={styles["search-members-container"]}>
                  <LoadingOverlay visible={isLoading} />
                  {!isLoading && searchMembers.length === 0 && initialLoad && (
                    <div className={styles["member-error"]}>No Users found</div>
                  )}
                  {!isLoading && searchMembers && searchMembersList}
                </div>
              </div>
            </div>
          )}
          <div className={styles["form-actions"]}>
            <Button type="submit" size="xs" variant="default">
              Save
            </Button>
            <Button
              onClick={() => {
                onLoadRestart();
                setToAddMembers(false);
                setOpenModal(false);
              }}
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

export default BoardsModal;
//be29875
