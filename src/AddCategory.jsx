import axios from "axios";
import { useState, useEffect } from "react";
import PopupComponent from "./PopupComponent";
import DataTable from "react-data-table-component";
import useSWR from "swr";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";

const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const AddCategory = () => {
  const { data, error, mutate } = useSWR(
    `${BASE_URL}/api/Category/Get`,
    fetcher
  );

  //category table schema
  const [category, setCategory] = useState({
    id: 0,
    categoryName: "",
    materialDescription: "",
    pid: "",
  });

  const [search, setSearch] = useState("");
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupAdded, setShowPopupAdded] = useState(false);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpen(false);
    setShowPopup(false);
  };
  useEffect(() => {
    if (error) {
      console.error("Error fetching data", error);
    } else if (data) {
      setDetails(data);
      setFilteredDetails(data);
    }
  }, [data, error]);
  function saveData() {
    if (editingId) {
      const updatedCategory = details.find((item) => item.id === editingId);
      axios
        .put(`${BASE_URL}/api/Category/Put/${editingId}`, {
          categoryName: updatedCategory.categoryName,
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
        .post(`${BASE_URL}/api/Category/Post`, category, {
          withCredentials: true,
        })
        .then((res) => {
          let tempCategory = { ...category };

          Object.keys(tempCategory).forEach((e) => (tempCategory[e] = ""));
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
    const result = details.filter((detail) => {
      return detail.categoryName.toLowerCase().match(search.toLowerCase());
    });
    setFilteredDetails(result);
  }, [search, details]);
  const columns = [
    {
      name: <strong>Category ID</strong>,
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: <strong>Category Name</strong>,
      selector: (row) => {
        if (row.id === editingId) {
          return (
            <input
              type="text"
              value={row.categoryName}
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
  return (
    <>
      <header className="navbar">
        <NavbarComponent>Inventory Management System</NavbarComponent>
      </header>
      <span className="link-pages">
        <Link to="/Home" className="urls">
          Home{" "}
        </Link>
        &#187;
      </span>
      <div className="container col-12">
        <div className="row" style={{ marginTop: "20px" }}>
          <strong
            className="col-4"
            style={{ fontSize: "28px", paddingRight: "20px", color: "#08338f" }}
          >
            Category
          </strong>
          <div className="col-8">
            <div className="category-form">
              <label>
                <strong style={{ marginRight: "12px" }}>Category name:</strong>
              </label>
              <input
                className="inp form-control"
                style={{
                  width: "17rem",
                  borderRadius: "0.5rem",
                  padding: "0.3rem",
                  display: "inline",
                }}
                type="text"
                name="name"
                value={category.categoryName}
                onChange={(e) => {
                  setCategory({ ...category, categoryName: e.target.value });
                }}
              />
            </div>
            <div className="category-add-btn">
              <div
                className="category-add-div"
                style={{
                  marginLeft: "101px",
                }}
              >
                <button
                  style={{
                    width: "50%",
                    padding: "7px",
                    marginLeft: "-3px",
                    borderRadius: "11px",
                    paddingTop: "6px",
                  }}
                  className="btn category-save-btn"
                  type="submit"
                  onClick={function (event) {
                    saveData();
                  }}
                >
                  Save
                </button>
              </div>
              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={showPopup}
                message={message}
                autoHideDuration={4000}
                onClose={handleClose}
                action={action}
              />
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
              placeholder="Search category..."
              className="form-control search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></input>
          }
        />
      </div>
    </>
  );
};

export default AddCategory;
