import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar } from "@mui/material";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import DialogComponent from "./DialogComponent";
const AddTeamMember = () => {
  const [member, setMember] = useState({
    memberName: "",
    managerName: "",
    memberGID: "",
    memberEmailID: "",
    teamName: "",
  });
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("admin");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    console.log("Hello", roleName);
  }, [roleName]);

  function saveData() {
    axios
      .post(`${BASE_URL}/api/Member?role=${roleName}`, member)
      .then((res) => {
        setMessage(`Member "${res?.data?.memberName}" added`);
        setOpen(true);
        let tempMember = {...member};
        Object.keys(tempMember).forEach(e => tempMember[e] = '');
        setMember(tempMember);
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
  const resetForm = (event) => {
    event.preventDefault();
    event.target.reset();
  };

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
      window.removeEventListener("popstate", function (event) {
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
        <Link to="/viewTeamMemeber" className="urls inner-url">
          Team Member{" "}
        </Link>
        &#187;
      </span>
      <div className="headline">
        <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
          Add a Team Member
        </strong>
      </div>

      <div className="IContainer">
        <div className="innercontainer form-control">
          <div className="team-add row" onSubmit={resetForm}>
            <div className="col-25">
              <label style={{ marginRight: "3.5rem" }}>
                <strong>Member Name:</strong>
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
                value={member.memberName}
                onChange={(e) => {
                  setMember({ ...member, memberName: e.target.value });
                }}
              />
            </div>
            <div className="col-25">
              <label style={{ marginRight: "3.2rem" }}>
                <strong>Manager Name:</strong>
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
                value={member.managerName}
                onChange={(e) => {
                  setMember({ ...member, managerName: e.target.value });
                }}
              />
            </div>
            <div className="col-25">
              <label style={{ marginRight: "4.2rem" }}>
                <strong>Member GID:</strong>
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
                value={member.memberGID}
                onChange={(e) => {
                  setMember({ ...member, memberGID: e.target.value });
                }}
              />
            </div>
            <div className="col-25">
              <label style={{ marginRight: "2rem" }}>
                <strong>Member Email:</strong>
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
                type="email"
                name="manager"
                value={member.memberEmailID}
                onChange={(e) => {
                  setMember({ ...member, memberEmailID: e.target.value });
                }}
              />
            </div>
            <div className="col-25">
              <label style={{ marginRight: "5.1rem" }}>
                <strong>Team Name:</strong>
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
                value={member.teamName}
                onChange={(e) => {
                  setMember({ ...member, teamName: e.target.value });
                }}
              />
            </div>

            <div className="col-25">
              <label style={{ marginRight: "5.1rem" }}>
                <strong>Role:</strong>
              </label>
            </div>
            <div className="col-75">
              <select
                // className="inp form-control"
                style={{
                  width: "35rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  padding: "0.3rem",
                  display: "inline",
                }}
                type="text"
                name="manager"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              >
                {localStorage.getItem('roles') === 'admin' && <option value={"admin"}>Admin</option>} 
                {localStorage.getItem('roles') === 'admin' && <option value={"manager"}>Manager</option>} 
                <option value={"teammember"}>Team Member</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{ width: "20%" }}
                className="btn"
                type="submit"
                onClick={function (event) {
                  saveData();
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
              navigatePath={"/viewTeamMemeber"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTeamMember;
