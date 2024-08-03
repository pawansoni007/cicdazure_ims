import React, { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { handleNamechange } from "./Apackage";
import { BASE_URL } from "./Constants";


const AssignComponent = () => {
  //to check whether the component is present or not in component table
  const [componentPresent, setComponentPresent] = useState(false);
  const componentId = useRef(0);
  const memberName = useRef("");
  const memberEmail = useRef("");
  const materialDescription = useRef("");
  //to manage state of inputs
  const [assign, setAssign] = useState({
    componentID: "",
    date: "",
    materialDescription: "",
    memberName: "",
    memberEmail: "",
    projectName: "",
    location: "",
  });

  //to show success message if component is assigned successfully
  const [showPopupAdded, setShowPopupAdded] = useState(false);

  //to show error is any error occured
  const [err, setErr] = useState(false);

  //for email autofill
  const [emails, setEmails] = useState([]);

  //saving data
  function saveData(e) {
    e.preventDefault();
    if (componentPresent)
      axios
        .post(`${BASE_URL}/api/AssignComponent`, {
          componentID: componentId.current.value,
          date: assign.date,
          materialDescription: materialDescription.current.value,
          memberName: memberName.current.value,
          memberEmail: memberEmail.current.value,
          projectName: assign.projectName,
          location: assign.location,
        })
        .then(() => {
          setShowPopupAdded(true);
        })
        .catch(() => {
          setErr(true);
        });
  }

  //axios call for auto fill of mail

  const getEmail = () => {
    const val = memberName.current.value;
    setAssign({
      ...assign,
      memberName: val,
    });
    axios
      .get(`${BASE_URL}/api/Member/getbyname/${val}`)
      .then((res) => {
        setEmails(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getComponentDetails = () => {
    const id = parseInt(componentId.current.value);
    setAssign({
      ...assign,
      componentID: id,
    });
    if (id > 0) {
      axios
        .get(
          `${BASE_URL}/api/Component/check/checkForPresenceOfTheComponent?id=${id}`
        )
        .then((res) => {
          setComponentPresent(res.data);
          if (res.data) {
            axios
              .get(
                `${BASE_URL}/api/Component/GetById/getById?id=${id}`
              )
              .then((res) => {
                setAssign((p) => {
                  return {
                    ...p,
                    materialDescription: res?.data?.materialDescription,
                  };
                });
              });
          } else {
            setAssign((p) => {
              return { ...p, materialDescription: "" };
            });
          }
        });
    }
  };

  return (
    <>
      <h1 className="pageTitle">Inventory Management System</h1>
      <body>
        <div className="IContainer">
          <div className="innercontainer">
            <form onSubmit={saveData} className="assign-component">
              {componentId.current.value > 0 && !componentPresent && (
                <span style={{ color: "red" }}>please enter valid Id !</span>
              )}

              <div>
                <label style={{ marginRight: "6rem" }}>
                  <strong>Component ID: </strong>
                </label>

                <input
                  ref={componentId}
                  className="inp"
                  style={{
                    width: "30rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                  }}
                  type="number"
                  name="name"
                  min={0}
                  value={assign.componentID}
                  onChange={(e) => {
                    getComponentDetails(e);
                  }}
                />
              </div>

              <div>
                <label style={{ marginRight: "3.5rem" }}>
                  <strong>Material Description:</strong>
                </label>

                <input
                  ref={materialDescription}
                  className="inp"
                  style={{
                    width: "30rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                  }}
                  required
                  type="text"
                  name="name"
                  value={assign.materialDescription}
                  disabled
                />
              </div>

              <div>
                <label style={{ marginRight: "6rem" }}>
                  <strong>Member Name:</strong>
                </label>

                <input
                  ref={memberName}
                  required
                  className="inp"
                  style={{
                    width: "30rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                  }}
                  type="text"
                  name="name"
                  value={assign.memberName}
                  onChange={(e) => {
                    getEmail(e);
                  }}
                />
              </div>

              <div>
                <label style={{ marginRight: "6rem" }}>
                  <strong>Member Email:</strong>
                </label>

                <select
                  ref={memberEmail}
                  required
                  className="inp"
                  style={{
                    width: "30rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                  }}
                  value={assign.memberEmail}
                  onChange={(e) => setAssign(e.target.value)}
                >
                  {emails &&
                    emails.map &&
                    emails.map((val, key) => {
                      return (
                        <option key={key} value={val.memberEmailID}>
                          {val.memberEmailID}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <label style={{ marginRight: "10.5rem" }}>
                  <strong>Date:</strong>
                </label>

                <input
                  required
                  className="inp"
                  style={{
                    width: "30rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                  }}
                  type="date"
                  name="name"
                  value={assign.date}
                  onChange={(e) => {
                    setAssign({
                      ...assign,
                      date: e.target.value,
                    });
                  }}
                />
              </div>

              <div>
                <label style={{ marginRight: "6.5rem" }}>
                  <strong>Project Name:</strong>
                </label>

                <input
                  required
                  className="inp"
                  style={{
                    width: "30rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                  }}
                  type="text"
                  name="name"
                  value={assign.projectName}
                  onChange={(e) => {
                    setAssign({
                      ...assign,
                      projectName: handleNamechange(e.target.value),
                    });
                  }}
                />
              </div>

              <div>
                <label style={{ marginRight: "8.5rem" }}>
                  <strong>Location:</strong>
                </label>

                <input
                  required
                  className="inp"
                  style={{
                    width: "30rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                  }}
                  type="text"
                  name="name"
                  value={assign.location}
                  // onChange={(e) => {
                  //   setAssign({
                  //     ...assign,
                  //     //validation on location
                  //     location: e.target.value,
                  //   });
                  // }}

                  onChange={(e) => {
                    setAssign({ ...assign, location: e.target.value });
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={{ width: "20%" }} className="btn" type="submit">
                  Save
                </button>
              </div>
              {showPopupAdded && <p>information saved successfully</p>}
              {err && <p>some error occured</p>}
            </form>
          </div>
        </div>
      </body>
    </>
  );
};

export default AssignComponent;
