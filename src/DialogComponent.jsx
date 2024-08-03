import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DialogComponent = ({ isOpen, title, subtitle, handleClose, navigatePath }) => {
  //   const [finishStatus, setfinishStatus] = useState(false);
  //   const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate(); 

  const handleExitAndNavigate = () => {
    handleClose(); 
    navigate(navigatePath);
  }
  
  return (
    <div className="">
      <Dialog open={isOpen} onClose={() => handleClose()}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {subtitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleExitAndNavigate()} autoFocus>
            Yes
          </Button>
          <Button onClick={() => handleClose()}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogComponent;
