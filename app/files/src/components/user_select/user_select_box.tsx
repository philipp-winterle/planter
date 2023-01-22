import React, { useContext, useRef } from "react";
import { getStaticImagePath } from "../../lib/helpers";
import userImgBackup from "../../images/plant.png";

import "./user_select.scss";
import { UserSelectContext } from "../../hooks/UserSelectProvider";

const UserSelectBoxComponent = ({ user }: any) => {
  const userSelectContext = useContext(UserSelectContext);

  const userId = parseInt(user.id);
  const avatarUrl = user.avatar?.filename_disk ? getStaticImagePath(user.avatar?.filename_disk) : userImgBackup;

  return (
    <div
      className="user col"
      key={user.id}
      onClick={(e) => {
        userSelectContext.onSelect(userId);
      }}
    >
      <img className="avatar" src={avatarUrl} width="auto" />

      <div className="name">{user.name}</div>
    </div>
  );
};

export default UserSelectBoxComponent;
