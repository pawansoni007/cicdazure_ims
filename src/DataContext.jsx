import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";
const MyContext = createContext();
function DataContext({ children }) {
  const [pidData, setPidData] = useState("");

  const [materailDescription, setMaterailDescription] = useState("");
  const [category, setCategory] = useState("");
  const [managerEmail, setMangerEmail] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [teamName, setTeamName] = useState("");
  const [status, setStatus] = useState("");
  const reset = () => {
    setPidData("");
    setMangerEmail("");
    setMaterailDescription("");
    setCategory("");
    setSerialNo("");
    setTeamName("");
    setStatus("");
  };
  return (
    <MyContext.Provider
      value={{
        setPidData,
        pidData,
        materailDescription,
        setMaterailDescription,
        category,
        setCategory,
        managerEmail,
        setMangerEmail,
        serialNo,
        setSerialNo,
        teamName,
        setTeamName,
        status,
        setStatus,
        reset,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export function UseDataContext() {
  return useContext(MyContext);
}

export default DataContext;
