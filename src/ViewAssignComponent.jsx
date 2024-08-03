/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { BASE_URL } from "./Constants";
import LoadingComponent from "./LoadingComponent";
import { handleNamechange } from "./Apackage";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { UpdateDisabled } from "@mui/icons-material";

const ViewAssignComponent = () => {
  const currentDate = new Date();
  const [search, setSearch] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignComponentToMemberData, setAssignComponentToMemberData] =
    useState([]);

  const statusOptions = ["ASSIGNED", "UNASSIGNED", "DISCARD", "TRANSFER"];
  const [locationOptions, setlocationOptions] = useState([]);
  const [message, setMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpen(false);
    setShowPopupAdded(false);
  };
  const [showPopupAdded, setShowPopupAdded] = useState(false);

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
  const [tableData, setTableData] = useState([
    {
      pid: "",
      materialDescription: "",
      category: "",
      teamName: "",
      managerEmail: "",
      memberEmail: "",
      status: "",
    },
  ]);

  const statusTooltips = {
    DISCARD: "Asset not in use",
    ASSIGNED: "Asset assigned to assignee",
    UNASSIGNED: "Asset is not assigned to anyone",
    TRANSFER: "Asset assigned to another team",
  };

  const [title, setTitle] = useState("");

  const ASSIGN_COMPONENTS_ENDPOINT = `${BASE_URL}/api/AssignComponent`;
  const FETCH_ASSIGNEE_COMPONENT_ENDPOINT = `${BASE_URL}/api/AssignComponent/getDetailsOfAssignedComponents`;
  const GET_MEMBER_DETAILS_WITH_TEAM = `api/Member/GetMembersWithTeam`;

  // console.log(assignComponent);
  const [componentToAssignData, setComponentToAssignData] = useState([]);
  const [fliteredDetails, setFilteredDetails] = useState([]);

  const getComponent = async () => {
    setLoading(true);
    const headers = {
      headers: {
          'memberId' : localStorage.getItem("memberId"),
          'token' : localStorage.getItem("token")
      }
    };
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Component/getAllComponents`, headers,
        { withCredentials: true }
      );
      setTableData(response.data);
      setFilteredDetails(response.data);

      const { data } = await axios.post(
        FETCH_ASSIGNEE_COMPONENT_ENDPOINT,
        response.data, 
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setLoading(false);
      setAssignComponentToMemberData(data);

      const assignComponentDetails = {};

      data.forEach(
        (element) => (assignComponentDetails[element.componentId] = element)
      );

      const filterData = response.data.map((element, index) => {
        //element m bhi component table data hai
        const matchingAssignDetail =
          assignComponentDetails[element.componentId];
        if (matchingAssignDetail)
          return {
            pid: element.pid,
            materialDescription: element.materialDescription,
            category: element.category,
            teamName: element.teamName,
            managerEmail: element.managerEmail,
            memberEmail: matchingAssignDetail.memberEmail,
            componentId: element.componentId,
            status: matchingAssignDetail.status,
            location: matchingAssignDetail.location,
          };

        // If no matching assign detail is found, then return member email with "" and status send as UNASSIGNED.
        return {
          pid: element.pid,
          materialDescription: element.materialDescription,
          category: element.category,
          teamName: element.teamName,
          managerEmail: element.managerEmail,
          memberEmail: "",
          componentId: element.componentId,
          status: "UNASSIGNED",
          location: ""
        };
      });

      setFilteredDetails(filterData);
      setTableData(filterData);
      console.log(filterData);
      // debugger;
      (async function () {
        const tempFilterData = [
          ...new Set(filterData.map((element) => element.teamName)),
        ];

        const response = await axios.post(
          `${BASE_URL}/${GET_MEMBER_DETAILS_WITH_TEAM}`,
          tempFilterData,
          { withCredentials: true }
        );

        setMemberList(response.data);
      })();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getLocationList = async () => {
    const responseData = await axios.get(
      `${BASE_URL}/api/AssignComponent/GetLocationList`,
      { withCredentials: true }
    );
    setlocationOptions(responseData.data);
    };

  // const handleInputChange = async (event, rowIndex, row) => {
  //   // debugger;
  //   let SEARCH_MEMBER_BY_TEAMNAME_ENDPOINT = "";
  //   if (event !== null) {
  //     SEARCH_MEMBER_BY_TEAMNAME_ENDPOINT = `${BASE_URL}/api/Member/GetByTeam/getMemberByTeam?teamName=${row?.teamName}&search=${event.target.value}`;
  //     const { data } = await axios.get(`${SEARCH_MEMBER_BY_TEAMNAME_ENDPOINT}`);
  //     setMemberList(data);
  //   }
  // };

  const oneClickAssignTransferUnassign = async (value, row, status) => {
    debugger;
    const {category, materialDescription, pid, teamName, ...requestBody} = row; 
    requestBody.status = status;
    requestBody.date = currentDate.toISOString();
    if(value !== null)
      requestBody.memberEmail = value.memberEmailID;
    
    const tempArray = [...componentToAssignData];
    const removeDuplicateRecords = tempArray.filter((element) => element.componentId !== row.componentId);
    removeDuplicateRecords.push(requestBody);
    setComponentToAssignData(removeDuplicateRecords);
    
    setFilteredDetails((prevData) => {
      const element = prevData.find((item) => item.componentId === row.componentId);
      element.status = status; 
      return prevData;
    });
  }
  
  useEffect(() => {
    console.log("assignData", componentToAssignData);
  }, [componentToAssignData]);
  
 
  
  const handleOptionSelect = (index, fieldId, value, row) => {
    const memberEmailID = value?.memberEmailID ?? "";

    const updatedForm = [...componentToAssignData];
    if (updatedForm.length > 0) {
      if (componentToAssignData.includes(index) === -1) {
        updatedForm.push({
          memberEmail: memberEmailID ?? "",
          componentId: row?.componentId,
          managerEmail: row?.managerEmail,
          date: currentDate.toISOString(),
          status: "",
        });
      } else {
        updatedForm[index] = {
          memberEmail: memberEmailID ?? "",
          componentId: row?.componentId,
          managerEmail: row?.managerEmail,
          date: currentDate.toISOString(),
          status: "",
        };
      }
    }

    setComponentToAssignData(updatedForm);

    //#region One click transfer, assign, unassign

    //#region Transfer
    // Do not allow self transfer.
    if (value !== null && row !== null && row.teamName !== value.teamName) {
      oneClickAssignTransferUnassign(value, row, "TRANSFER");
    }
    //#endregion

    //#region Assign

    if (value !== null && row !== null && row.teamName === value.teamName) {
      oneClickAssignTransferUnassign(value, row, "ASSIGNED");
    }

    //#endregion

    //#region Unassign

    if (value === null && row !== null) {
      (async () => {
        if (row?.memberEmail === "") {
          const foundElement = updatedForm.find(
            (e) => e.componentId === row?.componentId
          );
          if (foundElement) row.memberEmail = foundElement.memberEmail;
        }
        oneClickAssignTransferUnassign(value, row, "UNASSIGNED");
      })();
    }

    //#endregion

    //#endregion
  };

 
  //To handle location options
  const handleLocationChange = async (componentId, newLocation) =>{
    let updatedForm = [...fliteredDetails];
    const elementToChangeStatus = updatedForm.find((elem)=> elem.componentId === componentId);
    if (elementToChangeStatus) {
      elementToChangeStatus.location = newLocation;
      setFilteredDetails(updatedForm);
    }
 
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
  
  //To handle status options
  const handleStatusChange = async (componentId, newStatus) => {
    //#region Update the status in the frontend
    let updatedForm = [...fliteredDetails];
    const elementToChangeStatus = updatedForm.find(
      (elem) => elem.componentId === componentId
    );

    if (elementToChangeStatus) {
      elementToChangeStatus.status = newStatus;
      setFilteredDetails(updatedForm);
    }
    //#endregion
    //debugger;
    //#region Add status in the request body for each status change.
    updatedForm = [...componentToAssignData];
    const setStatusOfComponent = updatedForm.find(
      (elem) => elem !== undefined && elem.componentId === componentId
    );
    if (setStatusOfComponent) {
      setStatusOfComponent.status = newStatus;
      setComponentToAssignData(updatedForm);
    } else {
      const {
        category,
        materialDescription,
        pid,
        teamName,
        ...currentChangedElement
      } = elementToChangeStatus;
      if (currentChangedElement) {
        currentChangedElement.status = newStatus;
        setComponentToAssignData((prevData) => [
          ...prevData,
          currentChangedElement,
        ]);
      }
    }
    //#endregion
  };

  //#region Fix: Mapping assignee to components
  useEffect(() => {}, [tableData]);
  //#endregion

  //search
  useEffect(() => {
    const result = tableData.filter((detail) => {
      return (
        detail.teamName.toLowerCase().match(search.toLowerCase()) ||
        detail.materialDescription.toLowerCase().match(search.toLowerCase()) ||
        detail.pid.toLowerCase().match(search.toLowerCase()) ||
        detail.category.toLowerCase().match(search.toLowerCase()) ||
        detail.memberEmail.toLowerCase().match(search.toLowerCase()) ||
        detail.managerEmail.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilteredDetails(result);
  }, [search]);


  const columns = [
    {
      name: <strong>PID</strong>,
      selector: (row) => row.pid,
      width : "100px",
    },
    {
      name: <strong>Material Description</strong>,
      selector: (row) => row.materialDescription,
    },
    {
      name: <strong>Category</strong>,
      selector: (row) => row.category,
      width : "120px",
    },
    {
      name: (
        <Tooltip title="team name" arrow placement="left-start">
          <strong>Team Name</strong>
        </Tooltip>
      ),
      selector: (row) => row.teamName,
    },

    {
      name: <strong>Manager Email</strong>,
      selector: (row) => row.managerEmail,
      wrap: true,
    },
    {
      name: <strong>Assignee Email</strong>,
      width : "280px",
      selector: (row, index) => (
        <Autocomplete
          disabled={row?.status === 'DISCARD'}
          noOptionsText={"Search.."}
          // value={row?.memberEmail ?? ''}
          title="Assignee"
          defaultValue={row?.memberEmail ?? ""}
          id="memberEmail"
          options={memberList[row?.teamName]?.concat(memberList["managers"]) ?? []}
          style={{ width: "220px" }}
          getOptionLabel={(option) => option?.memberEmailID ?? row?.memberEmail}
          onChange={(event, value) =>
            handleOptionSelect(index, "memberEmail", value, row)
          }
          renderInput={(params) => (
            <TextField
              sx={{
                "& .MuiTextField-root": { m: 0.5, width: "10ch" },
              }}
              {...params}
              placeholder="Search to assign"
            />
          )}
        />
      ),
      style: {},
    },
    {
      name: (<strong>Location</strong>),
      cell:(row,index) =>{
        return (
          <FormControl  style={{ width: 150 }}>
              <Select  title={title} value={row.location}
              onChange={(event) =>
                handleLocationChange(row.componentId, event.target.value)
              }>
                {locationOptions.map((option) => (
                      <MenuItem  title={statusTooltips[option]} key={option} value={option}>
                        {option[0] + option.slice(1)}
                      </MenuItem>
                ))}
              </Select>
          </FormControl>
        )
      }
     
    },
    {
      name: (
        <strong>Status</strong>
      ),
      cell: (row, index) => {
       console.log(row);
        return (
          <FormControl style={{ width: 250 }}>
            <Select
              disabled={row?.status === 'DISCARD'}
              // defaultValue={row.status}
              onMouseEnter={() => setTitle(statusTooltips[row?.status])}
              title={title}
              value={row.status}
              onChange={(event) =>
                handleStatusChange(row.componentId, event.target.value)
              }
            >
              {statusOptions.map((option) => (

                  // <Tooltip   
                  //   describeChild
                  //   key={option}
                  //   title={statusTooltips[option]}
                  //   arrow
                  //   placement="right"
                  // >

                    <MenuItem title={statusTooltips[option]}  key={option} value={option}>
                      {option[0].toUpperCase() + option.slice(1).toLowerCase()}
                    </MenuItem>

              ))}
            </Select>
            
          </FormControl>
        );
      },
    },
  ];
  
  useEffect(() => {
    getComponent();
    getLocationList();
    // mapComponentDataToAssignee();
  }, []);

  //for hovering the Data

  const handleSubmit = async () => {
    try {
      const filterUndefinedRecords = [...componentToAssignData].filter(
        (elem) => elem !== undefined
      );
      setComponentToAssignData(filterUndefinedRecords);
      const response = await axios.post(
        `${ASSIGN_COMPONENTS_ENDPOINT}`,
        componentToAssignData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data)

      setShowPopupAdded(true);
      setMessage("Operation successful");
    } catch (error) {
      setMessage(error);
    }
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
                <span className="link-pages"  style={{position:"relative", left:"0.5rem"}}>
                  <Link to="/Home" className="urls">
                    Home{" "}
                  </Link>
                  &#187;
                </span>
                <div className="col-6">
                  <div className="headline">
                    <strong style={{ fontSize: "30px", margin: "0.5rem", position:"relative", left:"0.5rem"}}>
                      Assign Asset
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
                      right:"1rem"
                    }}
                  >
                    <button
                      className="btn"
                      type="submit"
                      style={{ marginLeft: "1rem", width: "20%" }}
                      onClick={handleSubmit}
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

export default ViewAssignComponent;
