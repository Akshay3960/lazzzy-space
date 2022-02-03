import axios from "axios";
import { IconContext } from "react-icons";
import { FaYoast } from "react-icons/fa";
import { BsBellFill, BsSearch } from "react-icons/bs";

import styles from "./Navbar.module.css";

const Navbar = (props) => {
  const profile_fetch = async (e) => {
    const BACKEND_URL = process.env.REACT_APP_API_URL;
    try {
      const result = await axios.get(
        BACKEND_URL + "api/users/61f44ed57b14260d22290851"
      );
      console.log(result.data);
      let profile = new Promise(function (resolve) {
        resolve("http://localhost:5000/" + result.data);
      });
      document.getElementById("pic").src = await profile;
    } catch (err) {
      console.log(err);
    }
  };
  profile_fetch();
  return (
    <div className={styles.container}>
      <div className={styles.left}>
          <div className={styles.header}>
            LAZZ <FaYoast size= "2em" className={styles.icon} />
            SPACE
          </div>
      </div>
      <div className={styles.right}>
        <div className={styles.search}>
          <BsSearch color="white"/>
          <input placeholder="Search" />
        </div>
        <div className={styles.item}>
          <BsBellFill />
        </div>
        <div className={styles.user}>
          <div className={styles.profile}>
            <img id="pic" alt="demo-src" />
          </div>
        </div>
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
};

export default Navbar;
