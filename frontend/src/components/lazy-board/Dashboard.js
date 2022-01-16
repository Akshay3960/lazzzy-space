import styles from "./Dashboard.module.css";
import Tasks from "../tasks/Tasks";

const Dashboard = () => {
  const DUMMY_TASKS = [
    {
      id: "t1",
      name: "Resources",
      tasks: ["Paper with Code", "Connected Paper", "Doc For PPL"],
    },
    {
      id: "t2",
      name: "Weekly Assignments",
      tasks: ["Doc for Computer Science", "doc For distributed system"],
    },
    {
      id: "t3",
      name: "Projects",
      tasks: ["Project A", "Project FU", "Project B"],
    },
    {
      id: "t4",
      name: "Exams",
      tasks: ["PPL exam", "distributed System", "Computer Security"],
    },
  ];


  const dashboard = DUMMY_TASKS.map((item) => (
    <Tasks key={item.id} id={item.id} title={item.name} tasks={item.tasks} />
  ));
  return <div className={styles["dashboard"]}>{dashboard}</div>;
};

export default Dashboard;
