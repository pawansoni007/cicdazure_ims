import React from "react";
import { useState } from "react";
import axios from "axios";
import PopupComponent from "./PopupComponent";
import { handleNamechange } from "./Apackage";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";

const AddExistingComponent = () => {
  const [component, setComponent] = useState({
    pid: "",
    materialDescription: "",
    managerEmail: "",
    teamName: "",
    category: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpen(false);
    setShowPopupAdded(false);
  };
  const [showPopupAdded, setShowPopupAdded] = useState(false);
  const [err, setErr] = useState(false);
  function saveData(e) {
    e.preventDefault(); //for preventing then default behaviour
    axios
      .post(
        `${BASE_URL}/api/Component/Post/PostForExisistingComponent`,
        component
      )
      .then((res) => {
        setShowPopupAdded(true);
        setMessage(`Asset added successfully!`);
        //for navigating it ot assign
        // navigate("/viewTeamMemeber");
      })
      .catch(() => {
        setErr(true);
      });
  }

  //snack bar close btn
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

  return (
    <>
      {/* Heading */}
      <header className="navbar">
        <NavbarComponent></NavbarComponent>
      </header>
      <div className="col-12">
        <div className="row">
          <span className="link-pages">
            <Link to="/Home" className="urls">
              Home{" "}
            </Link>
            &#187;
          </span>
          <div className="col-6">
            <div className="headline">
              <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
                Add Asset
              </strong>
            </div>
          </div>
          <div className="col-6">
            <div
              style={{
                display: "flex",
                justifyContent: "Right",
                padding: "1.5rem",
              }}
            >
              <Link to="/ImportExistingComponent">
              <button
                className="btn"
                type="submit"
                style={{ marginLeft: "1rem" } }
              >
                Import Asset
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <body>
        <div className="IContainer">
          <div className="innercontainer form-control">
            <form onSubmit={saveData} className="addComponentExixting">
              <div className="add-existing-component row">
                <div className="col-25">
                  <label>
                    <strong>PID:</strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    required
                    className="inp form-control"
                    style={{
                      width: "35rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                    }}
                    type="text"
                    name="pid"
                    value={component.pid}
                    onChange={(e) => {
                      setComponent({ ...component, pid: e.target.value });
                    }}
                  />
                </div>
                <div className="col-25">
                  <label>
                    <strong>Material Description:</strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    required
                    className="inp form-control"
                    style={{
                      width: "35rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                    }}
                    type="text"
                    name="materialDescription"
                    value={component.materialDescription}
                    onChange={(e) => {
                      setComponent({
                        ...component,
                        materialDescription: handleNamechange(e.target.value),
                      });
                    }}
                  />
                </div>
                <div className="col-25">
                  <label>
                    <strong>Manager Email:</strong>
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
                    }}
                    type="email"
                    name="managerEmail"
                    value={component.managerEmail}
                    onChange={(e) => {
                      setComponent({
                        ...component,
                        managerEmail: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="col-25">
                  <label>
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
                    }}
                    type="text"
                    name="TeamName"
                    value={component.teamName}
                    onChange={(e) => {
                      setComponent({
                        ...component,
                        teamName: handleNamechange(e.target.value),
                      });
                    }}
                  />
                </div>
                <div className="col-25">
                  <label>
                    <strong>Category:</strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    required
                    className="inp form-control"
                    style={{
                      width: "35rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                    }}
                    type="text"
                    name="category"
                    value={component.category}
                    onChange={(e) => {
                      setComponent({
                        ...component,
                        category: handleNamechange(e.target.value),
                      });
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    style={{ width: "20%" }}
                    className="btn"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>

              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={showPopupAdded}
                message={message}
                autoHideDuration={4000}
                onClose={handleClose}
                action={action}
              />
            </form>
          </div>
        </div>
      </body>
    </>
  );
};

export default AddExistingComponent;
