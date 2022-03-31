import React, { useState } from "react";
import { useFormControls } from "./formControls";
import { useStore } from "../../store";
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  Fab,
  //   Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Upload = () => {
  const { setGlobalAlert, patternUploadFields } = useStore.getState();
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () =>
    isLoggedIn
      ? setOpen(true)
      : setGlobalAlert("error", "You must be logged in to upload a pattern");

  const handleAlertOpen = (errMsg) => {
    if (errMsg) {
      setGlobalAlert("error", errMsg);
    } else {
      setGlobalAlert("success", "You have succcessfuly uploaded the pattern!");
      setOpen(false);
    }
  };

  const { handleInputValue, handleFormSubmit, formIsValid, errors } =
    useFormControls(handleAlertOpen);

  const style = {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
  };

  return (
    <div>
      <Fab
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={style}
        aria-label="upload"
      >
        <AddIcon />
      </Fab>
      <Dialog onClose={handleOpen} open={open}>
        <DialogTitle>Submit New Pattern</DialogTitle>
        <form autoComplete="off" onSubmit={handleFormSubmit}>
          {patternUploadFields.map((inputFieldValue, index) => {
            return (
              <TextField
                key={index}
                onChange={handleInputValue}
                onBlur={handleInputValue}
                name={inputFieldValue.name}
                label={inputFieldValue.label}
                helperText={errors[inputFieldValue.name]}
                multiline={inputFieldValue.multiline ?? false}
                fullWidth
                autoComplete="none"
                {...(errors[inputFieldValue.name] && {
                  error: true,
                  helperText: errors[inputFieldValue.name],
                })}
              />
            );
          })}

          <DialogActions disableSpacing className="flex justify-between">
            <Button variant="contained" type="submit" disabled={!formIsValid()}>
              Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export { Upload };
