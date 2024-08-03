/* eslint-disable no-unused-vars */
// Import necessary dependencies and modules
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DialogActions, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { BASE_URL } from "./Constants";
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
import './App.css'
// Define the Apackage component
const BulkAddExistingComp = () => {
  // State declarations for different form inputs and states
  const [trackingId, setTrackingId] = useState("");
  const [myCategories, setMyCategories] = useState();
  const mydata = useMemo(() => {
    return new Map();
  }, []);
  const [date, setDate] = useState(new Date());
  const [senderName, setSenderName] = useState("");
  const [recieverName, setRecieverName] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [category, setCategory] = useState("");
  const ref = useRef();
  const [packageId, setPackageId] = useState(0);

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

  const SUBMIT_COMPONENTS_ENDPOINT = `${BASE_URL}/api/Component/bulkAddExisitingComponents`;

  const componentForm = {
    serialNo: "",
    pid: "",
    materialDescription: "",
    managerEmail: "",
    teamName: "",
    category: "",
    status: "",
  };

  const [componentFormData, setComponentFormData] = useState([componentForm]);

  const [emailOptions, setEmailOptions] = useState("");
  const [teamName, setTeamName] = useState([]);
  const [componentCategory, setComponentCategory] = useState([]);
  const [status, setStatusOptions] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(true);
  // debugger;
  const handleInputChange = async (event, index) => {
    console.log("HELLO", event);
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
      } else if (event.target.id === "status") {
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
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const [materialOptions, setMaterialOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const GET_INFO_BY_PID = `${BASE_URL}/api/Category/getAllPIDInfo`;
  const [pid, setPID] = useState([]);

  const handleOptionSelect = async (index, fieldId, value) => {
    console.log("Option select", fieldId);
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
      setComponentFormData((prevComponentFormData) => {
        const updatedForm = [...prevComponentFormData];
        updatedForm[index] = {
          ...updatedForm[index],
          managerEmail: response.data,
        };
        return updatedForm;
      });

      setEmailOptions(response.data);
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

      setComponentFormData((prevComponentFormData) => {
        const updatedForm = [...prevComponentFormData];
        updatedForm[index] = {
          ...updatedForm[index],
          materialDescription: response.data?.materialDescription,
          category: response.data?.categoryName,
        };
        return updatedForm;
      });
    } else if (fieldId === "category") {
      setComponentFormData((prevComponentFormData) => {
        const updatedForm = [...prevComponentFormData];
        updatedForm[index] = {
          ...updatedForm[index],
          [fieldId]: value ? value : "",
        };
        return updatedForm;
      });
    }
  };

  useEffect(() => {
    console.log("EMAIL", emailOptions);
  }, [emailOptions]);

  useEffect(() => {
    console.log("formdata", componentFormData);

    setDisableSubmit(
      componentFormData.some((value) => {
        return Object.values(value).includes("");
      })
    );
  }, [componentFormData]);

  const handleAddComponent = () => [
    setComponentFormData([
      ...componentFormData,
      { ...componentForm, packageID: componentFormData[0].packageID },
    ]),
  ];

  const handleComponentsSubmit = async () => {
    try {
      const response = await axios.post(
        `${SUBMIT_COMPONENTS_ENDPOINT}`,
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
        console.log("worked");
        setMessage("Components added!");
        setOpen(true);

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
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  // Check if the form is valid
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
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Category/getPID`)
      .then((response) => setPID(response.data));
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
        <NavbarComponent></NavbarComponent>
      </header>
      <div className="col-12" >
        <div className="row">
         
          <span className="link-pages" style={{position:"relative", left:"35px"}}>
            <Link to="/Home" className="urls">
              Home{" "}
            </Link>
            &#187;
          </span>
          <div className="col-6" >
            <div className="headline">
              <strong style={{ fontSize: "30px", margin: "0.5rem", position:"relative", left:"35px" }}>
                Add Asset
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
                right:"53px"
              }}
            >
              <Link to="/ImportExistingComponent">
                <Tooltip
                  title="Bulk Import Asset, allows you import an excel where asset details are stored."
                  arrow
                  placement="left-start"
                >
                  <button
                    className="btn btn-mid"
                    type="submit"
                    style={{ marginLeft: "1rem" }}
                  >
                    Bulk Import Asset
                  </button>
                </Tooltip>
              </Link>
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
          <Paper sx={{ padding: "2rem" }} className="package-container">
            <div className="row">
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
                handleClose={handleDialogOpen}
                handleOpen={handleDialogOpen}
                navigatePath={"/"}
              />

              <hr />
            </div>
            {componentFormData.map((component, index) => {
              return (
                <>
                  <Grid
                    container
                    spacing={2}
                    sx={{ display: "flex", position: "relative" }}
                    key={index}
                  >
                    <Grid
                      container
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Grid item>
                        <Typography sx={{ marginLeft: "20px" }}>
                          <b>Asset {index + 1}</b>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={1.5}>
                      <TextField
                        name="SerialNo"
                        id="serialNo"
                        onChange={(event) => handleInputChange(event, index)}
                        label={
                          <span>
                          Serial No<span style={{ color: "red" }}> *</span>
                        </span>
                        }
                        value={componentFormData[index].serialNo}
                      />
                    </Grid>

                    <Grid item xs={1.5}>
                      {/* <TextField
                        name="pid"
                        id="pid"
                        onChange={(event) => handleInputChange(event, index)}
                        label="PID/SKU *"
                        value={componentFormData[index]?.pid}
                      /> */}
                      <Autocomplete
                        noOptionsText={"Search.."}
                        id="pid"
                        value={componentFormData[index]?.pid}
                        componentsProps={componentProps}
                        options={pid}
                        onChange={(event, value) =>
                          handleOptionSelect(index, "pid", value)
                        }
                        onInputChange={(event) =>
                          handleInputChange(event, index)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <span>
                                PID/SKU <span style={{ color: "red" }}> *</span>
                              </span>
                            }
                          />
                        )}
                      ></Autocomplete>
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl
                        id="materialDescription"
                        sx={{ width: "100%" }}
                      >
                        <TextField
                          label={
                            <span>
                              Material Description
                              <span style={{ color: "red" }}> *</span>
                            </span>
                          }
                          labelId="materialDescription"
                          id="materialDescription"
                          value={componentFormData[index]?.materialDescription}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.5}>
                      <FormControl id="category" sx={{ width: "100%" }}>
                        <TextField
                          label={
                            <span>
                              Category<span style={{ color: "red" }}> *</span>
                            </span>
                          }
                          labelId="category"
                          id="category"
                          value={componentFormData[index]?.category}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.5}>
                      <Autocomplete
                        noOptionsText={"Search.."}
                        id="teamName"
                        value={componentFormData[index].teamName}
                        componentsProps={componentProps}
                        options={teamName}
                        onInputChange={(event) =>
                          handleInputChange(event, index)
                        }
                        onChange={(event, value) =>
                          handleOptionSelect(index, "teamName", value)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <span>
                                Team Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl
                        id="managerEmail"
                        required
                        sx={{ width: "100%" }}
                      >
                        <TextField
                          labelId="managerEmail"
                          id="managerEmail"
                          value={componentFormData[index]?.managerEmail}
                          label={
                            <span>
                              Manager Email
                              <span style={{ color: "red" }}> *</span>
                            </span>
                          }
                          disabled
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={1.5}>
                      <FormControl id="status" sx={{ width: "100%" }}>
                        <InputLabel id="status">
                          Status
                          <span style={{color: 'red'}}> *</span>
                        </InputLabel>
                        <Select
                          placeholder="Status"
                          id="status"
                          value={componentFormData[index]?.status}
                          label="Status"
                          onChange={(e) => {
                            const updatedForm = componentFormData.map(
                              (component, i) =>
                                i === index
                                  ? Object.assign(component, {
                                      status: e.target.value,
                                    })
                                  : component
                            );
                            setComponentFormData(updatedForm);
                          }}
                        >
                          <MenuItem value={"DISCARD"}>Discard</MenuItem>
                          <MenuItem value={"IN WORKING"}>In Working</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={0.5}>
                      <Button
                        onClick={() => handleDeleteComponent(index)}
                        startIcon={<DeleteIcon />}
                        disabled={index === 0}
                        size="large"
                        sx={{ fontSize: 22, paddingTop: 2 }}
                      ></Button>
                    </Grid>
                  </Grid>
                  <hr style={{ position: "relative", top: "30px" }} />
                </>
              );
            })}
            <Stack
              sx={{ position: "relative", top: "25px" }}
              direction="row"
              spacing={2}
            >
              <Button
                className="convertToTitleCase"
                onClick={handleAddComponent}
                variant="outlined"
                startIcon={<AddOutlinedIcon />}
              >
                Add More
              </Button>
              <Button
                onClick={handleComponentsSubmit}
                disabled={disableSubmit}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Submit
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Grid>
     
    </>
  );
};

export default BulkAddExistingComp;

// Exported handleNamechange as a named export, we can use this by importing it in any file using the syntax: import { handleNamechange } from './Apackage'

export const handleNamechange = (value) => {
  const changedvalue = value.replace(/[^A-Za-z\s]/g, "");
  return changedvalue;
};
