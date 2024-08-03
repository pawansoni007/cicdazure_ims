import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import { BASE_URL } from "./Constants";
import { handleNamechange } from "./Apackage";

const ViewTeamMemberByTeamName = () => {
  const location = useLocation();
  console.log(location);
  const { state } = location;
  const [search, setSearch] = useState("");
  const [fliteredDetails, setFilteredDetails] = useState([]);
  const [member, setmember] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  useEffect(() => {
    const headers = {
      headers: {
          'memberId' : localStorage.getItem("memberId"),
          'token' : localStorage.getItem("token"),
          'teamName' : state
      }
    };
    axios
      .get(`${BASE_URL}/getTeamMembers`, headers, {
        withCredentials: true,
      })
      .then((res) => {
        setmember(res.data.teamMembers);
        setFilteredDetails(res.data.teamMembers);
        setCanEdit(res.data.canEdit)

      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [state]);

  const columns = [
    {
      name: <strong>Member Name</strong>,
      selector: (row) => row.memberName,
    },
    {
      name: <strong>Manager Name</strong>,
      selector: (row) => row.managerName,
    },
    {
      name: <strong>Member Email</strong>,
      selector: (row) => row.memberEmailID,
    },
    {
      name: <strong>Team Name</strong>,
      selector: (row) => row.teamName,
    },
    {
      name: <strong>Action</strong>,
      omit: !canEdit,
      selector: (row) => (
        <Link to={`/MemberEdit/${row.memberId}`} className="btn-no-border">
          Edit
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const result = member.filter((detail) => {
      return detail.memberName.toLowerCase().match(search.toLowerCase());
    });
    setFilteredDetails(result);
  }, [search]);

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
      {/* Navigation bar */}
      <header className="navbar">
        <NavbarComponent>Inventory Management System</NavbarComponent>
      </header>
      <div className="main">
        <div className="col-12">
          <div className="row">
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
            <div className="col-6">
              <div className="headline">
                <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
                  Team Members
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
              ></div>
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
              onChange={(e) => setSearch(handleNamechange(e.target.value))}
            ></input>
          }
        />
      </div>
    </>
  );
};

export default ViewTeamMemberByTeamName;
