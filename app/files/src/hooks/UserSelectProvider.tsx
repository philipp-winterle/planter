import React, { useEffect, useState, createContext, useRef, useMemo } from "react";
import UserSelectComponent from "../components/user_select/user_select";
import DataClient from "../lib/directusClient";

const POINTS_WATERING = 10;
const POINTS_FERTILIZING = 5;

const dataClient = new DataClient();

interface UserSelectProps {
  children?: React.ReactNode;
  isActive: boolean;
}

interface ContextType {
  onSelect: (userId: number) => void;
  openPopup: (plantId: number, type: string) => void;
  closePopup: () => void;
}

// Export context
export const UserSelectContext = createContext<ContextType>({
  onSelect: (userId: number) => {},
  openPopup: (plantId: number, type: string) => {},
  closePopup: () => {},
});

export const UserSelectProvider = (props: UserSelectProps) => {
  const isActive = props.isActive;

  const [isOpen, setIsOpen] = useState(false);
  const plantIdRef = useRef<number | null>(null);
  const typeRef = useRef("");

  const api = useMemo<ContextType>(() => {
    const openPopup = (plantId: number, type: string) => {
      plantIdRef.current = plantId;
      typeRef.current = type;

      if (isActive) {
        setIsOpen(true);
      } else {
        onSelect(null);
      }
      document.body.style.position = "fixed";
    };

    const closePopup = () => {
      plantIdRef.current = null;
      setIsOpen(false);
      document.body.style.position = "";
    };

    const onSelect = async (userId: number | null) => {
      const type = typeRef.current;
      //console.log(`USER ID ${userId} | PLANT ID ${plantIdRef.current} | TYPE ${type}`);

      if (!["water", "fertilize"].includes(type)) {
        return;
      }

      // If User is set add score
      if (userId !== null) {
        // EXECUTE STUFF
        const user = await dataClient.readOne("user", userId, {
          fields: ["id", "water_times", "fertilize_times"],
        });

        user[`${type}_times`] = user[`${type}_times`] + 1;

        const queryKey = `${type}_times`;
        let queryValue = user[`${type}_times`];
        const score = user.water_times * POINTS_WATERING + user.fertilize_times * POINTS_FERTILIZING;

        const queryObj = {
          [queryKey]: queryValue,
          score: score,
        };

        await dataClient.update("user", userId, queryObj).then((data) => {});
      }

      // Update Type
      const newDate = new Date().toISOString();
      const typeAtKey = `${type}_at`;

      if (plantIdRef.current === null) {
        return;
      }

      await dataClient.update("plant", plantIdRef.current, {
        [typeAtKey]: newDate,
      });

      // Close POPUP
      closePopup();
    };

    return {
      openPopup,
      onSelect,
      closePopup,
    };
  }, []);

  useEffect(() => {
    return () => {};
  }, [isOpen, setIsOpen]);

  return (
    <UserSelectContext.Provider value={api}>
      {isOpen === true && (
        <div className="userSelectPopup" onClick={api.closePopup}>
          <UserSelectComponent></UserSelectComponent>
        </div>
      )}
      <div className="planter-content">{props.children}</div>
    </UserSelectContext.Provider>
  );
};
