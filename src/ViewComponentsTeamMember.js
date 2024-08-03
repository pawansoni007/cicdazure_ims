import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx/xlsx";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";
import { handleNamechange } from "./Apackage";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import 
{
  FormControl,
  Select,
  MenuItem
} from "@mui/material"
const ViewComponentsAndTeamMember = () => {
  const params = useParams();
  const [search, setSearch] = useState("");
  const [fliteredDetails, setFilteredDetails] = useState([]);
  const [componentTeamMember, setComponentTeamMember] = useState([]);
  const [title, setTitle] = useState("");
  const [componentToAssignData, setComponentToAssignData] = useState([]);
  const [locationOptions, setlocationOptions] = useState([]);
  const [isEmptyField, setIsEmptyField] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpen(false);
    setShowPopupAdded(false);
  };
  const [showPopupAdded, setShowPopupAdded] = useState(false);
  
  const userEmail = localStorage.getItem("userEmail");

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

  const getLocationList = async () => {
    const responseData = await axios.get(
      `${BASE_URL}/api/AssignComponent/GetLocationList`,
      { withCredentials: true }
    );
    setlocationOptions(responseData.data);
    }

  //to handle the date data from the backend
  const handleString = (str) => {
    return str.substring(0, 10);
  };

  const handleLocationChange = async (componentId, newLocation) =>{
    let updatedForm = [...fliteredDetails];
    const elementToChangeStatus = updatedForm.find((elem)=> elem.componentId === componentId);
    elementToChangeStatus.location = newLocation;
    setFilteredDetails(updatedForm);
 
    updatedForm = [...componentToAssignData];
    const setStatusOfComponent = updatedForm.find(
      (elem) => elem !== undefined && elem.componentId === componentId
    );
 
    if (setStatusOfComponent) {
      setStatusOfComponent.location = newLocation;
      setComponentToAssignData(updatedForm);
    }
 
    else {
      const {
        category,
        materialDescription,
        pid,
        teamName,
        ...currentChangedElement
      } = elementToChangeStatus;
 
      if (currentChangedElement) {
        currentChangedElement.location = newLocation;
        setComponentToAssignData((prevData) => [
          ...prevData,
          currentChangedElement,
        ]);
      }
    }
  };  

  const getComponentsByTeamMember = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/AssignComponent/getByTeamName?teamName=${params.teamName}&pid=${params.pid}`
      );
      setComponentTeamMember(response.data);
      setFilteredDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateLocation = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/AssignComponent/UpdateComponents`,
        componentToAssignData
      );

      
      setShowPopupAdded(true);
      setMessage("Operation successful");
      setIsUpdateSuccess(true);
      setIsEmptyField(false);
    } catch (error) {
      console.log(error);
    }
  }

  const columns = [
    {
      name: <strong>Component ID</strong>,
      selector: (row) => row.componentId,
    },
    {
      name: <strong>Member Email</strong>,
      selector: (row) => row.memberEmail,
    },
    {
      name: <strong>Manager Email</strong>,
      selector: (row) => row.managerEmail,
    },
    {
      name: (<strong>Location</strong>),
      cell:(row,index) =>{
        return (
          <FormControl  style={{ width: 150 }} disabled={row.memberEmail !== userEmail}>
      <Select  title={title} value={row.location}
              onChange={(event) =>
                handleLocationChange(row.componentId, event.target.value)
              }>
                {locationOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option[0] + option.slice(1)}
                      </MenuItem>
                ))}
              </Select>
          </FormControl>
        )
      }
     
    },
    {
      name: <strong>Assign Date(YYYY-MM-DD)</strong>,
      selector: (row) => handleString(row.date),
    },
  ];
  useEffect(() => {
    getComponentsByTeamMember();
    getLocationList()
  }, []);

  useEffect(() => {
    const result = componentTeamMember.filter((detail) => {
      return detail.memberEmail.toLowerCase().match(search.toLowerCase());
    });
    setFilteredDetails(result);
  }, [search]);

  const handleOnExport = () => {
    var workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(componentTeamMember);
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
                  Team Members and Asset
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
                  onClick={updateLocation}
                >
                  Save
                </button>
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
      <Snackbar
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  open={showPopupAdded}
                  message={message}
                  autoHideDuration={4000}
                  onClose={handleClose}
                  action={action}
                />
    </>
  );
};

export default ViewComponentsAndTeamMember;
