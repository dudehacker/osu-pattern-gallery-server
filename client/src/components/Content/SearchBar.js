import React from "react";
import { PatternFilter } from "./PatternFilter";
import { useStore } from "../../store";
import { Grid, InputAdornment, IconButton, TextField } from "@mui/material";
import { getPatterns } from "../../service/patternService";
import SearchIcon from "@mui/icons-material/Search";

const CustomSearch = () => {
  const { setPatterns } = useStore.getState();
  const patternSearch = useStore((state) => state.patternSearch);

  const handleFormSubmit = (event) => {
    if (event.target.name==="text"){
      patternSearch.text = event.target.value
    }
    patternSearch.page = 1;
    getPatterns(patternSearch).then((newPatterns) => {
      setPatterns(newPatterns);
    });
  };

  const handleOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Do code here
      event.preventDefault();
      handleFormSubmit(event);
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          onKeyPress={handleOnKeyPress}
          fullWidth
          name="text"
          label="Search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleFormSubmit}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <PatternFilter onKeyPress={handleOnKeyPress}/>
      </Grid>
    </Grid>
  );
};

export { CustomSearch };
