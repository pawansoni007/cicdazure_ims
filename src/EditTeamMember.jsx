import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Constants";

function MemberEdit() {
  const navigate = useNavigate();
  const params = useParams();

  const [member, setMember] = useState({
    memberId: 0,
    memberName: "",
    managerName: "",
    memberGID: "",
    memberEmailID: "",
  });
  const [roleName, setRoleName] = useState("");

  async function saveData() {
    try {
      await axios.put(
        `${BASE_URL}/api/Member/UpdatedMember?UpdatedRole=${roleName}`,
        member,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          withCredentials: true,
        }
      );

      navigate(-1);
    } catch (error) {
      console.log(`Error occurred: ${error.message}`);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/Member/getMemberById/${params.memberId}`,
          {
            withCredentials: true,
          }
        );
        setMember(response.data);
        
        const {data} = await axios.get(`${BASE_URL}/api/Member/getRoleByMemberId?id=${response?.data.memberId}`);
        setRoleName(data); 

      } catch (error) {
        console.log(`Error occurred: ${error.message}`);
      }
    })();
  }, []);

  return (
    <>
      {/* header */}
      <header className="navbar">
        <NavbarComponent></NavbarComponent>
      </header>

      <span className="link-pages">
        <Link to="/Home" className="urls">
          Home{" "}
        </Link>
        &#187;
        <Link to="/viewAllTeams" className="urls inner-url">
          Teams{" "}
        </Link>
        &#187;
        <Link to="/viewTeamMemeber" className="urls inner-url">
          Team Member{" "}
        </Link>
        &#187;
      </span>
      {/* headline */}
      <div className="headline">
        <strong style={{ fontSize: "30px", margin: "0.5rem" }}>
          Edit Team Member Details
        </strong>
      </div>

      <body>
        <div className="IContainer">
          <div className="innercontainer form-control">
            <div className="team-add row">
              <div className="col-25">
                  <strong>Member Name:<span className="compulsory"> *</span></strong>
              </div>
              <div className="col-75">
                <input
                  className="inp"
                  style={{
                    width: "36rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="name"
                  value={member?.memberName}
                  onChange={(e) =>
                    setMember({ ...member, memberName: e.target.value })
                  }
                />
              </div>

              <div className="col-25">
                  <strong>Manager Name:<span className="compulsory"> *</span></strong>
              </div>
              <div className="col-75">
                <input
                  className="inp"
                  style={{
                    width: "36rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="manager"
                  value={member?.managerName}
                  onChange={(e) =>
                    setMember({ ...member, managerName: e.target.value })
                  }
                />
              </div>
              <div className="col-25">
                  <strong>Member GID:<span className="compulsory"> *</span></strong>
              </div>
              <div className="col-75">
                <input
                  className="inp"
                  style={{
                    width: "36rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="member"
                  value={member?.memberGID}
                  onChange={(e) =>
                    setMember({ ...member, memberGID: e.target.value })
                  }
                />
              </div>
              <div className="col-25">
                  <strong>Member Email:<span className="compulsory"> *</span></strong>
              </div>
              <div className="col-75">
                <input
                  className="inp"
                  style={{
                    width: "36rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="member"
                  value={member?.memberEmailID}
                  onChange={(e) =>
                    setMember({ ...member, memberEmailID: e.target.value })
                  }
                />
              </div>
              <div className="col-25">
                <strong>Role:</strong>
              </div>
              <div className="col-75">
                <select
                  style={{
                    width: "36rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "0.3rem",
                    display: "inline",
                  }}
                  type="text"
                  name="manager"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                >
                  <option value="">--Please choose an option--</option>
                  {localStorage.getItem("roles") === "admin" && (
                    <option value={"admin"}>Admin</option>
                  )}
                  {localStorage.getItem("roles") === "admin" && (
                    <option value={"manager"}>Manager</option>
                  )}
                  <option value={"teammember"}>Team Member</option>

                </select>
              </div>

              <div style={{display:"flex", justifyContent: "flex-end", alignItems: "center"}}>
                <button
                  style={{ width: "20%" }}
                  className="btn"
                  type="submit"
                  onClick={saveData}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default MemberEdit;
