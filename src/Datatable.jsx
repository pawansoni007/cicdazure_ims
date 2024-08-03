import React, { useState, useEffect } from "react";
import moment from "moment";
import { BASE_URL } from "./Constants";
const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/Package`)
          .then((resp) => resp.json())
          .then(setData);
        console.log("yo bro", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div id="main">
      <table className="package">
        <caption>Package Details</caption>
        <thead>
          <tr>
            <th id="pack_id">Package ID</th>
            <th id="track_id">Tracking ID</th>
            <th id="date_id">Date</th>
            <th id="sender_id">Sender's Name</th>
            <th id="recv_id">Reciever's Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.packageId}>
              <td>{item.packageId}</td>
              <td>{item.trackingId}</td>
              <td>{(item.date)}</td>
              <td>{item.senderName}</td>
              <td>{item.recieverName}</td>
              {/* <td>{item.category}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
