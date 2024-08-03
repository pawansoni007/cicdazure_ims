import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";

const ChangePassword = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopupAdded, setShowPopupAdded] = useState(false);
  const [isChangedSuccessfully, setIsChangedSuccessfully] = useState(false); 

  const navigate = useNavigate();
  const handleClose = (event, reason) => {
    if (reason === "clickaway" && isChangedSuccessfully) {
      navigate("/");
      return;
    }
    if(isChangedSuccessfully)
      navigate("/");
    setOpen(false);
  };

  const [passwordChange, setPasswordChange] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState("");

  const handlePassword = async () => {
    try {
      delete passwordChange?.confirmPassword;
      await axios
        .post(`${BASE_URL}/api/Auth/ChangePassword`, passwordChange, {
          headers: { 
            "Content-Type": "application/json" ,
            "token" : localStorage.getItem("token"),
            "memberId" : localStorage.getItem("memberId"),
          },
        })
        .then((response) => {
          setShowPopupAdded(true);
          setMessage(`Password Changed Successfully!`);
          let tempChangePassword = { ...passwordChange };
          Object.keys(tempChangePassword).forEach(
            (e) => (tempChangePassword[e] = "")
          );
          setPasswordChange(tempChangePassword);
          setIsChangedSuccessfully(response.data?.isChangePasswordSuccessful);
        });
    } catch (error) {
      setShowPopupAdded(true);
      setMessage(`Please fill the fields correctly`);
      let tempChangePassword = { ...passwordChange };
      Object.keys(tempChangePassword).forEach(
        (e) => (tempChangePassword[e] = "")
      );
      setPasswordChange(tempChangePassword);
      console.log("ERROR", error);
    }
  };

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
    <div>
      {/* Heading */}
      <header className="navbar">
        <NavbarComponent></NavbarComponent>
      </header>
      <div className="col-12">
        <div className="row">
          <span className="link-pages">
            <Link to="/Home" className="urls">
              Home{" "}
            </Link>
            &#187;
          </span>
          <div className="col-6">
            <div className="headline">
              <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
                Change Password
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="IContainer">
        <div className="login-form form-control">
          <div className="team-add">
            <div className="row">
              <div className="col-35">
                <label>
                  <strong>
                    Old Password:<span className="compulsory"> *</span>
                  </strong>
                </label>
              </div>

              <div className="col-65">
                <input
                  className="inp form-control"
                  value={passwordChange?.currentPassword}
                  onChange={(e) =>
                    setPasswordChange({
                      ...passwordChange,
                      currentPassword: e.target.value,
                    })
                  }
                  style={{
                    width: "18rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="password"
                  name="password"
                  required
                />
                <i class="far fa-eye" id="togglePassword"></i>
              </div>
            </div>
            <div className="row">
              <div className="col-35">
                <label>
                  <strong>
                    New Password:<span className="compulsory"> *</span>
                  </strong>
                </label>
              </div>

              <div className="col-65">
                <input
                  className="inp form-control"
                  value={passwordChange?.newPassword}
                  onChange={(e) =>
                    setPasswordChange({
                      ...passwordChange,
                      newPassword: e.target.value,
                    })
                  }
                  style={{
                    width: "18rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="password"
                  name="password"
                  required
                />
                <i class="far fa-eye" id="togglePassword"></i>
              </div>
            </div>
            <div className="row">
              <div className="col-35">
                <label>
                  <strong>
                    Confirm Password:<span className="compulsory"> *</span>
                  </strong>
                </label>
              </div>

              <div className="col-65">
                <input
                  className="inp form-control"
                  value={passwordChange?.confirmPassword}
                  onChange={(e) => {
                    setPasswordChange({
                      ...passwordChange,
                      confirmPassword: e.target.value,
                    });
                    if (passwordChange?.newPassword !== e.target.value)
                      setFormError("Password doesn't match");
                    else setFormError(false);
                  }}
                  style={{
                    width: "18rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="password"
                  name="password"
                  required
                />
                {formError && <p style={{ color: "red" }}>{formError}</p>}
              </div>
            </div>
            <div
              className="row"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button
                style={{ width: "45%" }}
                className="btn"
                type="submit"
                onClick={handlePassword}
              >
                Change Password
              </button>
            </div>
          </div>

          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={showPopupAdded}
            message={message}
            autoHideDuration={3000}
            onClose={handleClose}
            action={action}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
