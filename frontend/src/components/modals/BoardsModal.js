import { Fragment, useState, useRef, useContext } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button, Avatar, Badge, ScrollArea } from "@mantine/core";
import { IoCloseSharp } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import axios from "axios";

import styles from "./BoardsModal.module.css";
import { boardsActions } from "../../store/boards-slice";
import AuthContext from "../../store/auth-context";

const DUMMY_MEMBERS = [
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
  const searchMembersRef = useRef();
  const authCtx = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [addMembers, setAddMembers] = useState(false);
  const [members, setMembers] = useState(DUMMY_MEMBERS);
  
  const submitBoardHandler = async (event) => {
    event.preventDefault();
    
    if (boardInputRef.current.value.trim() === "") return;
    
    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const user_id = authCtx._id;
    let Res;
    const data = {
      title: boardInputRef.current.value,
    };
    
    console.log(user_id)
    try {
      Res = await axios.post(
        BACKEND_URL + "api/boards/create_board/" + user_id,
        data
        );
        
        console.log(Res.data)
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
      
      const submitMemberHandler = async () => {
        const BACKEND_URL = process.env.REACT_APP_API_URL;
        const user_id = searchMembersRef.current.value;
        const data = {
          uid: user_id,
        };

         try {
           const Res = await axios.post(BACKEND_URL + "api/users/find_user",data);
           console.log(Res.data);
         }catch(e){
           console.log(e)
         }
      }

      const onDeleteMembersHandler = (id) => {
        setMembers((state) => state.filter((item) => item._id !== id));
      };

  const membersList = members.map((item) => (
    <div className={styles.member}>
      <div className={styles["member-name-container"]}>
        <Avatar size="md" color={item.color}>
          {item.acronym}
        </Avatar>
        <div className={styles["member-name"]}>
          {item.name}
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
          setAddMembers(false);
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
            {!addMembers && (
              <Button
                onClick={() => setAddMembers(true)}
                classNames={{ root: styles["members-button"] }}
                variant="default"
              >
                Add Members
              </Button>
            )}
          </div>
          {addMembers && (
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
                  <Button classNames = {{ root: styles["search-button"]}} onClick = {submitMemberHandler}>Search</Button>
                </div>
                <div className={styles["divider"]} />
              </div>
            </div>
          )}
          <div className={styles["form-actions"]}>
            <Button type="submit" size="xs" variant="default">
              Save
            </Button>
            <Button
              onClick={() => {
                setAddMembers(false);
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
