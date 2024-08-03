import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "./Constants";
import { UseDataContext } from "./DataContext";

function SerialNo() {
  const serialRef = useRef();
  const { setSerialNo, serialNo } = UseDataContext();
  return (
    <input
      className="inp"
      type="text"
      ref={serialRef}
      value={serialNo}
      placeholder="Serial No"
      onChange={(e) => setSerialNo(e.target.value)}
    />
  );
}
function Category() {
  const { category } = UseDataContext();
  const [cat, setCat] = useState("");
  useEffect(() => {
    setCat(category);
  }, [category]);
  const categoryRef = useRef();
  return (
    <input
      className="inp"
      ref={categoryRef}
      type="text"
      value={cat}
      placeholder="Category"
    />
  );
}
function ManagerEmail() {
  const { managerEmail } = UseDataContext();
  const [man, setMan] = useState("");
  useEffect(() => {
    setMan(managerEmail);
  }, [managerEmail]);
  const managerEmailRef = useRef();
  return (
    <input
      className="inp"
      ref={managerEmailRef}
      type="text"
      placeholder="Manager Email"
      value={man}
    />
  );
}
function ManagerDescription() {
  const { materailDescription } = UseDataContext();
  const [mat, setMat] = useState("");
  useEffect(() => {
    setMat(materailDescription);
  }, [materailDescription]);

  const materialDescriptionRef = useRef();
  return (
    <input
      className="inp"
      ref={materialDescriptionRef}
      type="text"
      value={mat}
      placeholder="Material Description"
    />
  );
}
function Pid() {
  const { setPidData, setMaterailDescription, setCategory, pidData } =
    UseDataContext();
  const [pid, setPidApi] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Category/getPID`)
      .then((response) => setPidApi(response.data));
  }, []);
  const handleData = (e) => {
    setPidData(e.target.value);
    axios
      .get(
        `${BASE_URL}/api/Category/getMaterialDescription?pid=${e.target.value}`
      )
      .then((res) => {
        setMaterailDescription(res.data);
      });

    axios
      .get(`${BASE_URL}/api/Category/getCategoryName?pid=${e.target.value}`)
      .then((res) => {
        setCategory(res.data);
      });
  };
  const pidRef = useRef();
  return (
    <select
      className="inp"
      ref={pidRef}
      onChange={(e) => handleData(e)}
      type="text"
      value={pidData}
      placeholder="pid"
    >
      <option value={""}>Select </option>
      {pid.map((val) => {
        return <option value={val}>{val}</option>;
      })}
    </select>
  );
}
function TeamName() {
  const [team, setTeam] = useState([]);
  const { setTeamName, teamName } = UseDataContext();
  const { setMangerEmail } = UseDataContext();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Team/teamNames`)
      .then((res) => setTeam(res.data));
  }, []);
  const handleData = (e) => {
    setTeamName(e.target.value);
    axios
      .get(
        `${BASE_URL}/api/Team/getManagerEmail?teamName=${e.target.value}&somekey=efer`
      )
      .then((res) => {
        setMangerEmail(res.data);
      });
  };
  const teamNameRef = useRef();
  return (
    <select
      className="inp"
      ref={teamNameRef}
      type="text"
      value={teamName}
      placeholder="Team Name"
      onChange={(e) => handleData(e)}
    >
      <option value={""}>Select</option>
      {team.map((val, key) => {
        return (
          <option key={key} value={val}>
            {val}
          </option>
        );
      })}
    </select>
  );
}
function Status() {
  const statusRef = useRef();

  const { setStatus, status } = UseDataContext();

  return (
    <select
      className="inp"
      ref={statusRef}
      onChange={(e) => setStatus(e.target.value)}
      type="text"
      value={status}
      placeholder="Status"
    >
      <option>Select</option>
      <option value={"IN WORKING"}>IN WORKING</option>
      <option value={"DISCARD"}>DISCARD</option>
    </select>
  );
}

export {
  Category,
  ManagerDescription,
  ManagerEmail,
  Pid,
  SerialNo,
  Status,
  TeamName,
};
