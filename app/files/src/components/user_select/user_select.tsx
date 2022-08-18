import React, { useEffect, useState } from "react";
import UserSelectBoxComponent from "./user_select_box";
import DataClient from "../../lib/directusClient";
import "./user_select.scss";
import UserIcon from "../../images/user-large-solid.svg";

const dataClient = new DataClient();

const UserSelectComponent = () => {
  // determined if page has scrolled and if the view is on mobile
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const users = await dataClient.read("user", {
        fields: ["id", "avatar.*", "name", "score", "water_times", "fertilize_times"],
        sort: ["id"],
      });

      setUsers(users);
    })();
  }, []);

  return (
    <div className="user-select">
      <div
        className="users-container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="title">
          <img src={UserIcon}></img>
          <h3>User Select</h3>
        </div>
        <div className="users row">
          {users.map((user) => (
            <UserSelectBoxComponent key={user.id} user={user}></UserSelectBoxComponent>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelectComponent;
