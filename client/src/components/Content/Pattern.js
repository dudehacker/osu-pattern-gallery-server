import React, { useState } from "react";
import { Card, CardMedia } from "@mui/material";
import { PatternDialog } from "./PatternDialog";

import { getPattern } from "../../service/patternService";

const Pattern = (props) => {
  const [open, setOpen] = useState(false);
  const [pattern, setPattern] = useState(null);

  // Make an API call to get the pattern everytime the dialog is opened
  const handleClickOpen = () => {
    getPattern(props.data._id)
      .then((pattern) => {
        setPattern(pattern);
      })
      .then(() => {
        setOpen(true);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ maxHeight: 90, maxWidth:180 }} className="f-full w-full ">
      <CardMedia
        component="img"
        image={props.data.imageUrl}
        alt="pattern-id"
        onClick={handleClickOpen}
      />
      {pattern && (
        <PatternDialog
          pattern={pattern}
          open={open}
          onClose={handleClose}
          setPattern={setPattern}
        />
      )}
    </Card>
  );
};

export { Pattern };
