import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Login from "./Login";
import { Snackbar, Tooltip } from "@mui/material";
import { useState } from "react";
import NavbarComponent from "./NavbarComponent";

const Home = ({ user }) => {
  const navigate = useNavigate();
  // debugger;
  const firstRole = localStorage.getItem("roles");

  useEffect(() => {
    if (
      localStorage.getItem("roles") === null &&
      localStorage.getItem("isAuthenticated") === null
    )
      navigate("/");
  });
  const [open, setOpen] = useState(false);

  return (
    <div className="homeContainer">
      <header className="header">
        <NavbarComponent user={user}>
          Inventory Management System
        </NavbarComponent>
      </header>

      <div className="buttonContainer">
        {firstRole === "admin" && (
          <div className="buttonBox">
            <ul className="buttonList">
              <li>
                <Tooltip
                  title="Add Shipment, helps admin to add details of a shipment that
                  has arrived in the office."
                  arrow
                  placement="left-start"
                >
                  <button
                    onClick={() => navigate("/AddPackage")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    Add Shipment
                  </button>
                </Tooltip>
              </li>

              <li>
                <Tooltip
                  title="
                  View Shipment, allows to view all the shipments that have
                  arrived in Fire Detection."
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/viewPackage")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    View Shipment
                  </button>
                </Tooltip>
              </li>

              <li>
                <Tooltip
                  title=" Add Asset, allows you to add any existing asset in the Fire
                  Detection."
                  arrow
                  placement="left-start"
                >
                  <button
                    type="button"
                    className="btn btn-lg btn-home"
                    onClick={() => navigate("/addExistingComponent")}
                  >
                    Add Asset
                  </button>
                </Tooltip>
              </li>

              <li>
                <Tooltip
                  title="View Asset, shows all the asset present inside Fire Detection."
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/viewComponents")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    View/Search Asset
                  </button>
                </Tooltip>
              </li>

              <li>
                <Tooltip
                  sx={{ fontSize: "15px" }}
                  title="This option allows Admin to create a new Team in the
                  Application."
                  arrow
                  placement="left-start"
                >
                  <button
                    onClick={() => navigate("/viewAllTeams")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    View/Edit Teams
                  </button>
                </Tooltip>
              </li>

              <li>
                <Tooltip
                  title="View Category, shows the category of the specific asset in Fire Detection. "
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/addViewCategory")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    Add/View Category
                  </button>
                </Tooltip>
              </li>

              <li>
                <Tooltip
                  title="Assign Component, allows you to assign components to a Team Member."
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/viewassignComponent")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    Assign Asset
                  </button>
                </Tooltip>
              </li>

              <li>
                <Tooltip
                  title="Add Location, shows the location of the specific asset in Fire Detection. "
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/addLocation")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    Add Asset Location
                  </button>
                </Tooltip>
              </li>
              <li>
                <Tooltip
                  title="Show components assigned to me "
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/viewLoggedUserComponents")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    My Assets
                  </button>
                </Tooltip>
              </li>
            </ul>
          </div>
        )}
        {firstRole === "manager" && (
          <div className="buttonBox">
            <ul className="buttonList">
              <li>
                <Tooltip
                  title="View Asset, shows all the asset present inside Fire Detection."
                  arrow
                  placement="left-start"
                >
                  <button
                    onClick={() => navigate("/viewComponents")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    View Asset
                  </button>
                </Tooltip>
              </li>
              <li>
                <Tooltip
                  title="Show components assigned to me "
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/viewLoggedUserComponents")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    My Assets
                  </button>
                </Tooltip>
              </li>
              <li>
                <Tooltip
                  title="
                  View Shipment, allows to view all the shipments that have
                  arrived in Fire Detection."
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/viewPackage")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    View Shipment
                  </button>
                </Tooltip>
              </li>
              <li>
                <Tooltip
                  title="Assign Component, allows you to assign components to a Team Member."
                  arrow
                  placement="left-start"
                >
                  <button
                    onClick={() => navigate("/viewassignComponent")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    Assign Asset
                  </button>
                </Tooltip>
              </li>
              <li>
                <Tooltip
                  sx={{ fontSize: "15px" }}
                  title="This option allows to view Teams of the manager in the Application."
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/viewAllTeams")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    View/Edit Teams
                  </button>
                </Tooltip>
              </li>
            </ul>
          </div>
        )}
        {firstRole === "teammember" && (
          <div className="buttonBoxTM">
            <ul className="buttonList btn-teammember">
              <li>
                <Tooltip
                  title="View Asset, shows all the asset present inside Fire Detection."
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/viewComponents")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    View Asset
                  </button>
                </Tooltip>
              </li>
              <li>
                <Tooltip
                  title="Show components assigned to me "
                  arrow
                  placement="right-start"
                >
                  <button
                    onClick={() => navigate("/viewLoggedUserComponents")}
                    type="button"
                    className="btn btn-lg btn-home"
                  >
                    My Assets
                  </button>
                </Tooltip>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
