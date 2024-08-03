import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";

const PackageEdit = () => {
  const { packageId } = useParams();
  const [packageDetails, setPackageDetails] = useState({
    packageId,
    trackingId: "",
    date: new Date(),
    senderName: "",
    recieverName: "",
    
  });
  const [isEmptyField, setIsEmptyField] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchPackageDetails();
  }, [packageId]);

  const fetchPackageDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Package/getPackagesById/${packageId}`
      );
      console.log(response.data); // Check the response data in the console
      const packageData = response.data;
      setPackageDetails({
        ...packageData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    if (isFieldEmpty()) {
      setIsEmptyField(true);
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/Package/Put/${packageId}`,
        packageDetails
      );

      setIsUpdateSuccess(true);
      setIsEmptyField(false);
      // window.alert("information saved")
      setOpen(true)
    } catch (error) {
      console.log(error);
    }
  };

  const isFieldEmpty = () => {
    return (
      !packageDetails.trackingId ||
      !packageDetails.date ||
      !packageDetails.senderName ||
      !packageDetails.recieverName 
       
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
  const[open, setOpen] =useState(false);
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
          Edit Package
        </strong>
      </div>

      <div className="IContainer">
        <div className="innercontainer form-control">
          <div>
            <div className="form col-25">
              <label htmlFor="packageId">
              Shipment ID:
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
                  display: "inline"
                }}
                id="packageId"
                type="text"
                value={packageDetails.packageId}
                readOnly
              />
            </div>
            <div className="form col-25">
              <label htmlFor="trackingId">
                Tracking Id:<span className="compulsory"> *</span>
              </label>
              </div>
              <div className="col-75">
              <input
                style={{
                  width: "30rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  padding: "0.3rem",
                  display: "inline"
                }}
                id="trackingId"
                type="text"
                value={packageDetails.trackingId}
                onChange={(e) =>
                  setPackageDetails((prevDetails) => ({
                    ...prevDetails,
                    trackingId: e.target.value,
                  }))
                }
                className={isEmptyField && !packageDetails.trackingId ? "invalid" : "form-control"}
              />
              
            </div>
            <div className="form col-25">
              <label htmlFor="date">
                Date:
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
                  display: "inline"
                }}
                id="date"
                type="datetime2"
                value={packageDetails.date}
                readOnly
                onChange={(e) =>
                  setPackageDetails((prevDetails) => ({
                    ...prevDetails,
                    date: new Date(e.target.value),
                   
                  }))
                }
              />
            </div>
            <div className="form col-25">
              <label htmlFor="senderName">
                Sender's Name:<span className="compulsory"> *</span>
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
                  display: "inline"
                }}
                id="senderName"
                type="text"
                value={packageDetails.senderName}
                onChange={(e) =>
                  setPackageDetails((prevDetails) => ({
                    ...prevDetails,
                    senderName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="form col-25">
              <label htmlFor="receiverName">
                Receiver Name:<span className="compulsory"> *</span>
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
                  display: "inline"
                }}
                id="receiverName"
                type="text"
                value={packageDetails.recieverName}
                onChange={(e) =>
                  setPackageDetails((prevDetails) => ({
                    ...prevDetails,
                    recieverName: e.target.value,
                  }))
                }
              />
            </div>
            
          </div>
          <div className="button-class">
            {/* {isUpdateSuccess && (
              
            )} */}
            <button className="btn" style={{width: "100%",}} onClick={handleSave}>Save</button>
          </div>
          {/* {isEmptyField && (
            window.alert("please enter all the field")
          )} */}
          {/* {!packageDetails.trackingId && 
          window.alert("please enter the trackingID")} */}
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
      <style>
        {`
        .invalid {
          border: 2px solid red;
        }
        
        .error-message {
          color: red;
         
          display: flex;
          justify-content: flex;
          align-self:baseline ;
          margin-top: 1rem;
        }
        
        .IContainer {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .form {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .form span {
          margin-right: 1rem;
        }
        
        .button-class {
          display: flex;
          justify-content: flex-end;
          align-self:flex-end ;
          margin-top: 1rem;
        }
        
        .button-class button {
          margin-left: 1rem;
        }
        
        .success-message {
          color: green;
        }
        `}
      </style>
    </>
  );
};

export default PackageEdit;
