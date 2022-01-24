import styles from "./DropdownMenu.module.css";

const DropdownMenu = (props) => {
  const DropdownList = props.items.map((item) => (
    <li key={Math.random()} onClick={item.onClick}>
      <i>{item.icon}</i>
      <p>{item.title}</p>
    </li>
  ));

  return (
    <ul className={`${styles["dropdown-container"]} ${props.className}`}>
      {DropdownList}
    </ul>
  );
};

export default DropdownMenu;
