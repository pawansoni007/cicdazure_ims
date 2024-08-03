import { Link } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import axios from "axios";
import { BASE_URL } from "./Constants";
import { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import useSWR from "swr";
import DataTable from "react-data-table-component";
import { Snackbar } from "@mui/material";

const Category = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);

  //category table schema
  const [category, setCategory] = useState({
    id: 0,
    categoryName: "",
    materialDescription: "",
    pid: "",
  });

  const [search, setSearch] = useState("");

  const columns = [
    {
      name: <strong>PID/SKU</strong>,
      selector: (row) => {
        if (row.id === editingId) {
          return (
            <input
              type="text"
              value={row?.pid}
              onChange={(e) => {
                const updatedCategory = {
                  ...row,
                  pid: e.target.value,
                };
                setDetails((prevState) =>
                  prevState.map((item) =>
                    item.id === editingId ? updatedCategory : item
                  )
                );
              }}
            />
          );
        } else {
          return row.pid;
        }
      },
      sortable: true,
    },
    {
      name: <strong>Material Description</strong>,
      selector: (row) => {
        if (row.id === editingId) {
          return (
            <input
              type="text"
              value={row?.materialDescription}
              onChange={(e) => {
                const updatedCategory = {
                  ...row,
                  materialDescription: e.target.value,
                };
                setDetails((prevState) =>
                  prevState.map((item) =>
                    item.id === editingId ? updatedCategory : item
                  )
                );
              }}
            />
          );
        } else {
          return row.materialDescription;
        }
      },
      sortable: true,
    },
    {
      name: <strong>Category Name</strong>,
      selector: (row) => {
        if (row.id === editingId) {
          return (
            <input
              type="text"
              value={row?.categoryName}
              onChange={(e) => {
                const updatedCategory = {
                  ...row,
                  categoryName: e.target.value,
                };
                setDetails((prevState) =>
                  prevState.map((item) =>
                    item.id === editingId ? updatedCategory : item
                  )
                );
              }}
            />
          );
        } else {
          return row.categoryName;
        }
      },
      sortable: true,
    },
    {
      name: <strong>Action</strong>,
      cell: (row) => {
        if (row.id === editingId) {
          return (
            <button
              onClick={saveData}
              className="btn-team-edit btn-edit-category"
            >
              Save
            </button>
          );
        } else {
          return (
            <button
              onClick={() => handleEdit(row.id)}
              className="btn-team-edit btn-edit-category"
            >
              Edit
            </button>
          );
        }
      },
    },
  ];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpen(false);
    setShowPopup(false);
  };

  function handleEdit(id) {
    setEditingId(id);
  }

  const fetcher = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const { data, error, mutate } = useSWR(
    `${BASE_URL}/api/Category/Get`,
    fetcher
  );

  useEffect(() => {
    if (error) {
      console.error("Error fetching data", error);
    } else if (data) {
      setDetails(data);
      setFilteredDetails(data);
    }
  }, [data, error]);

  const [formData, setFormData] = useState([category]);

  const [message, setMessage] = useState("");

  function handleEdit(id) {
    setEditingId(id);
  }

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

  function saveData() {
    const headers = {
      headers: {
          'token' : localStorage.getItem("token")
      }
    };
    if (editingId) {
      const updatedCategory = details.find((item) => item.id === editingId);
      axios
        .put(`${BASE_URL}/api/Category/Put/${editingId}`, {
          categoryName: updatedCategory.categoryName,
          materialDescription: updatedCategory.materialDescription,
          pid: updatedCategory.pid,
        })
        .then((res) => {
          // setOpen(true);
          //setShowPopupAdded(true);
          mutate();
          setEditingId(null);
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            setShowPopup(true);
          } else {
            console.log(error.message);
          }
        });
    } else {
      axios
        .post(`${BASE_URL}/api/Category/Post`, category, headers, {
          withCredentials: true,
        })
        .then((res) => {
          let tempCategory = { ...category };

          Object.keys(tempCategory).forEach((e) => (e === 'id' ? tempCategory[e] = 0 : tempCategory[e] = ""));
          setCategory(tempCategory);
          setMessage(`Category "${res?.data?.categoryName}" added `);
          setShowPopup(true);
          mutate();
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            setShowPopup(true);
            setMessage(error.response.data);
          } else {
            console.log(error.message);
          }
        });
    }
  }

  useEffect(() => {
    console.log("Category Data", category);
  }, [category]);

  return (
    <>
      <header className="navbar">
        <NavbarComponent></NavbarComponent>
      </header>

      <>
        <div className="col-12">
          <div className="row">
            <span className="link-pages" style={{position:"relative", left:"0.3rem"}}>
              <Link to="/Home" className="urls">
                Home{" "}
              </Link>
              &#187;
            </span>
            <div className="col-6">
              <div className="headline">
                <strong style={{ fontSize: "30px", margin: "0.5rem", position:"relative", left:"0.3rem" }}>
                  PID
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/*form container */}
        <div className="">
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
                    open={showPopup}
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
                        <b>Add PID/SKU, Material Description and Category</b>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      placeholder="Enter PID/ SKU"
                      name="PID"
                      value={category?.pid}
                      id="pid"
                      label={
                        <span>
                          PID/SKU <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      onChange={(e) => {
                        setCategory({ ...category, pid: e.target.value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      placeholder="Enter Material Description"
                      name="Material Description"
                      id="materialDescription"
                      value={category?.materialDescription}
                      label={
                        <span>
                          Material Description
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      onChange={(e) => {
                        setCategory({
                          ...category,
                          materialDescription: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      placeholder="Enter Category"
                      name="Category Name"
                      id="categoryName"
                      value={category?.categoryName}
                      label={
                        <span>
                          Category Name <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      onChange={(e) => {
                        setCategory({
                          ...category,
                          categoryName: e.target.value,
                        });
                      }}
                    />
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

        {/* data table */}

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
                className="form-control search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></input>
            }
          />
        </div>
      </>
    </>
  );
};

export default Category;
