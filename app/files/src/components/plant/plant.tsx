import React, { useEffect, useState } from "react";
import { createColorMap, linearScale } from "@colormap/core";
import dayjs from "dayjs";
import { colord } from "colord";

import waterSvg from "../../images/watering.png";
import hourGlassImg from "../../images/hourglass.png";
import poopImg from "../../images/poop.png";
import sunImg from "../../images/sun.png";
import sunHalfImg from "../../images/sun_half.png";
import sunNoneImg from "../../images/sun_none.png";
import sunShadowImg from "../../images/sun_shadow.png";
import dirtImg from "../../images/dirt.png";
import waterDropImg from "../../images/water-drop.png";
import plantImgBackup from "../../images/plant.png";

import "./plant.scss";
import { getStaticImagePath } from "../../lib/helpers";
import { useUserSelect } from "../../hooks/useUserSelect";

dayjs().format();

let colors: any = [
  { value: 0, mapped: [0.46, 0.72, 0.6] }, // Green
  { value: 1, mapped: [0.96, 0.85, 0.09] }, // Yellow
  { value: 1.5, mapped: [0.85, 0, 0.21] }, // Red
];
let colorScale = linearScale([0, 150], [0, 1.5]);
let colorMap = createColorMap(colors, colorScale);

interface PlantComponentProps {
  plant: Plant;
}
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
  filename_disk: string;
}

const PlantComponent = ({ plant }: PlantComponentProps) => {
  const userSelect = useUserSelect();

  const getColorForDate = (atDateIso: Date, dayInterval: number, random = false): string => {
    const atDate = dayjs(atDateIso);
    const currentDate = dayjs();

    const dateDiff = currentDate.diff(atDate, "hour");

    const interval = dayInterval * 24; // HOURS

    let dateDiffPercent = Math.min((dateDiff * 100) / interval, 150);

    // TEST RANDOM COLOR
    if (random) {
      dateDiffPercent = Math.random() * 150;
    }

    const color = colorMap(dateDiffPercent).map((c) => parseFloat((c * 255).toFixed(1))); // converted to RGB
    const rgbString = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const colorHex = colord(rgbString).toHex();

    return colorHex;
  };

  const getRestInverval = (start: Date, interval: number) => {
    const startDate = dayjs(start);
    const currentDate = dayjs();

    const dateDiff = currentDate.diff(startDate, "day", true);

    return Math.max(interval - dateDiff, 0);
  };

  const updatePlantButtonColor = (plant: Plant) => {
    const waterColorCode = getColorForDate(plant.water_at, plant.plant_usage.water_interval);
    setWaterColor(waterColorCode);

    let fertilizeColorCode = getColorForDate(plant.fertilize_at, plant.plant_usage.fertilize_interval);
    setFertilizeColor(fertilizeColorCode);
  };

  const [waterColor, setWaterColor] = useState(getColorForDate(plant.water_at, plant.plant_usage.water_interval));
  const [fertilizeColor, setFertilizeColor] = useState(
    getColorForDate(plant.fertilize_at, plant.plant_usage.fertilize_interval)
  );

  useEffect(() => {
    updatePlantButtonColor(plant);
  }, [plant]);

  // CHECK STATAE

  useEffect(() => {
    const interval = setInterval(() => {
      updatePlantButtonColor(plant);
    }, 2000);
    return () => clearInterval(interval);
  }, [plant]);

  const plantId = plant.id;
  const plantName = plant.name;
  const plantImg = plant.photo?.filename_disk ? getStaticImagePath(plant.photo?.filename_disk) : plantImgBackup;

  const plantLocation = plant.location;
  const plantUsage = plant.plant_usage;

  const waterInterval = plantUsage.water_interval;
  const waterIntervalRest = getRestInverval(plant.water_at, plant.plant_usage.water_interval);
  const waterIntervalRestInt = Math.round(waterIntervalRest);
  const isWaterAllowed = waterInterval - waterIntervalRest > waterInterval / 4; // At least 1/4 of the normal interval has to be passed
  const waterAmount = plantUsage.water_amount;
  // Calculate water amount in glasses. One class contains 250ml of water
  // One Waterglas image is 24px width
  const waterAmountGlasses = waterAmount / 250;
  const waterAmountGlassesWidth = waterAmountGlasses * 20 + "em";

  const fertilizeInterval = plantUsage.fertilize_interval;
  const fertilizeIntervalRest = getRestInverval(plant.fertilize_at, plant.plant_usage.fertilize_interval);
  const fertilizeIntervalRestInt = Math.round(fertilizeIntervalRest);
  const isFertilizeAllowed = fertilizeInterval - fertilizeIntervalRest > fertilizeInterval / 4; // At least 1/4 of the normal interval has to be passed

  const sunAmount = plantUsage.sun;
  let sunImage = sunImg;

  switch (sunAmount) {
    case "indirect":
      sunImage = sunHalfImg;
      break;
    case "half_shadow":
      sunImage = sunNoneImg;
      break;
    case "shadow":
      sunImage = sunShadowImg;
      break;
    case "direct":
    default:
      sunImage = sunImg;
      break;
  }

  return (
    <div className="card plant m-2">
      <img src={plantImg} className="plant-img card-img-top m-0" alt={plantName} />

      <div className="card-body p-0">
        <div className="container-fluid p-0 m-0">
          <div className="plant-card-subtitle">{plantLocation}</div>
          <h5 className="card-title plant-card-title">{plantName}</h5>

          <div className="plant-data container-fluid p-0 m-0">
            <div className="row w-100 m-0 px-3 py-1">
              <div className="plant-data-item water col">
                <div className="plant-data-content">
                  <div className="plant-data-content-col plant-data-icon">
                    <img src={waterSvg} />
                  </div>
                  <div className="plant-data-content-col plant-data-water-interval">
                    <img src={hourGlassImg} />
                    <span>{waterIntervalRestInt}</span>
                  </div>
                  <div className="plant-data-content-col plant-data-water-amount">
                    <div className="plant-data-water-amount-icon" style={{ width: waterAmountGlassesWidth }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row w-100 m-0 px-3 py-1">
              <div className="plant-data-item fertilize col">
                <div className="plant-data-content">
                  <div className="plant-data-content-col plant-data-icon">
                    <img src={poopImg} />
                  </div>
                  <div className="plant-data-content-col plant-data-fertilize-interval">
                    <img src={hourGlassImg} />
                    <span>{fertilizeIntervalRestInt}</span>
                  </div>
                </div>
              </div>

              <div className="plant-data-item sun col-4 ms-2">
                <div className="plant-data-content">
                  <div className="plant-data-content-col plant-data-icon">
                    <img src={sunImage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer p-0 m-0">
        <div className="container-fluid">
          <div className="row plant-data-buttons">
            <div
              className="col-6 plant-data-button water"
              style={{
                backgroundColor: waterColor,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (isWaterAllowed) {
                  userSelect.openPopup(plantId, "water");
                }
              }}
            >
              <img src={waterDropImg} />
            </div>
            <div
              className="col-6 plant-data-button fertilize"
              style={{
                backgroundColor: fertilizeColor,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (isFertilizeAllowed) {
                  userSelect.openPopup(plantId, "fertilize");
                }
              }}
            >
              <img src={dirtImg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantComponent;
