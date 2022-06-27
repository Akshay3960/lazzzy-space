import { Fragment, useState, useRef, useContext } from "react";
import { useDispatch } from "react-redux";
import {
  Modal,
  Button,
  Avatar,
  Badge,
  ScrollArea,
} from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import { MdAdd } from "react-icons/md";

import styles from "./BoardsModal.module.css";
import { createBoard } from "../../store/board-actions";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import { searchMembers } from "../../store/members-actions";
import useAxiosSecure from "../../hooks/useAxiosSecure";

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

const BoardsModal = () => {
  const dispatch = useDispatch();
  const boardInputRef = useRef();
  const searchMemberIdRef = useRef();
  const authCtx = useContext(AuthContext);
  const axiosSecure = useAxiosSecure()

  const adminUser = {
    _id: authCtx._id,
    acronym: authCtx.nameAcronym,
    color: authCtx.color,
    username: authCtx.name,
    status: "owner",
    statusColor: "violet",
  };

  const [openModal, setOpenModal] = useState(false);
  const [toAddMembers, setToAddMembers] = useState(false);

  const [invitedMembers, setInvitedMembers] = useState({
    ids:[adminUser._id],
    members: {
      [adminUser._id]:adminUser
    },
  });

  const {
    sendRequest: searchRequest,
    data: searchedMembersData,
    clearRequest:clearSearch,
    handleNotify: searchException,
  } = useHttp(searchMembers,{});

  const { ids: searchedMembersIds, members: searchedMembers} = searchedMembersData;

  const onSearchHandler = () => {
    let enteredSearch = searchMemberIdRef.current.value;

    if (enteredSearch.trim().length === 0) {
      return;
    }

    if (enteredSearch.length < 7) {
      searchException("Enter 7 characters of Id");
      return;
    }

    

    searchRequest(enteredSearch, invitedMembers);

    if (searchedMembers.length === 0) {
      searchException("The User Id does not exist");
      return;
    }
  };

  const onAddMembersHandler = (member) => {
    const invitedMember = {
      ...member,
      status: "sent",
      statusColor: "yellow",
    };

    console.log(member, invitedMember)


    setInvitedMembers((state) => {
      return {
        ids: [...state.ids, invitedMember._id],
        members: {
          ...state.members,
          [invitedMember._id]: invitedMember,
        },
      };
    });
  };

  const submitBoardHandler = async (event) => {
    event.preventDefault();

    let boardTitle = boardInputRef.current.value;

    if (boardTitle.trim() === "") return;
    invitedMembers.ids.shift();
    let boardRes = await axiosSecure.post("api/boards/create_board/" + adminUser._id,{
      title: boardTitle,
      ruserIds: invitedMembers.ids
    })
    dispatch(createBoard(boardRes))
    setOpenModal(false);
  };

  const memberElement = (item) => {
    return (
      <div className={styles.member} key={item._id}>
        <div className={styles["member-name-container"]}>
          <Avatar size="md" color={item.color}>
            {item.acronym}
          </Avatar>
          <div className={styles["member-name"]}>
            <p>{item.username}</p>
            <label>id: {item._id}</label>
          </div>
        </div>
        <div className={styles["member-status"]}>
          <Badge color={item.statusColor} variant="outline">
            {item.status}
          </Badge>
        </div>
      </div>
    );
  };

  const searchMembersList =
    searchedMembersIds &&
    searchedMembersIds.map((id) => {
      if (invitedMembers.ids.includes(id)) {
        return memberElement(invitedMembers["members"][id]);
      }
      
      if(id === adminUser._id){
        return memberElement(adminUser)
      }
      return (
        <div className={styles.member} key={id}>
          <div className={styles["member-name-container"]}>
            <Avatar size="md" color={searchedMembers[id].color}>
              {searchedMembers[id].acronym}
            </Avatar>
            <div className={styles["member-name"]}>
              {searchedMembers[id].username}
              <label>id: {id.slice(17)}</label>
            </div>
          </div>
          <div className={styles["member-status"]}>
            <button onClick={onAddMembersHandler.bind(null, searchedMembers[id])}>
              <MdAdd />
            </button>
          </div>
        </div>
      );
    });

  const membersList =  invitedMembers["ids"].map((id) => {
    let item = invitedMembers["members"][id];
    return memberElement(item);
  });

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
          setToAddMembers(false);
          clearSearch();
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
                    ref={searchMemberIdRef}
                    placeholder="Search Members using id(upto 7 characters)"
                  />
                  <Button
                    classNames={{ root: styles["search-button"] }}
                    onClick={onSearchHandler}
                  >
                    Search
                  </Button>
                  <div className={styles["divider"]} />
                </div>
                <div className={styles["search-members-container"]}>
                  {searchMembersList}
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
                setToAddMembers(false);
                clearSearch();
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
//930eadd