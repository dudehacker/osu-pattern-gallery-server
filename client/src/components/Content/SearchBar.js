import React from "react";
import { PatternFilter } from "./PatternFilter";
import SearchField from "react-search-field";
import { useStore } from "../../store";
import { Grid } from "@mui/material";
import {getPatterns} from "../../service/patternService"

const CustomSearch = () => {
  const { setPatterns } = useStore.getState();
  const patternSearch = useStore((state) => state.patternSearch);

  const handleFormSubmit = (searchText) => {
    console.log(searchText);
    // didn't add text search yet in Backend
    console.log(patternSearch);
    getPatterns(patternSearch).then((newPatterns)=>{
      setPatterns(newPatterns);
    });
  };

  const handleChange = (searchText, event) => {
    console.log(searchText);
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <SearchField
          placeholder="Search item"
          onChange={handleChange}
          onEnter={handleFormSubmit}
          onSearchClick={handleFormSubmit}
        />
      </Grid>
      <Grid item xs={12}>
        <PatternFilter />
      </Grid>
    </Grid>
  );
};

export { CustomSearch };
