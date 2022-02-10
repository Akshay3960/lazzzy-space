import { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import BoardBar from "./BoardBar";
import Dashboard from "./Dashboard";
import styles from "./BoardPage.module.css";
import SideNav from "../side navbar/SideNav";
import boardSlice, { boardActions } from "../../store/board-slice";
import AuthContext from '../../store/auth-context';
import { useEffect } from "react";

const BoardPage = () => {

  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  let windows = []
  const DUMMY_WINDOWS = [
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

  const [favoriteWindows, setFavoriteWindows] = useState(
    DUMMY_WINDOWS.filter((item) => item.isFavorite)
  );
  const [otherWindows, setOtherWindows] = useState(
    DUMMY_WINDOWS.filter((item) => !item.isFavorite)
  );

  useEffect(()=> {
    let Res;
    const API_FETCH = async() => {
      const BACKEND_URL = process.env.REACT_APP_API_URL;
      const user_id = authCtx._id;
      try{
        Res = await axios.get(BACKEND_URL+'api/boards/' + user_id);
        console.log("Here",Res.data);
        Res.data.map((board) => {
          let data = {
            _id: board.board._id,
            title: board.board.title,
            isFavorite: board.isFavourite,
            members: board.board.members,
            groups: board.board.lists,
            
          }
          windows.push(data)

        });
      }
      catch(err){
        console.log(err);
      }
    }
    API_FETCH();
    if (authCtx.isLoggedIn){
      console.log("windows",windows)
    }
    setFavoriteWindows(windows.filter((item) => item.isFavorite))
    setOtherWindows(windows.filter((item) => !item.isFavorite))
    
  },[authCtx])

  const selectFavoriteWindowHandler = (windowIndex) => {
    dispatch(
      boardActions.replaceBoard({
        ...favoriteWindows[windowIndex], 
        isFavorite: true,
      })
    );
  };

  const selectOtherWindowHandler = (windowIndex) => {
    dispatch(boardActions.replaceBoard(otherWindows[windowIndex]));
  };
  const onAddWindowHandler = async(title) => {
    console.log("onAddWIndowHere");

    setOtherWindows((state) => {
      console.log(state);
      return [
        ...state,
        {
          _id: Math.random(),
          title: title,
          isFavorite: false,
          members: [],
          groups: [],
        },
      ];
    });

    
    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const user_id = authCtx._id;
    let Res;
    const data = {
      title: title 
    };
    try{

      Res = await axios.post(BACKEND_URL + 
        'api/boards/create_board/' + user_id,
        data
      );
      console.log(Res.data);
    }
    catch(err){
      console.error(err);
    }

  };

  const onAddFavoriteWindowHandler = (id) => {
    const favoriteWindow = otherWindows.find((item) => {
      console.log(item, id);
      return item._id === id;
    });
    console.log(favoriteWindow);
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
