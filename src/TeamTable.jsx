import axios from "axios";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import { Link, useFetcher, useNavigate } from "react-router-dom";
import Teams from "./Teams";
import TeamEdit from "./TeamEdit";
import NavbarComponent from "./NavbarComponent";
import { BASE_URL } from "./Constants";
import LoadingComponent from "./LoadingComponent";
import { handleNamechange } from "./Apackage";

const TeamTable = () => {
  const [search, setSearch] = useState("");
  const [Details, setDetails] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fliteredDetails, setFilteredDetails] = useState([]);
  const navigate = useNavigate();

  const getDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/Team/Get`, {
        withCredentials: true,
      });
      console.log(response);
      setDetails(response.data);
      setFilteredDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let role = localStorage.getItem("roles");
    if (role === "teammember") navigate("/home");
  }, []);

  //view by teamMember by Team  Name
  const columns = [
    {
      name: <strong>Team Name</strong>,
      selector: (row) => (
        <Link to={`/ViewTeamMemberByTeamName/`} state={row.teamName}>
          {row.teamName}
        </Link>
      ),
    },

    {
      name: <strong>Manager Name</strong>,
      selector: (row) => row.managerName,
    },

    {
      name: <strong>Manager Email</strong>,
      selector: (row) => row.managerEmailID,
    },
    {
      name: <strong>Edit</strong>,
      omit: localStorage.getItem("roles") === "manager",
      cell: (row) => (
        <Link to={`/TeamEdit/${row.teamID}`} className="btn-team-edit">
          Edit
        </Link>
      ),
    },
  ];

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    const result = Details.filter((detail) => {
      return (
        detail.teamName.toLowerCase().match(search.toLowerCase()) ||
        detail.managerEmailID.toLowerCase().match(search.toLowerCase()) ||
        detail.managerName.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilteredDetails(result);
  }, [search]);

  //custom CSS for datatable
  const customTable = {
    headCells: {
      style: {
        fontSize: "17px",
        paddingLeft: "0 5px",
        justifyContent: "center",
        backgroundColor: "#08338f",
        color: "#f0f8ff",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        paddingLeft: "0 5px",
        justifyContent: "center",
      },
    },
  };

  return (
    <>
      {/* Heading */}
      <header className="navbar">
        <NavbarComponent></NavbarComponent>
      </header>

      {loading === true ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="main">
            <div className="col-12">
              <div className="row">
                <span className="link-pages" style={{position:"relative", left:"0.3rem"}}>
                  <Link to="/Home" className="urls">
                    Home{" "}
                  </Link>
                  &#187;
                </span>
                <div className="col-6" style={{position:"relative", left:"0.3rem"}}>
                  <div className="headline">
                    <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
                      Teams
                    </strong>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "Right",
                      padding: "1.5rem",
                      position: "relative",
                      right:"1.2rem"
                    }}
                  >
                    {localStorage.getItem("roles") !== "manager" && (
                      <button
                        className="btn team-table-btn"
                        type="submit"
                        onClick={() => navigate("/addTeam")}
                        style={{ marginLeft: "1rem" }}
                      >
                        Add Team
                      </button>
                    )}
                    <button
                      className="btn"
                      type="submit"
                      onClick={() => navigate("/viewTeamMemeber")}
                      style={{ marginLeft: "1rem" }}
                      
                    >
                      View Member
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-alignment">
              <DataTable
                customStyles={customTable}
                columns={columns}
                data={fliteredDetails}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="900px"
                highlightOnHover
                subHeader
                subHeaderComponent={
                  <input
                    type="text"
                    placeholder="Search..."
                    className=" w-25 form-control"
                    value={search}
                    onChange={(e) =>
                      setSearch(handleNamechange(e.target.value))
                    }
                  ></input>
                }
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeamTable;
