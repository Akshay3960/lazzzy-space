import { Fragment, useState, useRef, useReducer, useContext } from "react";
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
import useHttp from "../../hooks/use-http";
import { searchMembers, addMembersOnCreate } from "../../store/members-actions";

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

// const filterFun = async (value) => {
//   const BACKEND_URL = process.env.REACT_APP_API_URL;

//   const data = {
//     uid: value,
//   };

//   try {
//     const Res = await axios.post(BACKEND_URL + "api/users/find_user", data);
//     return Res.data;
//   } catch (e) {
//     console.log(e);
//   }
// };

const BoardsModal = () => {
  const dispatch = useDispatch();
  const boardInputRef = useRef();
  const searchMemberIdRef = useRef();
  const authCtx = useContext(AuthContext);

  const adminUser = {
    _id: authCtx._id,
    acronym: authCtx.nameAcronym,
    color: authCtx.color,
    name: authCtx.name,
    status: "owner",
    statusColor: "violet",
  };

  const [openModal, setOpenModal] = useState(false);
  const [toAddMembers, setToAddMembers] = useState(false);

  let temp = {};
  let tempIds = [];
  DUMMY_MEMBERS.forEach((item) => {
    tempIds.push(item._id);
    temp[item._id] = {
      ...item,
    };
  });

  const [invitedMembers, setInvitedMembers] = useState({
    ids: [adminUser._id, ...tempIds],
    members: {
      [adminUser._id]: adminUser,
      ...temp,
    },
  });

  const {
    sendRequest: searchRequest,
    data: searchMembersData,
    handleException: searchException,
  } = useHttp(searchMembers);

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

    if (searchMembersData.length === 0) {
      searchException("The User Id does not exist");
      return;
    }
  };

  const onAddMembersHandler = (member) => {
    const invitedMember = {
      _id: member._id,
      acronym: member.username
        .toUpperCase()
        .match(/\b(\w)/g)
        .slice(0, 2),
      color: member.color,
      name: member.username,
      status: "sent",
      statusColor: "yellow",
    };

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

      console.log(invitedMembers);
      dispatch(
        boardsActions.addBoard({
          id: Res.data._id,
          title: Res.data.title,
          isFavorite: false,
          members: {},
          groups: Res.data.groups,
        })
      );
    } catch (err) {
      console.error(err);
    }

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
            <p>{item.name}</p>
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
    searchMembersData &&
    searchMembersData.map((member) => {
      if (invitedMembers.ids.includes(member._id)) {
        return memberElement(invitedMembers["members"][member._id]);
      }
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
            <button onClick={onAddMembersHandler.bind(null, member)}>
              <MdAdd />
            </button>
          </div>
        </div>
      );
    });

  const membersList = invitedMembers["ids"].map((id) => {
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
