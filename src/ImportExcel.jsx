import React, { useState } from "react";
import Dropzone from "react-dropzone";
import * as XLSX from "xlsx";
import axios from "axios";
import { Snackbar, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { BASE_URL } from "./Constants";
import { Stack } from "@mui/material";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import ReactDataGrid from "react-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import { UseDataContext } from "./DataContext";
import { useEffect } from "react";
import FastForwardIcon from "@mui/icons-material/FastForward";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
const FileUpload = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allow, setAllow] = useState(true);

  const columns = [
    {
      key: "serial",
      name: "Serial No",
    },
    {
      key: "pid",
      name: "PID",
    },
    {
      key: "materialDescription",
      name: "Material Description",
    },
    {
      key: "category",
      name: "Category",
    },
    {
      key: "teamName",
      name: "Team Name",
    },
    {
      key: "managerEmail",
      name: "Manager Email",
    },
    {
      key: "status",
      name: "Status",
    },
  ];

  const {
    packageId,
    handleSubmit,
    tableData,
    setTableData,
    handleAddComponent,
    AddNewPakage,
    flag,
  } = props;
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    axios.get(`${BASE_URL}/api/Team/teamNames`).then((res) => {
      setTeams(res.data);
    });
  }, []);
  const { reset } = UseDataContext();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [editedData, setEditedData] = useState([]);
  const [message, setMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowPopupAdded(false);
  };

  const [showPopupAdded, setShowPopupAdded] = useState(false);

  const handleInputChange = (rowIndex, cellIndex, event) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][cellIndex] = event.target.value;
    setTableData(updatedTableData);
  };

  //Template for downloading template
  const handleOnExport = () => {
    var data = [
      [
        "ComponentId",
        "SerialNo",
        "PID",
        "MaterialDescription",
        "Category",
        "TeamName",
        "ManagerEmail",
        "Status",
      ],
    ];
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push("Asset_Template");
    wb.Sheets["Asset_Template"] = XLSX.utils.aoa_to_sheet(data);
    XLSX.writeFile(wb, "Asset_Template.xlsx");
  };

  //to take the provided file by dropped file
  const DropFile = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const validFileExtension = [".xlsx", ".xls"];
      const isValidFileExtension = validFileExtension.some((type) =>
        selectedFile.name.endsWith(type)
      );
      if (!isValidFileExtension) {
        setMessage(
          "Invalid file Extension Type! Please upload an Excel file (.xlsx or .xls)."
        );
        setShowPopupAdded(true);
        return;
      }
      setFileName(selectedFile.name);
      Excel(selectedFile);
    }
  };
  //go through the excel file and convert to into table form
  const Excel = (file) => {
    try {
      const serialNumbers = [];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON format
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // excel header
        const headers = jsonData[0];

        // array to store all the records
        const records = [];

        //for row
        for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
          const record = {};
          // for column
          for (let cellIndex = 0; cellIndex < headers.length; cellIndex++) {
            const header = headers[cellIndex];
            const cellValue = jsonData[rowIndex][cellIndex];

            if (header === "PID") {
              record.pid = cellValue.toString();
            } else if (header === "MaterialDescription") {
              record.materialDescription = cellValue.toString();
            } else if (header === "ManagerEmail") {
              record.managerEmail = cellValue.toString();
            } else if (header === "TeamName") {
              if (
                teams.includes(
                  cellValue.toString().toUpperCase() ||
                    teams.includes(cellValue.toString().toLowerCase())
                )
              ) {
                record.teamName = cellValue.toString();
              } else {
                record.teamName = cellValue.toString();
                setAllow(false);
                setMessage("Invalid team names included in EXCEL.");
                setShowPopupAdded(true);
              }
            } else if (header === "Category") {
              record.category = cellValue.toString();
            } else if (header === "SerialNo") {
              //duplicate value while insertingthe file with duplicate value it's not showing the one more duplicate one value.
              if (!serialNumbers.includes(cellValue.toString())) {
                serialNumbers.push(cellValue.toString());
                record.serial = cellValue.toString();
              } else {
                record.serial = cellValue.toString();
                setAllow(false);
                setMessage(
                  `One or more duplicate serial numbers found in excel! Please validate the file before uploading.` 
                );
                setShowPopupAdded(true);
              }
              // record.serial = cellValue; --this is to entering the data for pushing it to databse
              // record.serial = cellValue; --this is to entering the data for pushing it to databse

              // record.serial = cellValue; --this is to entering the data for pushing it to databse
            } else if (header === "Status") {
              record.status = cellValue.toString();
            }
          }
          records.push(record);
        }
        records.packageID = packageId;
        // set the records in tableData
        setTableData((p) => {
          return [...p, ...records];
        });
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      alert("duplicated found");
    }
  };

  //to upload in database
  const handleUpload = async () => {
    if (allow) {
      try {
        const res = await handleSubmit();

        const updatedTableData = tableData.slice(1).map((record) => {
          return {
            serialNo: record.serial.toString(),
            pid: record.pid,
            materialDescription: record.materialDescription,
            managerEmail: record.managerEmail,
            teamName: record.teamName,
            packageID: res.data.packageId,
            category: record.category,
            status: record.status.toString(),
          };
        });

        await UploadFile(updatedTableData, res.data.packageId);
        resetState();
        reset();
      } catch (error) {
        resetState();
        console.error("Error uploading data:", error);
        setMessage("Error uploading data.");
      }
    }
  };
  const getHeight = (number) => {
    if (number < 2) {
      return 70;
    } else if (number < 5) {
      return 150;
    } else {
      return 350;
    }
  };

  //backend upload
  const UploadFile = async (updatedTableData, packageId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Component/importExcelwithEdit?packageId=${packageId}`,
        updatedTableData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setMessage("Components added successfully!");
      setShowPopupAdded(true);
    } catch (error) {
      console.error("Error uploading data:", error);
      setMessage(
        "Invalid Excel file imported! Please import the correct Excel file!"
      );
      setShowPopupAdded(true);
    }
  };

  // to reset everything
  const resetState = () => {
    setFile(null);
    setFileName("");
    setTableData([AddNewPakage]);
    setEditedData([]);
  };

  return (
    <div>
      <Stack
        sx={{ position: "relative", top: "25px" }}
        direction="row"
        justifyContent={"space-between"}
        spacing={0}
      >
        {flag && (
          <div className="col-6">
            <div className="headline2">
              <strong style={{ fontSize: "30px" }}>Add Asset</strong>
            </div>
          </div>
        )}
        {/* //do not remove this */}
        {!flag && <div></div>}
        <div style={{ display: "flex", gap: "1rem" }}>
          {" "}
          <Dropzone onDrop={DropFile} acceptedFiles=".xlsx">
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button
                  startIcon={<UploadFileOutlinedIcon />}
                  style={{
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    fontSize: "16px",
                    marginBottom: "10px",
                    textTransform: "none",
                  }}
                >
                  Import Asset Details
                </Button>
                {fileName && (
                  <p style={{ fontSize: "14px" }}>Selected File: {fileName}</p>
                )}
              </div>
            )}
          </Dropzone>
          <Button
            variant="contained"
            type="submit"
            onClick={handleOnExport}
            startIcon={<SimCardDownloadOutlinedIcon />}
            style={{
              // border: "1px solid #1976d2",
              // color: "white",
              backgroundColor: "#082E81",
              fontSize: "16px",
              marginBottom: "20px",
              width: "15rem",
              height: "2.6rem",
              textTransform: "none",
            }}
          >
            Download Template
          </Button>
        </div>
      </Stack>

      <div className="containers" style={{ marginTop: "20px" }}>
        <ReactDataGrid
          minHeight={getHeight(tableData.slice(0, tableData.length).length)}
          columns={columns}
          rowGetter={(i) => {
            return tableData
              .slice(0, tableData.length)
              .slice((currentPage - 1) * 10, currentPage * 10)[i];
          }}
          rowsCount={
            tableData
              .slice(0, tableData.length)
              .slice((currentPage - 1) * 10, currentPage * 10).length
          }
        />
        <div className="containerDiv">
          <IconButton
            style={{ margin: "0", padding: "0" }}
            onClick={() => setCurrentPage(1)}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
          <IconButton
            style={{ margin: "0", padding: "0" }}
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <p style={{ marginTop: "1rem" }}>{currentPage}</p>
          <IconButton
            style={{ margin: "0", padding: "0" }}
            onClick={() => {
              if (Math.ceil(tableData.length / 10) > currentPage)
                setCurrentPage(currentPage + 1);
            }}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
          <IconButton
            style={{ margin: "0", padding: "0" }}
            onClick={() => {
              let a = Math.ceil(
                tableData.slice(1, tableData.length).length / 10
              );
              let b = a === 0 ? 1 : a;
              setCurrentPage(b);
            }}
          >
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={showPopupAdded}
        message={message}
        autoHideDuration={4000}
        onClose={handleClose}
        action={
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
        }
      />

      <Stack
        //sx={{ position: "relative", top: "25px" }}
        direction="row"
        spacing={2}
      >
        <Button
          onClick={handleAddComponent}
          variant="outlined"
          startIcon={<AddOutlinedIcon />}
          style={{
            textTransform: "none", 
            fontSize: "16px", 
            marginBottom: "10px"
          }}
        >
          Add More
        </Button>
        <Button
          disabled={!allow}
          onClick={flag === true ? handleSubmit : handleUpload}
          variant="contained"
          endIcon={<SendIcon />}
          style={{
            textTransform: "none", 
            fontSize: "16px", 
            marginBottom: "10px"
          }}
        >
          Submit
        </Button>
      </Stack>
    </div>
  );
};
export default FileUpload;
