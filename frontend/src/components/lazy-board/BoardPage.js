import { Fragment } from "react";

import BoardBar from "./BoardBar";
import Dashboard from './Dashboard';
const BoardPage = () => {
  return <Fragment>
      <BoardBar title = "Academic Tasks"/>
      <Dashboard/>
  </Fragment>;
};

export default BoardPage;
