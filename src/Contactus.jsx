import { Link } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import { Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

const Contactus = () => {
    
  const [open, setOpen] = useState(false);
  const [showPopupAdded, setShowPopupAdded] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
                Support
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="IContainer">
        <div className="login-form form-control" style={{width: "35%"}}>
          <div className="team-add">
            <div className="row">
              <div className="col-35">
                <label>
                  <strong>
                    Name:
                  </strong>
                </label>
              </div>

              <div className="col-65">
                <input
                  className="inp form-control"
                  style={{
                    width: "18rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  id="fname"
                  name="firstname"
                  placeholder="Your first name.."
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-35">
                <label>
                  <strong>
                    Email:
                  </strong>
                </label>
              </div>

              <div className="col-65">
                <input
                  className="inp form-control"
                  style={{
                    width: "18rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email.."
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-35">
                <label>
                  <strong>
                    Message:
                  </strong>
                </label>
              </div>

              <div className="col-65">
                <textarea
                  className="inp form-control"
                  style={{
                    width: "18rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  id="message"
                  name="message"
                  placeholder="Enter Message here.."
                  required
                />
              </div>
            </div>
            <div
              className="row"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button style={{ width: "45%" }} className="btn" type="submit">
                Send
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

export default Contactus;
