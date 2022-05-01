import { useState, MouseEvent } from "react";
import { IconButton, Avatar, Icon, Menu, MenuItem, Box } from "@mui/material";
import { useAuthContext } from "../contexts/authContext";

export default function UserMenu() {
  const { user, onSignOut } = useAuthContext();

  const [anchorElem, setAnchorElem] = useState<null | HTMLElement>(null);

  const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
    setAnchorElem(evt.currentTarget);
  };
  const handleClose = () => {
    setAnchorElem(null);
  };

  const userDetails = {
    borderBottom: "1px solid rgb(224, 224, 224)",
    padding: "16px",
    marginBottom: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      marginBottom: "8px",
    },
  };

  return (
    <>
      <IconButton aria-label="User" aria-haspopup="true" onClick={handleClick}>
        <Avatar>
          <Icon>person</Icon>
        </Avatar>
      </IconButton>
      <Menu
        id="userMenu"
        anchorEl={anchorElem}
        keepMounted
        open={Boolean(anchorElem)}
        onClose={handleClose}
      >
        <Box sx={userDetails}>
          <Avatar>
            <Icon>person</Icon>
          </Avatar>
          <Box>{user.name}</Box>
          <Box component={"small"}>{user.email}</Box>
        </Box>
        <MenuItem onClick={onSignOut}>Logout</MenuItem>
      </Menu>
    </>
  );
}
