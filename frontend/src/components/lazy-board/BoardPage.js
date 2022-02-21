import { useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import BoardBar from "./BoardBar";
import Dashboard from "./Dashboard";
import styles from "./BoardPage.module.css";
import SideNav from "../side navbar/SideNav";
import { boardActions } from "../../store/board-slice";
import AuthContext from "../../store/auth-context";

export const DUMMY_WINDOWS = [
  {
    _id: Math.random(),
    title: " Academic Tasks",
    isFavorite: false,
    members: [],
    groups: [
      {
        _id: Math.random(),
        listname: "Group 1",
        cardList: [
          {
            _id: Math.random(),
            cardname: "1",
            description: "",
          },
          {
            _id: Math.random(),
            cardname: "2",
            description: "",
          },
          {
            _id: Math.random(),
            cardname: "3",
            description: "",
          },
        ],
      },
      {
        _id: Math.random(),
        listname: "Group 2",
        cardList: [
          {
            _id: Math.random(),
            cardname: "1",
            description: "",
          },
          {
            _id: Math.random(),
            cardname: "2",
            description: "",
          },
        ],
      },
    ],
  },
  {
    _id: Math.random(),
    title: "ron",
    isFavorite: false,
    members: [],
    groups: [],
  },
  {
    _id: Math.random(),
    title: "akshay",
    isFavorite: false,
    members: [],
    groups: [],
  },
  {
    _id: Math.random(),
    title: "anand",
    isFavorite: false,
    members: [],
    groups: [],
  },
  {
    _id: Math.random(),
    title: "ananthan",
    isFavorite: false,
    members: [],
    groups: [],
  },
];

const BoardPage = () => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const [favoriteWindows, setFavoriteWindows] = useState(
    DUMMY_WINDOWS.filter((item) => item.isFavorite)
  );
  const [otherWindows, setOtherWindows] = useState(
    DUMMY_WINDOWS.filter((item) => !item.isFavorite)
  );

  useEffect(() => {
    let Res;
    let windows = [];

    const API_FETCH = async () => {
      const BACKEND_URL = process.env.REACT_APP_API_URL;
      const user_id = authCtx._id;
      try {
        Res = await axios.get(BACKEND_URL + "api/boards/" + user_id);
        Res.data.forEach((item) => {
          return windows.push({
            _id: item.board._id,
            title: item.board.title,
            isFavorite: item.isFavourite,
            members: item.board.members,
            groups: item.board.lists,
          });
        });

        setFavoriteWindows(windows.filter((item) => item.isFavorite));
        setOtherWindows(
          windows.filter((item) => {
            return !item.isFavorite;
          })
        );
      } catch (err) {
        console.log(err);
      }
    };

    API_FETCH();
  }, [authCtx]);

  const selectFavoriteWindowHandler = (windowIndex) => {
    dispatch(boardActions.replaceBoard(favoriteWindows[windowIndex]));
  };

  const selectOtherWindowHandler = (windowIndex) => {
    dispatch(boardActions.replaceBoard(otherWindows[windowIndex]));
  };
  const onAddWindowHandler = async (title) => {
    console.log("onAddWIndowHere");

    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const user_id = authCtx._id;
    let Res;
    const data = {
      title: title,
    };
    try {
      Res = await axios.post(
        BACKEND_URL + "api/boards/create_board/" + user_id,
        data
      );
      setOtherWindows((state) => {
        console.log(state);
        return [
          ...state,
          {
            _id: Res.data._id,
            title: Res.data.title,
            isFavorite: false,
            members: Res.data.members,
            groups: Res.data.groups,
          },
        ];
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onAddFavoriteWindowHandler = (id) => {
    const favoriteWindow = otherWindows.find((item) => {
      return item._id === id;
    });
    setFavoriteWindows((state) => [...state, favoriteWindow]);
    setOtherWindows((state) => state.filter((item) => item._id !== id));
  };

  const onAddOtherWindowHandler = (id) => {
    const otherWindow = favoriteWindows.find((item) => item._id === id);
    setOtherWindows((state) => [...state, otherWindow]);
    setFavoriteWindows((state) => state.filter((item) => item._id !== id));
  };

  return (
    <div className={styles["container"]}>
      <SideNav
        onAdd={onAddWindowHandler}
        favoriteWindows={favoriteWindows}
        otherWindows={otherWindows}
        onSelectFavorite={selectFavoriteWindowHandler}
        onSelectOthers={selectOtherWindowHandler}
      />
      <div className={styles["content"]}>
        <BoardBar
          onFavorite={onAddFavoriteWindowHandler}
          onOthers={onAddOtherWindowHandler}
        />
        <Dashboard />
      </div>
    </div>
  );
};

export default BoardPage;
