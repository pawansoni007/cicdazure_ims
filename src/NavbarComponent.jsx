import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "./../src/JCI_logo.png";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import { BASE_URL } from "./Constants";

function NavbarComponent() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [userInfo, setUserInfo] = useState({});
  const [userRole, setUserRole] = useState('');
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const redirect = useNavigate();
  const handleRedirect = (e) => {
    redirect(e.target.value);
  };
  const handleLogout = () => {
    localStorage.removeItem("roles");
    localStorage.removeItem("isAuthenticated");

    (function () {
      var cookies = document.cookie.split("; ");
      for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
          var cookieBase =
            encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
            "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
            d.join(".") +
            " ;path=";
          var p = window.location.pathname.split("/");
          document.cookie = cookieBase + "/";
          while (p.length > 0) {
            document.cookie = cookieBase + p.join("/");
            p.pop();
          }
          d.shift();
        }
      }
    })();
    redirect("/");
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const getUserInfo = async () => {
    try {
      const headers = {
        headers: {
            'memberId' : localStorage.getItem("memberId"),
            'token' : localStorage.getItem("token")
        }
      };
      const { data } = await axios.get(`${BASE_URL}/api/Auth/UserRole`, headers, {
        withCredentials: true,
      });
      setUserInfo(data);
      setUserRole(data.userRole[0].toUpperCase() + data.userRole.slice(1));
      localStorage.setItem('userName', data.userName); 
      localStorage.setItem('userEmail', data.userEmail);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);


  const navigate = useNavigate();
  return (
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

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            ></Menu>
          </Box>

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
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

          <Typography sx={{ fontSize: "15px" }} variant="subtitle2">
            {" "}
            <PersonIcon /> {userInfo.userName}({userRole})
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                navigate("/ChangePassword");
              }}
            >
              {"Change Password"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/Help");
              }}
            >
              {"Help"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/Contactus");
              }}
            >
              {"Support"}
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavbarComponent;
