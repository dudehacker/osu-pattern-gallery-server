import React from "react";
import { useStore } from "../store";
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Typography,
  Tooltip
} from "@mui/material";
import { routes } from "../service/api";
import Cookies from "js-cookie";

import { LogoutIcon, LoginIcon , ContactSupportIcon } from "../components/Icons";

const contactSupport = () =>{
  window.open("https://osu.ppy.sh/users/748722", "_blank").focus();
}

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
          <Tooltip title={username ? "Logout" : "Login"}>
            <IconButton
            color="inherit"
            size="large"
            href={username ? routes.logout : routes.login}
            onClick={handleAccess}
          >
              {username ? <LogoutIcon /> : <LoginIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="Contact support">
            <IconButton color="inherit" size="large" onClick={contactSupport}>
              <ContactSupportIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export { AppBar };
