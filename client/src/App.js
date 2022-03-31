import React, { useEffect } from "react";
import { useStore } from "./store";
import { AppBar } from "./views/AppBar";
import { Home } from "./views/Home";
import { Dialog, Alert, CircularProgress } from "@mui/material";

const App = () => {
  const globalAlert = useStore((state) => state.globalAlert);
  const globalLoading = useStore((state) => state.globalLoading);
  const { fetchInitialPatterns, clearGlobalAlert } = useStore.getState();

  useEffect(() => {
    fetchInitialPatterns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOpen = () => {
    clearGlobalAlert();
  };

  return (
    <div className="App">
      <AppBar />
      <Home />
      <Dialog onClose={handleClickOpen} open={globalAlert.show}>
        <Alert severity="error">{globalAlert.message}</Alert>
      </Dialog>
      <Dialog onClose={() => {}} open={globalLoading}>
        <CircularProgress />
      </Dialog>
    </div>
  );
};

export default App;
