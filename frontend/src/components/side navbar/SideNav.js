import { useState, useRef } from "react";
import { MdSend } from "react-icons/md";
import { RiArrowRightSFill } from "react-icons/ri";
import { BsDot } from "react-icons/bs";
import { IconContext } from "react-icons";

import styles from "./SideNav.module.css";

const SideNav = ({ onAdd, windows, onSelect }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const openSideBarHandler = () => setIsSideBarOpen(true);
  const closeSideBarHandler = () => setIsSideBarOpen(false);
  const windowInputRef = useRef();
  const [openFormHandler, setOpenFormHandler] = useState(false);

  const onOpenFormHandler = () => setOpenFormHandler(true);
  const onCloseFormHandler = () => setOpenFormHandler(false);

  const otherWindows = windows.filter((item) => !item.isFavorite);
  const favoriteWindows = windows.filter((item) => item.isFavorite);

  const favoriteWindowsManager = favoriteWindows.map((item, itemIndex) => {
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
  const otherWindowsManager = otherWindows.map((item, itemIndex) => {
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

  const EnterWindowForm = () => {
    return (
      <div className={styles["form-content"]}>
        <div className={styles["form-control"]}>
          <label htmlFor="value">Enter Value:</label>
          <input type="text" id="title" ref={windowInputRef} />
        </div>

        <div className={styles["form-actions"]}>
          <button type="button" onClick={onCloseFormHandler}>
            Close
          </button>
          <button onClick={() => onAdd(windowInputRef.current.value)}>
            {" "}
            Save{" "}
          </button>
        </div>
      </div>
    );
  };

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
            <div>{favoriteWindowsManager}</div>
            <div className={styles["header"]}>
              <header>
                <RiArrowRightSFill />
                Others
              </header>
            </div>
            <div>{otherWindowsManager}</div>
            {!openFormHandler && (
              <button
                className={styles["add-button"]}
                onClick={onOpenFormHandler}
              >
                {" "}
                Add new Workspace
              </button>
            )}
            {openFormHandler && <EnterWindowForm />}
          </div>
        </IconContext.Provider>
      )}
    </div>
  );
};

export default SideNav;
