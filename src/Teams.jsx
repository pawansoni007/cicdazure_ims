import React from "react";
import { useState } from "react";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DialogComponent from "./DialogComponent";
import { useBeforeUnload } from "react-router-dom";

const Teams = () => {
  const [team, setTeam] = useState({
    teamName: "",
    managerName: "",
    managerGID: "",
    managerEmailID: "",
  });

  const [popup, setPopUp] = useState(false);
  const [message, setMessage] = useState("");
  function saveData() {
    axios
      .post(`${BASE_URL}/api/Team/Post`, team, {
        withCredentials: true,
      })
      .then((res) => {
        setMessage(`Team "${res?.data?.teamName} "Added!`);
        setOpen(true);
        let tempTeam = {...team};
        Object.keys(tempTeam).forEach(e => tempTeam[e] = '');
        setTeam(tempTeam);
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setOpen(true);
          setMessage(error.response.data);
        }
        if (error.response && error.response.status === 400) {
          setOpen(true);
          setMessage("Enter all fields");
        } 
        else {
          console.log(error.message);
        }
      });
  }

  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setDialogOpen(false);
  };
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

  const handleClick = () => {
    setOpen(true);
  };

  const [isDataSaved, setIsDataSaved] = useState(false);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  //#region Dialog Component
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", function (event) {
      setIsDialogOpen(true);
    });
    return () => {
      window.removeEventListener("popstate", function(event) {
        setIsDialogOpen(true); 
      });
    };
  }, []);

  //#endregion
  
  return (
    <>
      {/* Heading */}
      <header className="navbar">
        <NavbarComponent></NavbarComponent>
      </header>

      <span className="link-pages">
        <Link to="/Home" className="urls">
          Home{" "}
        </Link>
        &#187;
        <Link to="/viewAllTeams" className="urls inner-url">
          Teams{" "}
        </Link>
        &#187;
      </span>

      <div className="headline">
        <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
        Add Team
        </strong>
      </div>

      <body>
        <div className="IContainer">
          <div className="anotherContainerTeamFix form-control">
            <div className="team-add row">
              <div className="col-25">
                <label>
                  <strong>Team name:<span className="compulsory"> *</span></strong>
                </label>
              </div>
              <div className="col-75">
                <input
                  className="inp form-control"
                  style={{
                    width: "35rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="name"
                  value={team.teamName}
                  onChange={(e) => {
                    setTeam({ ...team, teamName: e.target.value });
                  }}
                />
              </div>
              <div className="col-25">
                <label>
                  <strong>Manager Name:<span className="compulsory"> *</span></strong>
                </label>
              </div>
              <div className="col-75">
                <input
                  className="inp form-control"
                  style={{
                    width: "35rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="manager"
                  value={team.managerName}
                  onChange={(e) => {
                    setTeam({ ...team, managerName: e.target.value });
                  }}
                />
              </div>
              <div className="col-25">
                <label style={{ marginRight: "4.2rem" }}>
                  <strong>Manager GID:<span className="compulsory"> *</span></strong>
                </label>
              </div>
              <div className="col-75">
                <input
                  className="inp form-control"
                  style={{
                    width: "35rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="manager"
                  value={team.managerGID}
                  onChange={(e) => {
                    setTeam({ ...team, managerGID: e.target.value });
                  }}
                />
              </div>
              <div className="col-25">
                <label >
                  <strong>Manager Email:<span className="compulsory"> *</span></strong>
                </label>
              </div>
              <div >
                <input
                  className="inp form-control"
                  style={{
                    width: "35rem",
                    borderRadius: "0.5rem",
                    position: 'relative', 
                    left: '13px',
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="manager"
                  value={team.managerEmailID}
                  onChange={(e) => {
                    setTeam({ ...team, managerEmailID: e.target.value });
                  }}
                />
              </div>

              <div
                style={{ display: "flex", justifyContent: "flex-end", position: 'relative', right: '50px' }}
              >
                <button
                  style={{ width: "20%" }}
                  className="btn"
                  type="submit"
                  onClick={function (event) {
                    saveData();
                    handleClick();
                  }}
                >
                  Save
                </button>
              </div>
              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={open}
                message={message}
                autoHideDuration={4000}
                onClose={handleClose}
                action={action}
              ></Snackbar>
              <DialogComponent
                isOpen={isDialogOpen}
                title={"Are you sure you want to exit?"}
                handleClose={handleDialogClose}
                handleOpen={handleDialogOpen}
                navigatePath={"/viewAllTeams"}
              />
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default Teams;
