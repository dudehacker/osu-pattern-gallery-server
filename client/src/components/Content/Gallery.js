import React from "react";
import { useStore } from "../../store";
import { Grid, Card } from "@mui/material";
import { Pattern } from "./Pattern";

const Gallery = () => {
  const patterns = useStore((state) => state.patterns);

  return (
    <Card className="bg-black f-full w-full flex-1 flex pt-4">
      <Grid direction="row" container spacing={1}>
        <Grid container item sm={6}>
          <Grid item>
            {patterns.map((pattern, i) =>
              i % 2 === 0 ? <Pattern key={pattern._id} data={pattern} /> : null
            )}
          </Grid>
        </Grid>
        <Grid container item sm={6}>
          <Grid item>
            {patterns.map((pattern, i) =>
              i % 2 === 1 ? <Pattern key={pattern._id} data={pattern} /> : null
            )}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export { Gallery };
