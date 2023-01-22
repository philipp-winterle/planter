import React, { useContext, useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import DataClient from "../../lib/directusClient";
import User from "../user/user";

const dataClient = new DataClient();

const UsersComponent = () => {
  const planterSocket = useSocket();
  const [users, setUsers] = useState([]);

  // Functions
  const updateUserData = async () => {
    const users = await dataClient.read("user", {
      fields: ["id", "name", "avatar.*", "score", "water_times", "fertilize_times"],
      sort: ["id"],
    });

    setUsers(users);
  };

  useEffect(() => {
    updateUserData();
  }, []);

  // Websocket Effect
  useEffect(() => {
    planterSocket.onMessage((data: any) => {
      const type = data.type;
      const target = data.target;

      if (type && target) {
        if (type === "update" && target === "users") {
          updateUserData();
        }
      } else {
        console.warn(`Got WS Message but with incomplete data. Type: ${type} | Target: ${target}`);
      }
    });
  }, []);

  const sortedTop5Users = users.sort((u1, u2) => {
    if (u1.score === u2.score) {
      return 0;
    }
    return u1.score >= u2.score ? -1 : 1;
  });

  return (
    <div className="users py-3 row row-cols-auto">
      {sortedTop5Users.map((user) => (
        //<div className="col" key={user.id}>
        <User user={user} key={user.id}></User>
        //</div>
      ))}
    </div>
  );
};

export default UsersComponent;
