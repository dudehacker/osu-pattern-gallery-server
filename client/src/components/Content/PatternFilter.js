import React from "react";
import { useStore } from "../../store";
import PianoIcon from "@mui/icons-material/Piano";
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment
} from "@mui/material";

const PatternFilter = (props) => {
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

  const handleKeysChange = (event) => {
    let key = event.target.name;
    let value = Number(event.target.value);
    patternSearch.filters[key] = value;
    setPatternSearch(patternSearch);
  }

  const handleBpmChange = (event) => {
    let key = event.target.name;
    let value = Number(event.target.value);
    if (key==="minBpm"){
      patternSearch.filters.bpm[0] = value;
    } else {
      patternSearch.filters.bpm[1] = value;
    }
    setPatternSearch(patternSearch);
  }

  return (
    <FormGroup>

      <Box sx={{ width: 250 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              id="outlined-number"
              label="Keys"
              type="number"
              name="keys"
              defaultValue={patternSearch.filters.keys}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PianoIcon />
                  </InputAdornment>
                ),
                inputProps: { min: 4, max: 18, step: 1 }
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              onChange={handleKeysChange}
              onKeyPress={props.onKeyPress}
            />
          </Grid>

          <Grid item xs>
            <TextField
              id="outlined-number"
              label="Min BPM"
              type="number"
              name="minBpm"
              defaultValue={patternSearch.filters.bpm[0]}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MusicNoteIcon />
                  </InputAdornment>
                ),
                inputProps: { min:0, max: 500 }
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              onChange={handleBpmChange}
              onKeyPress={props.onKeyPress}
            />
          </Grid>

          <Grid item xs>
            <TextField
              id="outlined-number"
              label="Max BPM"
              type="number"
              name="maxBpm"
              defaultValue={patternSearch.filters.bpm[1]}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MusicNoteIcon />
                  </InputAdornment>
                ),
                inputProps: { min:0, max: 500 }
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              onChange={handleBpmChange}
              onKeyPress={props.onKeyPress}
            />
          </Grid>

        </Grid>
        
      </Box>



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
              control={<Checkbox name="genre" id={x} onChange={handleChange} />}
              label={x}
            />
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
};

export { PatternFilter };
