import React from "react";
import { useStore } from "../../store";
import { Grid, Card } from "@mui/material";
import { Pattern } from "./Pattern";

const Gallery = () => {
  const patterns = useStore((state) => state.patterns);

  return (
    <Card className="bg-black f-full w-full flex-1 flex pt-4">
      <Grid container spacing={2}>
        <Grid item xs={2}>
          {patterns.map((pattern) => (
            <Pattern key={pattern._id} data={pattern} />
          ))}
        </Grid>
      </Grid>
    </Card>
  );
};

export { Gallery };
