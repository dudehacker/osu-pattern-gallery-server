import React from "react";
import { useStore } from "../store";
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import { routes } from "../service/api";
import Cookies from "js-cookie";

import { LogoutIcon, LoginIcon } from "../components/Icons";

const AppBar = () => {
  const { username, avatar } = useStore((state) => state.user);

  const handleAccess = () => {
    if (username) {
      Cookies.remove("username");
      Cookies.remove("avatar");
    }
  };

  return (
    <MuiAppBar className="h-16" position="fixed" color="primary">
      <Toolbar>
        <Typography>Pattern Gallery</Typography>
        <Box className="grow" />
        <Box sx={{ display: "flex" }}>
          {username ? <Avatar alt="user-avatar" src={avatar}></Avatar> : <></>}
        </Box>
        <Box sx={{ display: "flex" }}>
          <IconButton
            color="inherit"
            size="large"
            href={username ? routes.logout : routes.login}
            onClick={handleAccess}
          >
            {username ? <LogoutIcon /> : <LoginIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export { AppBar };
