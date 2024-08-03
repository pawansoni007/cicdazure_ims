
import React from "react";
import { Grid, Typography, TextField } from "@mui/material";

const FormComponent = ({ componentData, handleInputChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid container sx={{ display: "flex", alignItems: "center" }}>
        <pre></pre>
        {/* <Grid item>
          <Typography sx={{ marginLeft: "20px" }}>
            <b>Asset</b>
          </Typography>
        </Grid> */}
      </Grid>
      <Grid item xs={2}>
        <TextField
          id="pid"
          value={componentData.pid}
          onChange={(event) => handleInputChange("pid", event)}
          label="PID *"
        />
      </Grid>

      <Grid item xs={2}>
        <TextField
          id="materialDescription"
          required
          value={componentData.materialDescription}
          onChange={(event) => handleInputChange("materialDescription", event)}
          label="Material Description"
        />
      </Grid>

      <Grid item xs={2}>
        <TextField
          id="teamName"
          value={componentData.teamName}
          onChange={(event) => handleInputChange("teamName", event)}
          label="Team Name *"
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          id="managerEmail"
          required
          value={componentData.managerEmail}
          onChange={(event) => handleInputChange("managerEmail", event)}
          label="Manager Email"
        />
      </Grid>
      {/* <Grid item xs={1.5}>
        <TextField
          placeholder="Shipment ID"
          disabled
          value={componentData.packageID}
          label="Shipment ID"
        />
      </Grid> */}
      <Grid item xs={1.5}>
        <TextField
          id="category"
          required
          value={componentData.category}
          onChange={(event) => handleInputChange("category", event)}
          label="Category"
        />
      </Grid>
    </Grid>
  );
};

export default FormComponent;

