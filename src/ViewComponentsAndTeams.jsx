import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx/xlsx";
import NavbarComponent from "./NavbarComponent";
import { BASE_URL } from "./Constants";
import LoadingComponent from "./LoadingComponent";
import { handleNamechange } from "./Apackage";

const ViewComponentsAndTeams = () => {
  const params = useParams();

  const [componentTeam, setComponentTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [fliteredDetails, setFilteredDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const getComponentsByPIDandTeam = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Component/getAsyncByAllPIDsAndGroupByTeamName?pid=${params.pid}`
      );
      setComponentTeam(response.data);
      setFilteredDetails(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: <strong>Team Name</strong>,
      selector: (row) => row.teamName,
    },
    {
      name: <strong>PID</strong>,
      selector: (row) => row.pid,
    },
    {
      name: <strong>Material Description</strong>,
      selector: (row) => row.materialDescription,
    },
    {
      name: <strong>Quantity</strong>,
      selector: (row) => row.count,
    },
    {
      name: <strong>Details</strong>,
      cell: (row) => (
        <Link
          to={`/viewComponentsTeamMember/${row?.teamName}/${row?.pid}`}
          className="btn-team-edit"
        >
          View
        </Link>
      ),
    },
  ];

  useEffect(() => {
    getComponentsByPIDandTeam();
  }, []);

  useEffect(() => {
    const result = componentTeam.filter((detail) => {
      return detail.teamName.toLowerCase().match(search.toLowerCase());
    });
    setFilteredDetails(result);
  }, [search]);

  const handleOnExport = () => {
    var workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(componentTeam);
    XLSX.utils.book_append_sheet(workbook, worksheet, "MySheet2");
    XLSX.writeFile(workbook, "Component_Team_Details.xlsx");
  };

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
                <div className="col-6">
                  <span className="link-pages">
                    <Link to="/Home" className="urls">
                      Home{" "}
                    </Link>
                    &#187;
                    <Link to="/viewComponents" className="urls inner-url">
                      View Asset{" "}
                    </Link>
                    &#187;
                  </span>
                  <div className="headline">
                    <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
                      Team Name and Asset
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
                    <button
                      className="btn export-btn"
                      type="submit"
                      style={{ marginLeft: "1rem" }}
                      onClick={handleOnExport}
                    >
                      Export Data
                    </button>
                  </div>
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
      )}
    </>
  );
};

export default ViewComponentsAndTeams;
