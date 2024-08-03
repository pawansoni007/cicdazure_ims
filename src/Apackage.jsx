/* eslint-disable no-unused-vars */
// Import necessary dependencies and modules
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
//import { BASE_URL, GET_ALL_MEMBER_NAMES } from "./Constants";
import { BASE_URL, Get_ADMIN_AND_MANAGER } from "./Constants";

import {
  Category,
  ManagerDescription,
  ManagerEmail,
  Pid,
  SerialNo,
  Status,
  TeamName,
} from "./AddNewPackage";
import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FileUpload from "./ImportExcel";
import DialogComponent from "./DialogComponent";
import { UseDataContext } from "./DataContext";

// Define the Apackage component
const Apackage = () => {
  const data = UseDataContext();
  const [da, setDa] = useState({});
  useEffect(() => {
    setDa(data);
  }, [data]);

  const addNewPakage = {
    serial: <SerialNo />,
    category: <Category />,
    managerEmail: <ManagerEmail />,
    materialDescription: <ManagerDescription />,
    pid: <Pid />,
    teamName: <TeamName />,
    status: <Status />,
  };

  const componentForm = {
    serialNo: "",
    pid: "",
    materialDescription: "",
    managerEmail: "",
    teamName: "",
    packageID: "",
    category: "",
    status: "",
  };

  const [componentFormData, setComponentFormData] = useState([componentForm]);

  const [emailOptions, setEmailOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [teamName, setTeamName] = useState([]);

  const [componentCategory, setComponentCategory] = useState([]);
  const [tableData, setTableData] = useState([addNewPakage]);

  const [trackingId, setTrackingId] = useState("");
  const mydata = useMemo(() => {
    return new Map();
  }, []);
  const [date, setDate] = useState(new Date());
  const [senderName, setSenderName] = useState("");
  const [recieverName, setRecieverName] = useState("");

  //region for additional field
  const [pO_No, setpO_No] = useState("");
  const [supplier, setSupplier] = useState("");
  const [challan_No, setChallan_No] = useState("");
  const [invoice, setInvoice] = useState("");
  //region end

  const [isSaved, setIsSaved] = useState(false);
  const [category, setCategory] = useState("");

  const [packageId, setPackageId] = useState(0);
  // State declarations for different form inputs and states

  // Event handler to sanitize the trackingId input
  const handleTrackingIdChange = (event) => {
    const sanitizedValue = event.target.value
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toUpperCase();
    setTrackingId(sanitizedValue);
  };

  // Function to add selected category to mydata Map and update category state
  const addData = (val, id) => {
    mydata.set(id, val);
    var str = "";
    for (const [key, value] of mydata) {
      str += " " + value;
    }
    setCategory(str);
  };

  // Function to remove category from mydata Map and update category state
  const uncheckit = (val, id) => {
    mydata.delete(id);
    var str1 = "";
    for (const [key, value] of mydata) {
      str1 += " " + value;
    }
    setCategory(str1);
  };

  // Submit handler for the package
  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/Package/Post`, {
        trackingId: trackingId,
        date: new Date(),
        senderName: senderName,
        recieverName: recieverName,
        category: category,
        pO_No: pO_No,
        supplier: supplier,
        challan_No: challan_No,
        invoice: invoice,
      });
      setPackageId(res.data.packageId);
      setIsSaved(true);
      setMessage(`Package added successfully!`);

      //#region Clear form fields on successful save
      setDate(new Date());
      setTrackingId("");
      setSenderName("");
      setRecieverName("");
      setpO_No("");
      setSupplier("");
      setChallan_No("");
      setInvoice("");
      //#endregion

      // make packageId same for all the fields after package is saved. PackageId field is read-only as of now.
      setComponentFormData((prevComponentData) =>
        prevComponentData.map((componentData) => ({
          ...componentData,
          packageID: res.data.packageId,
        }))
      );
      return res;
    } catch (err) {
      console.log(err.message);
    }
  };

  //#region
  /**
   * Dynamic form
   */

  const componentProps = {
    popper: {
      modifiers: [
        {
          name: "flip",
          enabled: false,
        },
        {
          name: "preventOverflow",
          enabled: false,
        },
      ],
    },
  };

  const SEARCH_BY_TEAMNAME_ENDPOINT = `${BASE_URL}/api/Team/getTeamListByTeamName`;

  const SEARCH_BY_CATEGORY_ENDPOINT = `${BASE_URL}/api/Category/getCategoryByName`;
  const GET_MANAGEREMAIL_BY_TEAMNAME = `${BASE_URL}/api/Team/getManagerEmail`;

  const SUBMIT_COMPONENTS_ENDPOINT = `${BASE_URL}/api/Component/bulkAddComponents`;

  // debugger;
  const componentData = useMemo(() => {
    return componentFormData;
  }, [componentFormData.length]);
  const handleInputChange = async (event, index) => {
    try {
      if (event.target.id === "serialNo") {
        const updatedForm = componentFormData.map((component, i) =>
          i === index
            ? Object.assign(component, {
                [event.target.id]: event.target.value,
              })
            : component
        );
        setComponentFormData(updatedForm);
      } else if (event.target.id === "pid") {
        const updatedForm = componentFormData.map((component, i) =>
          i === index
            ? Object.assign(component, {
                [event.target.id]: event.target.value,
              })
            : component
        );
        setComponentFormData(updatedForm);
      } else if (event.target.id === "materialDescription") {
        const updatedForm = componentFormData.map((component, i) =>
          i === index
            ? Object.assign(component, {
                [event.target.id]: event.target.value,
              })
            : component
        );

        setComponentFormData(updatedForm);
      } else if (event.target.id === "teamName") {
        const updatedForm = componentFormData.map((component, i) =>
          i === index
            ? Object.assign(component, {
                [event.target.id]: event.target.value,
              })
            : component
        );

        setComponentFormData(updatedForm);

        const response = await axios.get(
          `${SEARCH_BY_TEAMNAME_ENDPOINT}?teamName=${event.target.value}`,
          {
            withCredentials: true,
          }
        );
        setTeamName(response.data);
      } else if (event.target.id === "managerEmail") {
        const updatedForm = componentFormData.map((component, i) =>
          i === index
            ? Object.assign(component, {
                [event.target.id]: event.target.value,
              })
            : component
        );
        setComponentFormData(updatedForm);
      } else if (event.target.id === "category") {
        const updatedForm = componentFormData.map((component, i) =>
          i === index
            ? Object.assign(component, {
                [event.target.id]: event.target.value,
              })
            : component
        );
        setComponentFormData(updatedForm);

        const response = await axios.get(
          `${SEARCH_BY_CATEGORY_ENDPOINT}?categoryName=${event.target.value}`,
          {
            withCredentials: true,
          }
        );
        setComponentCategory(response.data);
      } else if (event.target.id === "status") {
        const updatedForm = componentFormData.map((component, i) =>
          i === index
            ? Object.assign(component, {
                [event.target.id]: event.target.value,
              })
            : component
        );
        setComponentFormData(updatedForm);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GET_MATERIAL_BY_PID = `${BASE_URL}/api/Category/getMaterialDescription`;
  const GET_INFO_BY_PID = `${BASE_URL}/api/Category/getAllPIDInfo`;

  const handleOptionSelect = async (index, fieldId, value) => {
    if (fieldId === "teamName") {
      setComponentFormData((prevComponentFormData) => {
        const updatedForm = [...prevComponentFormData];
        updatedForm[index] = {
          ...updatedForm[index],
          [fieldId]: value ? value : "",
        };
        return updatedForm;
      });

      const response = await axios.get(
        `${GET_MANAGEREMAIL_BY_TEAMNAME}?teamName=${value}&somekey=ajfdl`,
        {
          withCredentials: true,
        }
      );

      setEmailOptions((prevEmailList) => {
        const updatedEmailOptions = [...prevEmailList];
        updatedEmailOptions[index] = [response.data];
        return updatedEmailOptions;
      });
    }
    if (fieldId === "pid") {
      setComponentFormData((prevComponentFormData) => {
        const updatedForm = [...prevComponentFormData];
        updatedForm[index] = {
          ...updatedForm[index],
          [fieldId]: value ? value : "",
        };
        return updatedForm;
      });

      const response = await axios.get(`${GET_INFO_BY_PID}?pid=${value}`, {
        withCredentials: true,
      });

      setCategoryOptions((prevCategory) => {
        const updateForm = [...prevCategory];
        updateForm[index] = [response.data.categoryName];
        return updateForm;
      });
    }
  };

  const handleAddComponent = () => {
    if (
      data.serialNo.length > 0 &&
      data.pidData.length > 0 &&
      data.materailDescription.length > 0 &&
      data.category.length > 0 &&
      data.status.length > 0 &&
      data.teamName.length > 0 &&
      data.managerEmail.length > 0
    ) {
      const newData = {
        serial: data.serialNo,
        pid: data.pidData,
        materialDescription: data.materailDescription,
        managerEmail: data.managerEmail,
        teamName: data.teamName,
        category: data.category,
        status: data.status,
      };
      const a = Boolean(
        tableData.find(
          (val) =>
            val.serial.toString().toLowerCase() ===
            data.serialNo.toString().toLowerCase()
        )
      );
      if (!a) {
        setTableData((p) => {
          return [...p, newData];
        });
      } else {
        setMessage("Serial No. already exists!");
        setOpen(true);
      }

      data.reset();
      setNewPackage({
        serial: "",
        category: "",
        managerEmail: "",
        materialDescription: "",
        pid: "",
        teamName: "",
        status: "",
      });
    } else {
      setMessage("Please enter all the details");
      setOpen(true);
    }
  };

  const handleComponentsSubmit = async () => {
    try {
      const response = await axios.post(
        `${SUBMIT_COMPONENTS_ENDPOINT}?PackageId=${componentFormData[0]?.packageID}`,
        componentFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success === true) {
        setMessage("Components added successfully!");
        setOpen(true);

        //#region Clear component form data
        setComponentFormData((prevData) =>
          prevData.length > 1
            ? prevData.splice(1, prevData.length) && [
                {
                  ...prevData[0],
                  managerEmail: "",
                  materialDescription: "",
                  serialNo: "",
                  pid: "",
                  teamName: "",
                  category: "",
                  status: "",
                },
              ]
            : [
                {
                  ...prevData[0],
                  managerEmail: "",
                  materialDescription: "",
                  serialNo: "",
                  pid: "",
                  teamName: "",
                  category: "",
                  status: "",
                },
              ]
        );
        //#endregion
      }
    } catch (error) {
      setMessage("Failed to add components!");
      setOpen(true);
    }
  };

  const [newPackage, setNewPackage] = useState({
    serial: "",
    category: "",
    managerEmail: "",
    materialDescription: "",
    pid: "",
    teamName: "",
    status: "",
  });

  const handleDeleteComponent = (index) => {
    let updatedComponentFormData = [...componentFormData];
    updatedComponentFormData.splice(index, 1);
    // updatedComponentFormData = updatedComponentFormData.filter((item, i) => i !== index);
    setComponentFormData(updatedComponentFormData);
  };

  //#endregion

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [members, setMembers] = useState([]);
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
  //template for importing components
  const handleOnExport = () => {
    var data = [
      [
        "ComponentId",
        "SerialNo",
        "PID",
        "MaterialDescription",
        "ManagerEmail",
        "TeamName",
        "Category",
        "Status",
      ],
    ];
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push("Asset_Template");
    wb.Sheets["Asset_Template"] = XLSX.utils.aoa_to_sheet(data);
    XLSX.writeFile(wb, "Asset_Template.xlsx");
  };

  // Check if the form is valid and these fields are filled
  const isFormValid = trackingId && senderName && recieverName;

  //#region Dialog Component
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", function (event) {
      setIsDialogOpen(true);
    });
    return () => {
      window.removeEventListener("popstate", function (event) {
        setIsDialogOpen(true);
      });
    };
  }, []);

  //fetching data - all pids

  //fetch admin and managers only
  useEffect(() => {
    axios.get(`${Get_ADMIN_AND_MANAGER}`).then((response) => {
      const memberData = response.data;
      setMembers(memberData);
    });
  }, []);

  //fetching data - Team Names
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Team/teamNames`)
      .then((response) => setTeamName(response.data));
  }, []);

  //#endregion

  // Render the component
  return (
    <>
      {/* Heading */}
      <header className="navbar">
        <NavbarComponent>Inventory Management System</NavbarComponent>
      </header>
      <div className="main container">
        <span
          className="link-pages"
          style={{ position: "relative", right: "75px" }}
        >
          <Link to="/Home" className="urls">
            Home{" "}
          </Link>
          &#187;
        </span>
        <div className="row">
          <div className="col-6">
            <div className="headline">
              <strong
                style={{
                  fontSize: "30px",
                  margin: "0.5rem",
                  position: "relative",
                  right: "75px",
                }}
              >
                Add Shipment
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Form container */}
      <Grid>
        <Box
          sx={{
            bgcolor: "#fff",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Paper sx={{ padding: "3rem" }} className="package-container">
            <div className="row">
              <div>
                {/* Tracking ID input */}
                <div className="col-17">
                  <label>
                    <strong>
                      Tracking ID:<span className="compulsory"> *</span>
                    </strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    className="inp form-control"
                    style={{
                      width: "30rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                      display: "inline",
                      position: "relative",
                      left: "0.5rem",
                    }}
                    type="text"
                    value={trackingId}
                    onChange={handleTrackingIdChange}
                  />
                </div>

                {/* Date input */}
                <div className="col-17">
                  <label>
                    <strong>
                      Date:<span className="compulsory"> *</span>
                    </strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    className="inp form-control"
                    style={{
                      width: "30rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                      display: "inline",
                      position: "relative",
                      left: "0.5rem",
                    }}
                    type="date"
                    value={`${date.getFullYear()}-${(date.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}-${date
                      .getDate()
                      .toString()
                      .padStart(2, "0")}`}
                    onChange={(e) => setDate(new Date(e.target.value))}
                  />
                </div>

                {/* Sender's Name input */}
                <div className="col-17">
                  <label>
                    <strong>
                      Sender's Name:<span className="compulsory"> *</span>
                    </strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    className="inp form-control"
                    style={{
                      width: "30rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                      display: "inline",
                      position: "relative",
                      left: "0.6rem",
                    }}
                    type="text"
                    value={senderName}
                    onChange={(e) =>
                      setSenderName(handleNamechange(e.target.value))
                    }
                  />
                </div>

                {/*PO Number input */}
                <div className="col-17">
                  <label>
                    <strong>PO No:</strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    className="inp form-control"
                    value={pO_No}
                    style={{
                      width: "30rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                      display: "inline",
                      position: "relative",
                      left: "0.7rem",
                    }}
                    type="text"
                    onChange={(e) => setpO_No(handleNamechange(e.target.value))}
                  />
                </div>

                {/*Suppliers Name input */}
                <div className="col-17">
                  <label>
                    <strong>Supplier Name:</strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    className="inp form-control"
                    value={supplier}
                    style={{
                      width: "30rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                      display: "inline",
                      position: "relative",
                      left: "0.7rem",
                    }}
                    type="text"
                    onChange={(e) =>
                      setSupplier(handleNamechange(e.target.value))
                    }
                  />
                </div>

                {/* Challan Number input */}
                <div className="col-17">
                  <label style={{ marginRight: "4.8rem" }}>
                    <strong>Challan No:</strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    className="inp form-control"
                    value={challan_No}
                    style={{
                      width: "30rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                      display: "inline",
                      position: "relative",
                      left: "0.8rem",
                    }}
                    type="text"
                    onChange={(e) =>
                      setChallan_No(handleNamechange(e.target.value))
                    }
                  />
                </div>

                {/* invoice Number input */}

                <div className="col-17">
                  <label style={{ marginRight: "5rem" }}>
                    <strong>Invoice No:</strong>
                  </label>
                </div>
                <div className="col-75">
                  <input
                    className="inp form-control"
                    value={invoice}
                    style={{
                      width: "30rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                      display: "inline",
                      position: "relative",
                      left: "0.8rem",
                    }}
                    type="text"
                    onChange={(e) =>
                      setInvoice(handleNamechange(e.target.value))
                    }
                  />
                </div>

                {/* Receiver name input */}
                <div className="col-17">
                  <label style={{ marginRight: "2.8rem" }}>
                    <strong>
                      Receiver's Name:<span className="compulsory"> *</span>
                    </strong>
                  </label>
                </div>
                <div className="col-75">
                  <select
                    required
                    style={{
                      width: "30rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      padding: "0.3rem",
                      display: "inline",
                      position: "relative",
                      left: "0.6rem",
                    }}
                    id="recieverName"
                    name="recieverName"
                    value={recieverName}
                    onChange={(e) => setRecieverName(e.target.value)}
                  >
                    <option value="">--Please Select an option--</option>
                    {members &&
                      members.map((value, key) => {
                        return (
                          <option key={key} value={value}>
                            {value}
                          </option>
                        );
                      })}
                  </select>
                </div>

                {/* Submit button */}
                
              </div>
             
              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={open}
                message={message}
                autoHideDuration={4000}
                onClose={handleClose}
                action={action}
              />
              <DialogComponent
                isOpen={isDialogOpen}
                title={"Are you sure you want to exit?"}
                handleClose={handleDialogClose}
                handleOpen={handleDialogOpen}
                navigatePath={"/"}
              />

              <pre></pre>

              <pre></pre>
              <FileUpload
                packageId={packageId}
                handleSubmit={handleSubmit}
                tableData={tableData}
                setTableData={setTableData}
                handleAddComponent={handleAddComponent}
                AddNewPakage={addNewPakage}
                flag={false}
              />

              <pre>&nbsp;</pre>

              <hr />
            </div>
          </Paper>
        </Box>
      </Grid>
    </>
  );
};

export default Apackage;

// Exported handleNamechange as a named export, we can use this by importing it in any file using the syntax: import { handleNamechange } from './Apackage'

export const handleNamechange = (value) => {
  const changedvalue = value.replace(/[^A-Za-z0-9\s]/g, ".", "");
  return changedvalue;
};
