import { UserSelectContext } from "./UserSelectProvider";
import { useContext } from "react";

export const useUserSelect = () => {
  const userSelect = useContext(UserSelectContext);

  return userSelect;
};
