import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import logo from "./../src/JCI_logo.png";

const NavPublic = () =>{
    return(
        
    <AppBar position="static" style={{ backgroundColor: "#08338f" }}>
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Link to="/home">
          <img src={logo} alt="Johnson Controls" className="logo-style" />
        </Link>

        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/home"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            color: "inherit",
            textDecoration: "none",
            fontSize: "32px",
          }}
        >
          Inventory Management System
        </Typography>

        <Typography
          variant="h5"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontWeight: 700,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Inventory Management System
        </Typography>
        
      </Toolbar>
    </Container>
  </AppBar>
    );
}

export default NavPublic;