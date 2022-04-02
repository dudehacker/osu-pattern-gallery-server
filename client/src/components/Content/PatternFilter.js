import React, { useState } from "react";
import { useStore } from "../../store";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";

const PatternFilter = () => {
  const { patternFilters, setPatternSearch } = useStore.getState();
  const patternSearch = useStore((state) => state.patternSearch);

  const handleChange = (event) => {
    const key = event.target.name;
    const val = event.target.id;
    const checked = event.target.checked;
    if (checked) {
      if (!patternSearch.filters[key].includes(val)) {
        patternSearch.filters[key].push(val);
      }
    } else {
      patternSearch.filters[key] = patternSearch.filters[key].filter(
        (x) => x !== val
      );
    }

    setPatternSearch(patternSearch);
  };

  return (
    <FormGroup>
      <Grid container spacing={1}>
        <Typography component="legend">Langauge</Typography>
      </Grid>
      <Grid container spacing={2}>
        {patternFilters.language.map((lang) => (
          <Grid key={lang} item xs="auto">
            <FormControlLabel
              control={
                <Checkbox name="language" id={lang} onChange={handleChange} />
              }
              label={lang}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1}>
        <Typography component="legend">Genre</Typography>
      </Grid>
      <Grid container spacing={2}>
        {patternFilters.genre.map((x) => (
          <Grid key={x} item xs="auto">
            <FormControlLabel
              control={
                <Checkbox name="genre" id={x} onChange={handleChange} />
              }
              label={x}
            />
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
};

export { PatternFilter };
