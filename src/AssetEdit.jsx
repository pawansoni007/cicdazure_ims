import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";
import { handleNamechange } from "./Apackage";

const AssetEdit = () => {
  const { componentId } = useParams();
  const [componentDetails, setcomponentDetails] = useState({
    componentId,
    pid: "",
    materialDescription: new Date(),
    managerEmail: "",
    teamName: "",
    category: "",
    serialNo: "",
    status:"",
  });

  //for category drop down
  const [options, setOptions] = useState([]);
  useEffect(() => {
    // Fetch options from the API and set them in the state
    fetch(`${BASE_URL}/api/Category/GetAllCategoryName`)
      .then((response) => response.json())
      .then((data) => setOptions(data));
  }, []);

  const handleCategoryChange = (e) => {
    setcomponentDetails((prevDetails) => ({
      ...prevDetails,
      category: e.target.value,
    }));
  };

  //category Drpdown

  // const [data, setData] = useState([]);
  {
    /*useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/Category/GetAllCategoryName`
        )
          .then((resp) => resp.json())
          .then(setData);
        console.log("yo bro", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);*/
  }
  //

  const [isEmptyField, setIsEmptyField] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  const fetchComponentDetails = async (componentId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Component/GetById/getById?id=${componentId}`
      );

      // Check the response data in the console
      const componentData = await response.data;
      console.log(componentData);
      setcomponentDetails({
        ...componentData,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchComponentDetails(componentId);
  }, []);
  const navigate = useNavigate();
  const handleSave = async () => {
    if (isFieldEmpty()) {
      setIsEmptyField(true);
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/Component/UpdateComponents/${componentId}`,
        componentDetails
      );

      setIsUpdateSuccess(true);
      setIsEmptyField(false);
      setOpen(true);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const isFieldEmpty = () => {
    return (
      !componentDetails.category ||
      !componentDetails.managerEmail ||
      !componentDetails.materialDescription ||
      !componentDetails.pid ||
      !componentDetails.teamName
    );
  };
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

  return (
    <>
      {/* Heading */}
      <header className="navbar">
        <NavbarComponent></NavbarComponent>
      </header>
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
      <div className="headline">
        <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
          Edit Asset
        </strong>
      </div>

      <div className="IContainer">
        <div className="innercontainer form-control">
          <div>
            <div className="form col-25">
              <label>
                <strong>
                  PID:<span className="compulsory"> *</span>
                </strong>
              </label>
            </div>
            <div className="col-75">
              <input
                className="form-control"
                style={{
                  width: "30rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  padding: "0.3rem",
                  display: "inline",
                }}
                id="pid"
                type="text"
                value={componentDetails.pid}
                //readOnly
                onChange={(e) =>
                  setcomponentDetails((prevDetails) => ({
                    ...prevDetails,
                    pid: handleNamechange(e.target.value),
                  }))
                }
              />
            </div>

            <div className="form col-25">
              <label>
                <strong>
                  Manager Email:<span className="compulsory"> *</span>
                </strong>
              </label>
            </div>
            <div className="col-75">
              <input
                className="form-control"
                style={{
                  width: "30rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  padding: "0.3rem",
                  display: "inline",
                }}
                id="managerEmail"
                value={componentDetails.managerEmail}
                onChange={(e) =>
                  setcomponentDetails((prevDetails) => ({
                    ...prevDetails,
                    managerEmail: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form col-25">
              <label>
                <strong>
                  Material Description:<span className="compulsory"> *</span>
                </strong>
              </label>
            </div>
            <div className="col-75">
              <input
                className="form-control"
                style={{
                  width: "30rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  padding: "0.3rem",
                  display: "inline",
                }}
                id="materialDescription"
                type="text"
                value={componentDetails.materialDescription}
                onChange={(e) =>
                  setcomponentDetails((prevDetails) => ({
                    ...prevDetails,
                    materialDescription: handleNamechange(e.target.value),
                  }))
                }
              />
            </div>

          <div className="form col-25">
              <label>
                <strong>
                 Serial No.:<span className="compulsory"> *</span>
                </strong>
              </label>
            </div>
            <div className="col-75">
              <input
                className="form-control"
                style={{
                  width: "30rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  padding: "0.3rem",
                  display: "inline",
                }}
                id="serialNo"
                type="text"
                value={componentDetails.serialNo}
                onChange={(e) =>
                  setcomponentDetails((prevDetails) => ({
                    ...prevDetails,
                    serialNo: handleNamechange(e.target.value),
                  }))
                }
              />
            </div>            
            
            <div className="form col-25">
              <label>
                <strong>
                Status:<span className="compulsory"> *</span>
                </strong>
              </label>
            </div>
            <div className="col-75">
              <input
                className="form-control"
                style={{
                  width: "30rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  padding: "0.3rem",
                  display: "inline",
                }}
                id="status"
                type="text"
                value={componentDetails.status}
                onChange={(e) =>
                  setcomponentDetails((prevDetails) => ({
                    ...prevDetails,
                    status: handleNamechange(e.target.value),
                  }))
                }
              />
            </div>            

            <div className="form col-25">
              <label>
                <strong>
                  Category:<span className="compulsory"> *</span>
                </strong>
              </label>
            </div>
            <div className="col-75">
              {/* <input 
              list="browsers" 
              name="browser" 
              id="browser"
              value={componentDetails.category}
              onChange={handleCategoryChange} />

              <datalist  id="browsers">
                {options.map((option, key) => (
                  <option key={key} value={option} />
                ))}
              </datalist>  */}

              <select
                style={{
                  width: "30rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  padding: "0.3rem",
                  display: "inline",
                }}
                id="category"
                value={componentDetails.category}
                onChange={handleCategoryChange}
              >
                {options.map((option, key) => (
                  <option key={key} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-class">
              <button
                className="btn"
                style={{ width: "15%", marginLeft: "650px", marginTop: "15px" }}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        message="Successfully Edited!"
        autoHideDuration={4000}
        onClose={handleClose}
        action={action}
      />
    </>
  );
};

export default AssetEdit;
