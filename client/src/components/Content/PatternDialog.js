import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
  Box,
  IconButton,
  Dialog,
  DialogContent, // Temp cause too much content
  Link,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

import {
  ThumbUpIcon,
  ThumbDownIcon,
  ExpandMoreIcon,
  IosShareIcon,
} from "../Icons";

import {
  formatLink,
  formatCardTitle,
  formatUserProfile,
  formatDate,
  calculatePassRates,
  calculateLNRates,
  formatTimestamps,
} from "./patternHelper";

import { changeLike, changeDislike } from "../../service/patternService";

const PatternDialog = (props) => {
  const { onClose, open, pattern, setPattern } = props;

  const openMapLink = () => {
    window.open(pattern.beatmapUrl, "_blank").focus();
  };

  const handleLike = () => {
    changeLike(pattern._id).then((pattern) => {
      setPattern(pattern);
    });
  };

  const handleDislike = () => {
    changeDislike(pattern._id).then((pattern) => {
      setPattern(pattern);
    });
  };

  return (
    <Dialog open={open} onClose={() => onClose()} key={pattern._id}>
      <DialogContent style={{ margin: 0, padding: 0 }}>
        <Card className="bg-black f-full w-full flex-1">
          <CardHeader
            // need make it look like its clickeable
            title={
              <Box
                overflow="auto"
                whiteSpace="pre-line"
                className="text-sm pr-2"
                sx={{ flexGrow: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={11} md={11}>
                    <Typography variant="overline" paragraph>
                      {formatCardTitle(pattern.beatmap)}
                    </Typography>
                    <Typography variant="caption">
                      {"Uploaded By: "}
                      <Link href={formatUserProfile(pattern.p_uploadBy.id)}>
                        {pattern.p_uploadBy.username}
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={1}
                    md={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <IconButton
                      color="primary"
                      aria-label="go to page"
                      onClick={openMapLink}
                    >
                      <IosShareIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            }
          />
          <CardMedia
            component="img"
            image={pattern.imageUrl}
            alt="pattern-id"
            className="px-4"
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={10} md={10}>
                {" "}
                <Typography variant="overline">
                  {"Description: " + pattern.description}
                </Typography>
              </Grid>
              <Grid item xs={2} md={2}>
                <Box>
                  <IconButton aria-label="like pattern" onClick={handleLike}>
                    <ThumbUpIcon
                      className={pattern.liked ? "likedButton" : "normalButton"}
                    />
                  </IconButton>
                  <IconButton
                    aria-label="dislike pattern"
                    onClick={handleDislike}
                  >
                    <ThumbDownIcon
                      className={
                        pattern.disliked ? "dislikedButton" : "normalButton"
                      }
                    />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <Typography variant="overline">
              Timestamps:{" "}
              <Link href={formatLink(pattern.osuTimestamps)}>
                {formatTimestamps(pattern.osuTimestamps)}
              </Link>
            </Typography>
          </CardContent>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer comonent={Paper}>
                <Table sx={{ maxWidth: "100%" }} size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        Map Ranked
                      </TableCell>
                      <TableCell align="left">
                        {formatDate(pattern.beatmap.raw_approvedDate)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        Pattern Uploaded
                      </TableCell>
                      <TableCell align="left">
                        {formatDate(pattern.p_uploadDate)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        Liked
                      </TableCell>
                      <TableCell align="left">
                        {pattern.likedBy.length}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        Disliked
                      </TableCell>
                      <TableCell align="left">
                        {pattern.dislikedBy.length}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        Genre
                      </TableCell>
                      <TableCell align="left">
                        {pattern.beatmap.genre}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        Language
                      </TableCell>
                      <TableCell align="left">
                        {pattern.beatmap.language}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        BPM
                      </TableCell>
                      <TableCell align="left">{pattern.beatmap.bpm}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        Favorites
                      </TableCell>
                      <TableCell align="left">
                        {pattern.beatmap.counts.favorites}{" "}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        Success Rate
                      </TableCell>
                      <TableCell align="left">
                        {calculatePassRates(pattern)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" align="left">
                        LN Ratio
                      </TableCell>
                      <TableCell align="left">
                        {calculateLNRates(pattern)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export { PatternDialog };
