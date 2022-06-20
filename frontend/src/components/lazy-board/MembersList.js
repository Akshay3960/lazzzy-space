import { Fragment,  useRef } from "react";
import { Divider, Avatar, Menu } from "@mantine/core";

import classes from "./MembersList.module.css";
import { BsSearch } from "react-icons/bs";

const MembersList = (props) => {
  const searchMembersRef = useRef();

  const { ids, members } = props.members;
  // console.log(members)
  // console.log(ids)

  const showMembers =
    ids &&
    ids.map((id) => {
      return (
        <Menu.Item onClick = {props.onAdd && props.onAdd.bind(null,id)} className={classes.member}>
          <div key={id} className={classes["member-content"]}>
            <Avatar size="sm" src={null} color={members[id].color}>
              {members[id].acronym}
            </Avatar>
            <p className={classes.username}>{members[id].username}</p>
          </div>
        </Menu.Item>
      );
    });
  return (
    <Fragment>
      <Menu
        classNames={{
          root: classes.dropdown,
          itemHovered: classes["menu-item"],
        }}
        closeOnItemClick={false}
        control={
          <button className={classes.link}>
            {" "}
            {props.button}{" "}
          </button>
        }
        onClose = {props.onClose}
        size="17rem"
      >
        <Menu.Item
          icon={<BsSearch size="1.2rem" />}
          className={classes["search-content"]}
        >
          <form
            onSubmit={(e) => props.onSearch(e, searchMembersRef.current.value)}
          >
            <input
              placeholder="Search Members"
              type="search"
              ref={searchMembersRef}
              className={classes.search}
            />
          </form>
        </Menu.Item>
        <Divider />
        {showMembers}
      </Menu>
    </Fragment>
  );
};

export default MembersList;
