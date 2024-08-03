import {
  Grid,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Stack,
  Button,
  IconButton,
  Autocomplete,
  FormControl,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { BASE_URL } from "./Constants";
import DataTable from "react-data-table-component";
import useSWR from "swr";
import LoadingComponent from "./LoadingComponent";

const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const TeamMember = () => {
  const { data, error, mutate } = useSWR(`${BASE_URL}/api/Member/Get`, fetcher);

  //member table schema
  const [member, setMember] = useState({
    memberName: "",
    managerName: "",
    memberGID: "",
    memberEmailID: "",
    teamName: "",
  });

  const [search, setSearch] = useState("");
  const [Details, setDetails] = useState([]);
  const [filterDetails, setFilterDetails] = useState([]);

  const [loading, setLoading] = useState(false);

  const getMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/Member/Get`, {
        withCredentials: true,
      });
      setDetails(response.data);
      setFilterDetails(response.data);
      console.log(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  useEffect(() => {
    const result = Details.filter((detail) => {
      return (
        detail.memberName.toLowerCase().match(search.toLowerCase()) ||
        detail.managerName.toLowerCase().match(search.toLowerCase()) ||
        detail.teamName.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterDetails(result);
  }, [search]);

  //fetching data - Team Names
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Team/teamNames`)
      .then((response) => setTeamName(response.data));
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Error fetching data", error);
    } else if (data) {
      setDetails(data);
      setFilterDetails(data);
    }
  }, [data, error]);

  const [roleName, setRoleName] = useState("admin");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  //columns for table
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
      name: <strong>Roles</strong>,
      selector: (row) => {
        const roles = row.roles;
        const output = roles.map((role) => {
          return (
            <span style={{ marginRight: "1rem", textTransform: "capitalize" }}>
              {role}
            </span>
          );
        });
        return output;
      },
    },
    {
      name: <strong>Action</strong>,
      cell: (row) => (
        <Link to={`/MemberEdit/${row.memberId}`} className="btn-team-edit">
          Edit
        </Link>
      ),
    },
  ];

  //saving data entered by the user
  function saveData() {
    axios
      .post(`${BASE_URL}/api/Member/Post?role=${roleName}`, member)
      .then((res) => {
        setMessage(`Member "${res?.data?.memberName}" added`);
        setOpen(true);
        let tempMember = { ...member };
        Object.keys(tempMember).forEach((e) => (tempMember[e] = ""));
        setMember(tempMember);
        mutate();
        // window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setOpen(true);
          setMessage(error.response.data);
        }
        if (error.response && error.response.status === 400) {
          setOpen(true);
          setMessage("Enter all fields");
        } else {
          console.log(error.message);
        }
      });
  }
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

  //custom style for table
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

  const SEARCH_BY_TEAMNAME_ENDPOINT = `${BASE_URL}/api/Team/getTeamListByTeamName`;
  const GET_MANAGERNAME_BY_TEAMNAME = `${BASE_URL}/api/Team/getManagerName`;
  const [teamName, setTeamName] = useState([]);

  //to reset form after submission
  const resetForm = (event) => {
    event.preventDefault();
    event.target.reset();
  };

  const [formData, setFormData] = useState([member]);

  //to handle data received
  const handleInputChange = async (event, index) => {
    try {
      if (event.target.id === "memberName") {
        const updatedForm = formData.map((member, i) =>
          i === index
            ? Object.assign(member, {
                [event.target.id]: event.target.value,
              })
            : member
        );
        setFormData(updatedForm);
      } else if (event.target.id === "teamName") {
        const updatedForm = formData.map((member, i) =>
          i === index
            ? Object.assign(member, {
                [event.target.id]: event.target.value,
              })
            : member
        );
        setFormData(updatedForm);

        const response = await axios.get(
          `${SEARCH_BY_TEAMNAME_ENDPOINT}?teamName=${event.target.value}`,
          {
            withCredentials: true,
          }
        );
        setTeamName(response.data);
      } else if (event.target.id === "managerName") {
        const updatedForm = formData.map((member, i) =>
          i === index
            ? Object.assign(member, {
                [event.target.id]: event.target.value,
              })
            : member
        );
        setFormData(updatedForm);
      } else if (event.target.id === "memberGID") {
        const updatedForm = formData.map((member, i) =>
          i === index
            ? Object.assign(member, {
                [event.target.id]: event.target.value,
              })
            : member
        );
        setFormData(updatedForm);
      } else if (event.target.id === "memberEmailID") {
        const updatedForm = formData.map((member, i) =>
          i === index
            ? Object.assign(member, {
                [event.target.id]: event.target.value,
              })
            : member
        );
        setFormData(updatedForm);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching data", error);
    } else if (data) {
      setMember(data);
    }
  }, [data, error]);

  const [nameOptions, setNameOptions] = useState([]);
  const handleOptionSelect = async (index, fieldID, value) => {
    console.log(fieldID);
    if (fieldID === "teamName") {
      setFormData((prevFormData) => {
        const updatedFormData = [...prevFormData];
        updatedFormData[index] = {
          ...updatedFormData[index],
          [fieldID]: value ? value : "",
        };
        return updatedFormData;
      });
      const response = await axios.get(
        `${GET_MANAGERNAME_BY_TEAMNAME}?teamName=${value}&somekey=teamName`,
        {
          withCredentials: true,
        }
      );

      setNameOptions((prevName) => {
        const updateForm = [...prevName];
        updateForm[index] = [response.data];
        return updateForm;
      });
    }
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

  return (
    <>
      <header className="navbar">
        <NavbarComponent></NavbarComponent>
      </header>

      {loading === true ? (
        <LoadingComponent />
      ) : (
        <>
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
            </div>
          </div>

          {/* Form container */}
          {formData.map((member, index) => {
            return (
              <div className="" onSubmit={resetForm}>
                <Grid>
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      height: "30vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Paper
                      sx={{ padding: "2rem" }}
                      className="package-container team-container"
                    >
                      <div className="row">
                        <Snackbar
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          open={open}
                          message={message}
                          autoHideDuration={4000}
                          onClose={handleClose}
                          action={action}
                        />
                        <hr />
                      </div>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", position: "relative" }}
                      >
                        <Grid
                          container
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Grid item>
                            <Typography sx={{ marginLeft: "20px" }}>
                              <b>Add Team Member</b>
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            placeholder="Enter Member Name"
                            name="memberName"
                            id="memberName"
                            label={
                              <span>
                                Member Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            onChange={(event) =>
                              handleInputChange(event, index)
                            }
                            value={formData[index].memberName}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Autocomplete
                            noOptionsText={"Search.."}
                            id="teamName"
                            value={formData[index].teamName}
                            componentsProps={componentProps}
                            options={teamName}
                            onInputChange={(event) =>
                              handleInputChange(event, index)
                            }
                            onChange={(event, value) => {
                              handleOptionSelect(index, "teamName", value);
                            }}
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
                          <FormControl id="managerName" sx={{ width: "100%" }}>
                            <InputLabel id="managerName">
                              Manager Name<span className="compulsory"> *</span>
                            </InputLabel>
                            <Select
                              labelId="managerName"
                              id="managerName"
                              value={formData[index]?.managerName}
                              label="Manager Name"
                              onChange={(event) => {
                                const updatedForm = formData.map((member, i) =>
                                  i === index
                                    ? Object.assign(member, {
                                        managerName: event.target.value,
                                      })
                                    : member
                                );
                                setFormData(updatedForm);
                              }}
                            >
                              {nameOptions[index]?.map((names, i) => (
                                <MenuItem value={names} key={i}>
                                  {names}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            placeholder="Enter Member GID"
                            name="memberGID"
                            id="memberGID"
                            label={
                              <span>
                                Member GID{" "}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            onChange={(event) =>
                              handleInputChange(event, index)
                            }
                            value={formData[index].memberGID}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            placeholder="Enter Member Email ID"
                            name="emailid"
                            id="emailid"
                            label={
                              <span>
                                Member Email{" "}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            onChange={(e) => {
                              setMember({
                                ...member,
                                memberEmailID: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <FormControl id="roleid" sx={{ width: "100%" }}>
                            <InputLabel id="roleid">
                              Role<span className="compulsory"> *</span>
                            </InputLabel>
                            <Select
                              labelId="roleid"
                              id="roleid"
                              placeholder="Select Role *"
                              value={roleName}
                              label="Select Role *"
                              onChange={(e) => setRoleName(e.target.value)}
                            >
                              <MenuItem value={"admin"}>Admin</MenuItem>
                              <MenuItem value={"manager"}>Manager</MenuItem>
                              <MenuItem value={"teammember"}>
                                Team Member
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Stack
                        sx={{ position: "relative", top: "25px" }}
                        direction="row"
                        spacing={2}
                      >
                        <Button
                           style={{
                            textTransform: "none",
                            fontSize: "16px",
                            marginBottom: "10px",
                          }}
                          endIcon={<SendIcon />}
                          variant="outlined"
                          onClick={saveData}
                        >
                          Submit
                        </Button>
                      </Stack>
                    </Paper>
                  </Box>
                </Grid>
              </div>
            );
          })}

          {/*View of Team Members */}
          <div className="table-alignment">
            <DataTable
              customStyles={customTable}
              columns={columns}
              data={filterDetails}
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
                  onChange={(e) => setSearch(e.target.value)}
                ></input>
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default TeamMember;
