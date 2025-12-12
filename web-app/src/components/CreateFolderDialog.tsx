import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import React from "react";

const CreateFolderDialog: React.FC<{
  open: boolean;
  handleClose: any;
  handleSubmit: any;
}> = ({ open, handleClose, handleSubmit }) => {
  const [folderName, setFolderName] = React.useState<string>("");

  const close = () => {
    handleClose();
    resetFields();
  };

  const resetFields = () => {
    setTimeout(() => {
      setFolderName("");
    }, 300);
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogContent>
        <TextField
          autoFocus
          id="name"
          label="Folder Name"
          fullWidth
          variant="standard"
          onChange={(e) => setFolderName(e.target.value.trim())}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            close();
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={folderName.length === 0}
          onClick={() => {
            handleSubmit(folderName);
            resetFields();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;
