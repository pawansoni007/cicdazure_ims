import axios from "axios";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import { BASE_URL } from "./Constants";
import LoadingComponent from "./LoadingComponent";
import { handleNamechange } from "./Apackage";

const GetComponentsByPackageId = () => {
  const { packageId } = useParams();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [fliteredDetails, setFilteredDetails] = useState([]);
  const [component, setcomponent] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/api/Component/GetComponentsByPackageID?packageId=${packageId}`
      )
      .then((res) => {
        setLoading(true);
        setcomponent(res.data);
        setFilteredDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [packageId]);

  const columns = [
    {
      name: <strong>PID</strong>,
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

  //added for the edit option in component

    {
      name: <strong>Action</strong>,
      cell: (row) => (
        <Link to={`/AssetEdit/${row.componentId}`} className="btn-team-edit">
          Edit
        </Link>
      ),
      omit: localStorage.getItem("roles") === "manager",
    },
  ];

  useEffect(() => {
    const result = component.filter((detail) => {
      return (
        detail.pid.toLowerCase().match(search.toLowerCase()) ||
        detail.materialDescription.toLowerCase().match(search.toLowerCase()) ||
        detail.category.toLowerCase().match(search.toLowerCase())
      );
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

      {loading === true ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="main">
            <div className="col-12">
              <div className="row">
                <span className="link-pages">
                  <Link to="/Home" className="urls">
                    Home{" "}
                  </Link>
                  &#187;
                  <Link to="/viewPackage" className="urls inner-url">
                    View Shipment{" "}
                  </Link>
                  &#187;
                </span>
                <div className="col-6">
                  <div className="headline">
                    <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
                      Shipment Assets
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
      )}
    </>
  );
};

export default GetComponentsByPackageId;
