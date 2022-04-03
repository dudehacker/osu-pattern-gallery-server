/* eslint-disable no-restricted-globals */
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
  Typography,
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
      location.reload();
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
        variant="extended"
        color="primary"
        onClick={handleOpen}
        style={style}
        aria-label="upload"
      >
        <AddIcon />
        Upload
      </Fab>
      <Dialog onClose={handleOpen} open={open}>
        <DialogTitle>Submit New Pattern</DialogTitle>
        <div className="container">
          <form autoComplete="off" onSubmit={handleFormSubmit}>
            <Typography variant="body2">
              Tip: Use Shift+F12 to take a screenshot of pattern in osu editor!
            </Typography>
            <Typography variant="body2">
              Tip: Don't copy the wrong difficulty link for beatmap link
            </Typography>
            <Typography variant="body2">
              Tip: You can only upload pattern from ranked or loved maps
            </Typography>
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
              <Button
                variant="contained"
                type="submit"
                disabled={!formIsValid()}
              >
                Submit
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export { Upload };
