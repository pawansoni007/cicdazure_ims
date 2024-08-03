import React, { useState } from "react";
import Dropzone from "react-dropzone";
import * as XLSX from "xlsx";
import axios from "axios";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./App.css";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";
import Table from "./ImportExcel";
import { UseDataContext } from "./DataContext";
import {
  Category,
  ManagerDescription,
  ManagerEmail,
  Pid,
  SerialNo,
  Status,
  TeamName,
} from "./AddNewPackage";

const FileUpload = () => {
  // const [packageId] = useState();
  const addNewPakage = {
    serial: <SerialNo />,
    category: <Category />,
    managerEmail: <ManagerEmail />,
    materialDescription: <ManagerDescription />,
    pid: <Pid />,
    teamName: <TeamName />,
    status: <Status />,
  };
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [tableData, setTableData] = useState([addNewPakage]);
  const [editedData, setEditedData] = useState([]);
  const [message, setMessage] = useState("");
  const data = UseDataContext();
  const [newPackage, setNewPackage] = useState({
    serial: "",
    category: "",
    managerEmail: "",
    materialDescription: "",
    pid: "",
    teamName: "",
    status: "",
  });
  const handleAddComponent = () => {
    if (
      data.serialNo.length > 0 &&
      data.pidData.length > 0 &&
      data.materailDescription.length > 0 &&
      data.category.length > 0 &&
      data.status.length > 0
    ) {
      const newData = {
        serial: data.serialNo,
        pid: data.pidData,
        materialDescription: data.materailDescription,
        managerEmail: data.managerEmail,
        teamName: data.teamName,
        category: data.category,
        status: data.status,
      };
      const a = Boolean(
        tableData.find(
          (val) =>
            val.serial.toString().toLowerCase() ===
            data.serialNo.toString().toLowerCase()
        )
      );
      if (!a) {
        setTableData((p) => {
          return [...p, newData];
        });
      } else {
        setMessage("Serial No. already exists!");
        setShowPopupAdded(true);
      }
      data.reset();
      setNewPackage({
        serial: "",
        category: "",
        managerEmail: "",
        materialDescription: "",
        pid: "",
        teamName: "",
        status: "",
      });
    }
  };
  // const [tableData,setTableData]=useState([])
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpen(false);
    setShowPopupAdded(false);
  };
  const [showPopupAdded, setShowPopupAdded] = useState(false);

  //to take the provided file by dropped file
  const DropFile = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      //checking whether the recevied file is excel file or not
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
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      //conversion to json format
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      //flag
      setTableData(jsonData);
      setEditedData(new Array(jsonData.length).fill(false));
    };
    reader.readAsBinaryString(file);
  };
  //to enable row-wise editing
  const handleEditRow = (rowIndex) => {
    const updatedEditedData = [...editedData];
    updatedEditedData[rowIndex] = true;
    setEditedData(updatedEditedData);
  };
  //saving the edited data
  const handleSaveRow = (rowIndex) => {
    try {
      //updateRow to store editedrowkadata
      const updatedRow = tableData[rowIndex + 1].map((cell, cellIndex) => {
        if (cellIndex === 0) {
          return cell; // ye field k header ko ignore karne k liye
        } else {
          return tableData[rowIndex + 1][cellIndex]; // ye baki rows k liye jaha edit action dena hai
        }
      });

      const updatedTableData = [...tableData];
      updatedTableData[rowIndex + 1] = updatedRow;

      setTableData(updatedTableData);
      //flag
      const updatedEditedData = [...editedData];
      updatedEditedData[rowIndex + 1] = false;
      setEditedData(updatedEditedData); //full edited + non edited data passing

      //alert("Row data saved!");
      setEditedData([]);
    } catch (error) {
      setMessage("Error occurred while saving the row data.");
    }
  };

  //to structure the edited and non edited data for passing to api
  const handleUpload = async () => {
    try {
      console.log("hii from me");
      console.log(tableData);
      // const allDataToUpload = tableData
      //   .slice(1) //first header row skip
      //   .map((row) => {
      //     return {
      //       PID: row[1].toString(),
      //       MaterialDescription: row[2].toString(),
      //       ManagerEmail: row[3].toString(),
      //       TeamName: row[4].toString(),
      //       Category: row[5].toString(),
      //       packageId: 0,
      //       SerialNo: row[0].toString(),
      //       Status: row[6].toString(),
      //     };
      //   });
      const allDataToUpload = tableData.slice(1).map((record) => {
        return {
          serialNo: record.serial.toString(),
          pid: record.pid,
          materialDescription: record.materialDescription,
          managerEmail: record.managerEmail,
          teamName: record.teamName,
          packageID: 0,
          category: record.category,
          status: record.status.toString(),
        };
      });

      // const jsonData = JSON.stringify(allDataToUpload);
      // passing to upload in backend
      await UploadFile(allDataToUpload);
      //console.log("All data uploaded:", allDataToUpload);
      //alert("All data uploaded successfullyyy!");
    } catch (error) {
      console.error("Error uploading data:", error);
      setMessage("Invalid Excel file!");
      setShowPopupAdded(true);
    }
  };

  //backend upload
  const UploadFile = async (jsonData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Component/importExcelwithEdit`,
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          withCredentials: true,
        }
      );

      setMessage("Components added successfully!");
      setShowPopupAdded(true);
      resetState();
    } catch (error) {
      console.error("Error uploading data:", error);
      setShowPopupAdded(true);
    }
  };

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

  // to reset everything
  const resetState = () => {
    setFile(null);
    setFileName("");
    setTableData([addNewPakage]);
    setEditedData([]);
  };

  //template for importing components
  const handleOnExport = () => {
    var data = [
      [
        "ComponentId",
        "PID",
        "MaterialDescription",
        "ManagerEmail",
        "TeamName",
        "Category",
      ],
    ];
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push("Asset_Template");
    wb.Sheets["Asset_Template"] = XLSX.utils.aoa_to_sheet(data);
    XLSX.writeFile(wb, "Asset_Template.xlsx");
  };

  return (
    <>
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
            <Link to="/addExistingComponent" className="urls inner-url">
              Import Bulk Asset{" "}
            </Link>
            &#187;
          </span>

          <div style={{ width: "100%" }}>
            <div style={{ margin: "2rem 5rem " }}>
              <Table
                packageId={0}
                handleSubmit={handleUpload}
                tableData={tableData}
                setTableData={setTableData}
                handleAddComponent={handleAddComponent}
                AddNewPakage={addNewPakage}
                flag={true}
              />
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={showPopupAdded}
        message={message}
        autoHideDuration={4000}
        onClose={handleClose}
        action={action}
      />
    </>
  );
};
export default FileUpload;
