import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { handleNamechange } from "./Apackage";
import { useNavigate, useParams } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";

function TeamEdit() {
  // const [teamname, setTeamName] = useState("");
  // const [managerName, setManagerName] = useState("");
  // const [managerGID, setManagerGID] = useState("");
  // const [managerEmailID, setManagerEmailID] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  //const [teams, setTeams] = useState();
  const [team, setTeam] = useState({
    teamID: 0,
    teamName: "",
    managerName: "",
    managerGID: "",
    managerEmailID: "",
  });

  function saveData() {
    axios
      .put(`${BASE_URL}/api/Team/Put/${team.teamID}`, team, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        console.log(`error occured: ${error.message}`);
      });
    navigate("/viewAllTeams");
  }

  useEffect(() => {
    console.log(params);
    axios
      .get(`${BASE_URL}/api/Team/getTeamById/${params.id}`)
      .then((response) => response.data)
      .then(setTeam);
  }, []);

  return (
    <>
      {/* header */}
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
      {/* headline */}
      <div className="headline">
        <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
          Edit Team Details
        </strong>
      </div>

      <body>
        <div className="IContainer">
          <div className="innercontainer form-control">
            <div className="team-add row">
              <div className="col-25">
                  <strong>Team Name:<span className="compulsory"> *</span></strong>
              </div>
              <div className="col-75">
                <input
                  className="inp form-control"
                  style={{
                    width: "36rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="name"
                  value={team?.teamName}
                  onChange={(e) =>
                    setTeam({ ...team, teamName: e.target.value })
                  }
                />
              </div>
              <div className="col-25">
                  <strong>Manager Name:<span className="compulsory"> *</span></strong>
              </div>
              <div className="col-75">
                <input
                  className="inp form-control"
                  style={{
                    width: "36rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="manager"
                  value={team?.managerName}
                  onChange={(e) =>
                    setTeam({ ...team, managerName: e.target.value })
                  }
                />
              </div>

              <div className="col-25">
                
                  <strong>Manager GID:<span className="compulsory"> *</span></strong>
          
              </div>
              <div className="col-75">
                <input
                  className="inp form-control"
                  style={{
                    width: "36rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="manager"
                  value={team?.managerGID}
                  onChange={(e) =>
                    setTeam({ ...team, managerGID: e.target.value })
                  }
                />
              </div>

              <div className="col-25">
                  <strong>Manager Email:<span className="compulsory"> *</span></strong>
                
              </div>
              <div className="col-75">
                <input
                  className="inp form-control"
                  style={{
                    width: "36rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="manager"
                  value={team?.managerEmailID}
                  onChange={(e) =>
                    setTeam({ ...team, managerEmailID: e.target.value })
                  }
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  style={{ width: "20%" }}
                  className="btn"
                  type="submit"
                  onClick={saveData}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default TeamEdit;
