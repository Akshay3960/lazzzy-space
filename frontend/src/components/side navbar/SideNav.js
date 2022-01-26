import { useState } from "react";
import { MdSend } from "react-icons/md";
import { RiArrowRightSFill } from "react-icons/ri";
import { BsDot } from "react-icons/bs";
import { IconContext } from "react-icons";

import styles from "./SideNav.module.css";

const SideNav = ({ windows, onSelect }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const openSideBarHandler = () => setIsSideBarOpen(true);
  const closeSideBarHandler = () => setIsSideBarOpen(false);
  const windowsManager = windows.map((item, itemIndex) => {
    return (
      <div
        className={styles["item"]}
        key={item._id}
        onClick={() => {
          onSelect(itemIndex);
          closeSideBarHandler();
        }}
      >
        <BsDot />
        {item.title}
      </div>
    );
  });
  return (
    <div
      className={`${styles["container"]} ${
        isSideBarOpen ? styles["show-content"] : ""
      }`}
    >
      {!isSideBarOpen && (
        <div className={styles["button"]} onClick={openSideBarHandler}>
          <MdSend />
        </div>
      )}
      {isSideBarOpen && (
        <div className={styles["button"]} onClick={closeSideBarHandler}>
          <MdSend />
        </div>
      )}
      {isSideBarOpen && (
        <IconContext.Provider
          value={{ size: "1.3em", className: styles.icons }}
        >
          <div className={styles["content"]}>
            <div className={styles["content-header"]}>
              <label>Ron Jacob Varghese</label>
              <div className={styles["profile"]}></div>
            </div>
            <div className={styles["header"]}>
              <header>
                <RiArrowRightSFill />
                Favorites
              </header>
            </div>
            <div className={styles["header"]}>
              <header>
                <RiArrowRightSFill />
                Others
              </header>
            </div>
            <div className={styles["others-content"]}>{windowsManager}</div>
          </div>
        </IconContext.Provider>
      )}
    </div>
  );
};

export default SideNav;
