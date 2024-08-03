import { useContext, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar } from "@mui/material";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import { BASE_URL } from "./Constants";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavPublic from "./NavPublic";
import Alert from "@mui/material/Alert";
import LoadingComponent from "./LoadingComponent";

import { CircularProgress } from "@mui/material";

const Login = (props) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const navigate = useNavigate();

  //loader
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(() => {
    let userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      return JSON.parse(userProfile);
    }
  });

  const [severity, setSeverity] = useState("");
  //#region Handle login activities

  const [loginForm, setLoginForm] = useState({
    emailAddress: "",
    password: "",
  });

  useEffect(() => {
    if (
      localStorage.getItem("roles") !== null &&
      localStorage.getItem("isAuthenticated") !== null
    )
      navigate("/home");
  });

  const handleLogin = async () => {
    try {
      setLoading(true);

      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${BASE_URL}/api/Auth/Login`,
        loginForm,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 && response.data.isAuthenticated === true) {

        localStorage.setItem(
          "isAuthenticated",
          response.data?.isAuthenticated ?? false
        );
        localStorage.setItem(
          "token", response?.data?.token
        )
        debugger
        localStorage.setItem("memberId", response?.data?.memberId);
        localStorage.setItem("roles", response?.data?.roles ?? []);
        navigate("/home");
      } else throw new Error("Invalid username or password");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setOpen(true);
        setMessage("Invalid Email address");
        setSeverity("warning");
      }
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 401)
      ) {
        setOpen(true);
        setMessage(error.response.data);
        setSeverity("error");
      } else {
        console.log(error.message);
      }
    }
    setLoading(false);
  };

  //#endregion
  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 1,
      }}
    />
  );
  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
const indicatorSize = 80;

  return (
    <div>
      <NavPublic />
      {loading  ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="IContainer">
            <div className="login-form form-control">
              <div className="team-add">
                <div className="login-headline">
                  <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
                    Login
                  </strong>
                </div>
                <div className="row"style={{display:"flex", justifyContent: "space-between", alignItems:"center" }}>
                  <div className="col-35">
                    <label>
                      <strong>
                        Email ID:<span className="compulsory"> *</span>
                      </strong>
                    </label>
                  </div>

                  <div className="col-65">
                    <input
                      className="inp form-control"
                      style={{
                        width: "13.5rem",
                        borderRadius: "0.5rem",
                        marginBottom: "0.5rem",
                        padding: "0.3rem",
                        display: "inline",
                      }}
                      type="email"
                      name="email"
                      value={loginForm?.email}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          emailAddress: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="row" style={{display:"flex", alignItems:"center", marginBottom: "0.5rem" }}>
                  <div className="col-35">
                    <label>
                      <strong>
                        Password:<span className="compulsory"> *</span>
                      </strong>
                    </label>
                  </div>

                  <div className="col-65">
                    <input
                      className="inp form-control"
                      style={{
                        width: "13.5rem",
                        borderRadius: "0.5rem",
                        marginBottom: "0.5rem",
                        padding: "0.3rem",
                        display: "inline",
                      }}
                      type="password"
                      name="password"
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      value={loginForm?.password}
                      required
                    />
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "flex", justifyContent: "flex-end"}}
                >
                  <button
                    style={{ width: "30%"}}
                    className="btn"
                    type="submit"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                </div>

                <div className="text-center">
                  <ColoredLine color="black" className="hr-style" />
                  <span className="login-text">
                    Not a Member? Contact Administrator!
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={open}
            message={message}
            autoHideDuration={4000}
            onClose={handleClose}
            action={action}
          >
            <Alert severity={severity}>{message}</Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
};

export default Login;
