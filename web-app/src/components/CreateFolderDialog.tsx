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

  return (
    <Dialog open={open} onClose={handleClose}>
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
            setFolderName("");
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={folderName.length === 0}
          onClick={() => {
            setFolderName("");
            handleSubmit(folderName);
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;
