import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx/xlsx";
import NavbarComponent from "./NavbarComponent";
import { BASE_URL } from "./Constants";
import LoadingComponent from "./LoadingComponent";
import { handleNamechange } from "./Apackage";

const ViewComponents = () => {
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [fliteredDetails, setFilteredDetails] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getComponentsByPID = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Component/getAllComponentsByPID`
      );
      setComponents(response.data);
      setFilteredDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    {
      name: <strong>PID/SKU</strong>,
      selector: (row) => row.pid,
    },
    {
      name: <strong>Material Description</strong>,
      selector: (row) => row.materialDescription,
    },
    {
      name: <strong>Category</strong>,
      selector: (row) => row.category,
    },
    {
      name: <strong>Quantity</strong>,
      selector: (row) => row.count,
    },
    {
      name: <strong>Details</strong>,
      cell: (row) => (
        <Link
          to={`/viewComponentsAndTeams/${row.pid}`}
          className="btn-team-edit"
        >
          View
        </Link>
      ),
    },
  ];

  const handleOnExport = () => {
    var workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(components);
    XLSX.utils.book_append_sheet(workbook, worksheet, "MySheet2");
    XLSX.writeFile(workbook, "Component_PID_Details.xlsx");
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

  useEffect(() => {
    getComponentsByPID();
  }, []);

  useEffect(() => {
    const result = components.filter((detail) => {
      return (
        detail.pid.toLowerCase().match(search.toLowerCase()) ||
        detail.materialDescription.toLowerCase().match(search.toLowerCase()) ||
        detail.category.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilteredDetails(result);
  }, [search]);

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
                  <span className="link-pages" style={{position:"relative", left:"0.5rem"}}>
                    <Link to="/Home" className="urls">
                      Home{" "}
                    </Link>
                    &#187;
                  </span>
                  <div className="headline" style={{position:"relative", left:"0.5rem"}}>
                    <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
                      View Asset
                    </strong>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "Right",
                      padding: "1.5rem",
                      position:"relative", 
                      right:"0.5rem"
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

export default ViewComponents;
