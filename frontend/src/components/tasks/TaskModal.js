import { useRef, useState } from "react";
import {
  Container,
  Modal,
  Table,
  Textarea,
  Button,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoTrashSharp } from "react-icons/io5";
import { BiAddToQueue } from "react-icons/bi";
import { ImageIcon, UploadIcon, CrossCircledIcon } from "@modulz/radix-icons";

import styles from "./TaskModal.module.css";

const DeleteButton = () => {
  return (
    <button>
      <IoTrashSharp />
    </button>
  );
};

const TaskModal = (props) => {
  const DUMMY_FILES = [
    {
      _id: Math.random(),
      name: "Office lens",
      modified: "February 15, 2021",
      modifiedBy: "Anandakrishnan Rajeev",
      delete: <DeleteButton />,
    },
    {
      _id: Math.random(),
      name: "Others",
      modified: "February 15, 2021",
      modifiedBy: "K N Anantha Nandanan",
      delete: <DeleteButton />,
    },
    {
      _id: Math.random(),
      name: "recordings",
      modified: "February 15, 2021",
      modifiedBy: "Ashish Prem",
      delete: <DeleteButton />,
    },
    {
      _id: Math.random(),
      name: "rough work",
      modified: "February 15, 2021",
      modifiedBy: "Akshay Babu ",
      delete: <DeleteButton />,
    },
  ];
  const [isOpenDropZone, setIsOpenDropZone] = useState(false);
  const [desc, setDesc] = useState(props.description);
  const [onEditDesc, setOnEditDesc] = useState(false);
  const descInputRef = useRef();

  const submitHandler = () => {
    if (descInputRef.current.value.trim() === "") return;

    setDesc(descInputRef.current.value);
    descInputRef.current.value = "";
    setOnEditDesc(false);
    return;
  };

  const modalStyles = {
    title: {
      fontWeight: "bold",
      fontSize: 25,
    },
  };

  const rows = DUMMY_FILES.map((item) => (
    <tr key={item._id}>
      <td>
        <div className={styles.file}>
          <BsFileEarmarkText size="1.3rem" />
          {item.name}
        </div>
      </td>
      <td className={styles.column}>{item.modified}</td>
      <td className={styles.column}>{item.modifiedBy}</td>
      <td className={styles.column}>{item.delete}</td>
    </tr>
  ));

  const DropZoneOverlay = () => {
    const FILE_MIME_TYPE = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    const theme = useMantineTheme();

    function ImageUploadIcon({ status, ...props }) {
      if (status.accepted) {
        return <UploadIcon {...props} />;
      }

      if (status.rejected) {
        return <CrossCircledIcon {...props} />;
      }

      return <ImageIcon {...props} />;
    }

    function getIconColor(status, theme) {
      return status.accepted
        ? theme.colors[theme.primaryColor][6]
        : status.rejected
        ? theme.colors.red[6]
        : theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.black;
    }

    return (
      <Modal
        size = "sm"
        centered
        opened={isOpenDropZone}
        onClose={() => setIsOpenDropZone(false)}
        title= "File Upload"
      >
        <Dropzone
          onDrop={(files) => console.log("accepted files", files)}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={20 * 1024 ** 2}
          accept={FILE_MIME_TYPE}
        >
          {(status) => (
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: 220, pointerEvents: "none" }}
            >
              <ImageUploadIcon
                status={status}
                style={{
                  width: 80,
                  height: 80,
                  color: getIconColor(status, theme),
                }}
              />

              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed
                  20mb
                </Text>
              </div>
            </Group>
          )}
        </Dropzone>
      </Modal>
    );
  };

  return (
    <Modal
      styles={modalStyles}
      size="xl"
      centered
      opened={props.opened}
      onClose={props.onClose}
      title={props.title}
      hideCloseButton
    >
      {isOpenDropZone && <DropZoneOverlay />}
      <div className={styles["module"]}>
        <header className={styles["header"]}>
          Description{"  "}
          {!onEditDesc && (
            <Button
              onClick={() => setOnEditDesc(true)}
              size="xs"
              variant="light"
            >
              Edit
            </Button>
          )}
        </header>
        {!onEditDesc ? (
          <Container style={{ fontSize: 15 }} size="md" padding="md">
            {desc}
          </Container>
        ) : (
          <div className={styles["form-control"]}>
            <Textarea
              onFocus={() => setOnEditDesc(true)}
              placeholder="Add a description here"
              ref={descInputRef}
            />
            {onEditDesc && (
              <div className={styles["form-actions"]}>
                <Button
                  onClick={submitHandler}
                  size="xs"
                  className={styles["form-button"]}
                  variant="outline"
                >
                  {" "}
                  Save
                </Button>
                <Button
                  onClick={() => setOnEditDesc(false)}
                  size="xs"
                  className={styles["form-button"]}
                  variant="default"
                >
                  {" "}
                  Cancel{" "}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles["module"]}>
        <header className={`${styles["files"]} ${styles["header"]}`}>
          <p>Files</p>
          <Button
            classNames={{ root: styles["add-file"] }}
            onClick={() => setIsOpenDropZone(true)}
            variant="filled"
          >
            {" "}
            <BiAddToQueue size="1.3em" />{" "}
            <div style={{ marginLeft: 6 }}>Add files</div>{" "}
          </Button>
        </header>
        <Table verticalSpacing="md">
          <thead>
            <tr>
              <th>Name</th>
              <th>Modified</th>
              <th>Modified By</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </Modal>
  );
};

export default TaskModal;
