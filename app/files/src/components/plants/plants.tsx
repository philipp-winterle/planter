import React, { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import DataClient from "../../lib/directusClient";
import Plant from "../plant/plant";

interface Plant {
  id: number;
  sort: number;
  name: string;
  location: string;
  notes: string;
  photo: PlantPhoto;
  plant_usage: PlantUsage;
  water_at: Date;
  fertilize_at: Date;
}

interface PlantUsage {
  id: number;
  sun: string;
  type: string;
  water_amount: number;
  water_interval: number;
  fertilize_interval: number;
}

interface PlantPhoto {
  filename_download: string;
}

const dataClient = new DataClient();

const PlantsComponent = (): any => {
  const planterSocket = useSocket();
  const [plants, setPlants] = useState([]);

  // Functions
  const updatePlantData = async () => {
    const plants: any = await dataClient.read("plant", {
      fields: ["id", "sort", "name", "photo.*", "location", "notes", "plant_usage.*", "water_at", "fertilize_at"],
      sort: ["location", "name"],
    });
    setPlants(plants);
  };

  useEffect(() => {
    updatePlantData();
  }, []);

  // Websocket Effect
  useEffect(() => {
    planterSocket.onMessage((data: any) => {
      const type = data.type;
      const target = data.target;

      if (type && target) {
        if (type === "update" && target === "plants") {
          updatePlantData();
        }
      } else {
        console.warn(`Got WS Message but with incomplete data. Type: ${type} | Target: ${target}`);
      }
    });
  }, []);

  return (
    <div className="plants">
      <div className="row">
        {plants.map((plant: any) => (
          <div className="plant-col col " key={plant.id}>
            <Plant plant={plant}></Plant>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantsComponent;
