import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import PackageEdit from "./PackageEdit";
import moment from "moment";
import * as XLSX from "xlsx/xlsx";
import NavbarComponent from "./NavbarComponent";
import { BASE_URL } from "./Constants";
import LoadingComponent from "./LoadingComponent";
const PackageTable = () => {
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const getDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Package/getAllPackages`,
        {
          withCredentials: true,
        }
      );

      setDetails(response.data);
      setFilteredDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    filterDetails();
  }, [search, details]);

  const filterDetails = () => {
    const filtered = details.filter((detail) =>
      Object.values(detail)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredDetails(filtered);
  };

  //to handle the date data from the backend
  const handleString = (str) => {
    return str.substring(0, 10);
  };

  const columns = [
    {
      name: <strong>Shipment ID</strong>,
      selector: (row) => (
        <Link
          to={`/GetComponentsByPackageId/${row.packageId}`}
          state={row.packageId}
          className="btn-no-border"
        >
          {row.packageId}
        </Link>
      ),
    },
    {
      name: <strong>Tracking ID</strong>,
      selector: (row) => row.trackingId,
      center: true,
    },
    {
      name: <strong>Date(YYYY-MM-DD)</strong>,
      selector: (row) => handleString(row.date),
      sortable: true,
      center: true,
    },
    {
      name: <strong>Sender's Name</strong>,
      selector: (row) => row.senderName,
      center: true,
    },
    {
      name: <strong>Receiver's Name</strong>,
      selector: (row) => row.recieverName,
      center: true,
    },

    {
      name: <strong>Action</strong>,
      cell: (row) => (
        <Link to={`/PackageEdit/${row.packageId}`} className="btn-team-edit">
          Edit
        </Link>
      ),
      omit: localStorage.getItem("roles") === "manager",
      selector: (row) => row.category?.trim()?.split(" ")?.join(", "),
    },
  ];
  const handleOnExport = () => {
    var workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(details);
    worksheet = XLSX.utils.json_to_sheet(details);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mysheet1");
    XLSX.writeFile(workbook, "Package_Details.xlsx");
  };

  //custom CSS for datatable
  const customTable = {
    headCells: {
      style: {
        fontSize: "17px",
        paddingLeft: "0 5px",
        justifyContent: "center",
        backgroundColor: "#08338f",
        color: "white",
        fontSize: "17px",
        paddingLeft: "0 5px",
        justifyContent: "center",
        backgroundColor: "#08338f",
        color: "white",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        paddingLeft: "0 5px",
        justifyContent: "center",
        fontSize: "14px",
        paddingLeft: "0 5px",
        justifyContent: "center",
      },
    },
  };

  return (
    <>
      <div className="main">
        {/* Navigation bar */}
        <header className="navbar">
          <NavbarComponent>Inventory Management System</NavbarComponent>
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
                  <div className="col-6" style={{position:"relative", left:"0.4rem"}}>
                    <div className="headline">
                      <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
                        View Shipment
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
                data={filteredDetails}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="900px"
                highlightOnHover
                subHeader
                subHeaderComponent={
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-25 form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                }
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PackageTable;
