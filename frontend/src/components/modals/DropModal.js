import {  Modal, Group, Text, useMantineTheme } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { ImageIcon, UploadIcon, CrossCircledIcon } from "@modulz/radix-icons";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const DropModal = (props) => {
  const axiosSecure = useAxiosSecure()
  const FILE_MIME_TYPE = props.files
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

  async function onDropFile(files) {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const cardId = props.id
    const data = new FormData()
    data.append("file",files[0])
    try {
      await axiosSecure.post('/api/upload/file_upload/'+ cardId,data,config)
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    <Modal
      size = "sm"
      centered
      opened={props.isOpen}
      onClose={props.isClose}
      title= "File Upload"
    >
      <Dropzone
        onDrop={(files) => onDropFile(files)}
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
                {props.text}
              </Text>
            </div>
          </Group>
        )}
      </Dropzone>
    </Modal>
  );
};

export default DropModal;