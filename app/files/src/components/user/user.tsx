import React from "react";
import { getStaticImagePath } from "../../lib/helpers";
import userImgBackup from "../../images/plant.png";

import "./user.scss";

const UserComponent = ({ user }: any) => {
  const userId = parseInt(user.id);
  const avatarUrl = user.avatar?.filename_disk ? getStaticImagePath(user.avatar?.filename_disk) : userImgBackup;
  const userScore = user.score;
  const userName = user.name;
  const waterTimes = user.water_times;
  const fertilizeTimes = user.fertilize_times;

  return (
    <div className="user-card user mb-3">
      <div className="wrapper">
        <div className="user-info">
          <div className="username center">{userName}</div>
          <div className="avatar">
            <img className="avatar-image" src={avatarUrl} />
          </div>
        </div>
        <div className="more-info">
          <div className="stats">
            <div className="points">
              <div className="stats-item">
                <div className="label">
                  <span>Score</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 491.768 491.768"
                  >
                    <g id="XMLID_439_">
                      <path
                        id="XMLID_440_"
                        d="M174.048,136.543l39.925-83.12l18.234-37.966l-2.938-6.131C226.54,3.628,220.778,0,214.453,0H98.137   c-5.651,0-10.899,2.906-13.918,7.689c-3.001,4.783-3.338,10.772-0.898,15.859l72.508,150.957L174.048,136.543z"
                      />
                      <path
                        id="XMLID_441_"
                        d="M407.548,7.689C404.53,2.906,399.281,0,393.63,0h-116.3c-6.323,0-12.088,3.628-14.815,9.326   l-89.814,187.012c-0.065,0.145-0.081,0.289-0.146,0.433c-0.143,0.322-0.209,0.675-0.337,1.013   c-0.577,1.559-0.913,3.211-0.994,4.959c-0.017,0.242-0.145,0.45-0.145,0.709v8.474c22.329-11.687,47.676-18.397,74.579-18.397   c26.922,0,52.252,6.711,74.597,18.414v-4.751l88.192-183.642C410.887,18.461,410.549,12.473,407.548,7.689z"
                      />
                      <path
                        id="XMLID_442_"
                        d="M245.658,218.186c-75.559,0-136.8,61.24-136.8,136.799c0,75.543,61.241,136.783,136.8,136.783   c75.543,0,136.785-61.24,136.785-136.783C382.444,279.426,321.201,218.186,245.658,218.186z M326.966,331.1l-36.52,35.62   c-1.14,1.122-1.671,2.729-1.397,4.302l8.622,50.293c0.303,1.813-0.452,3.659-1.944,4.75c-1.492,1.092-3.483,1.221-5.105,0.369   l-45.17-23.738c-1.412-0.742-3.115-0.742-4.529,0l-45.17,23.738c-1.622,0.852-3.613,0.723-5.105-0.369   c-1.492-1.091-2.246-2.938-1.941-4.75l8.621-50.293c0.271-1.572-0.259-3.18-1.397-4.302l-36.52-35.62   c-1.331-1.302-1.797-3.227-1.236-4.977c0.58-1.768,2.104-3.05,3.918-3.307l50.516-7.337c1.574-0.225,2.939-1.219,3.645-2.664   l22.587-45.749c0.819-1.654,2.505-2.715,4.35-2.715c1.846,0,3.529,1.061,4.349,2.715l22.587,45.749   c0.705,1.445,2.069,2.439,3.645,2.664l50.516,7.337c1.813,0.257,3.34,1.539,3.918,3.307   C328.764,327.873,328.296,329.798,326.966,331.1z"
                      />
                    </g>
                  </svg>
                </div>
                <div className="value">{userScore}</div>
              </div>
            </div>

            <div className="details">
              <div className="stats-item">
                <div className="label">
                  <span>Waterings</span>
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 490 490">
                    <g>
                      <g>
                        <g>
                          <path d="M245,0c0,0-173.4,220.9-173.4,316.6S149.3,490,245,490s173.4-77.8,173.4-173.4S245,0,245,0z M245,446.4     c-5.4,0-9.7-4.3-9.7-9.7s4.3-9.7,9.7-9.7c69.2,0,125.6-56.4,125.6-125.6c0-5.4,4.3-9.7,9.7-9.7s9.7,4.3,9.7,9.7     C390.4,381.5,325.1,446.4,245,446.4z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div className="value">{waterTimes}</div>
              </div>

              <div className="stats-item">
                <div className="label">
                  <span>Fertilizations</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M451.36 369.14C468.66 355.99 480 335.41 480 312c0-39.77-32.24-72-72-72h-14.07c13.42-11.73 22.07-28.78 22.07-48 0-35.35-28.65-64-64-64h-5.88c3.57-10.05 5.88-20.72 5.88-32 0-53.02-42.98-96-96-96-5.17 0-10.15.74-15.11 1.52C250.31 14.64 256 30.62 256 48c0 44.18-35.82 80-80 80h-16c-35.35 0-64 28.65-64 64 0 19.22 8.65 36.27 22.07 48H104c-39.76 0-72 32.23-72 72 0 23.41 11.34 43.99 28.64 57.14C26.31 374.62 0 404.12 0 440c0 39.76 32.24 72 72 72h368c39.76 0 72-32.24 72-72 0-35.88-26.31-65.38-60.64-70.86z" />
                  </svg>
                </div>
                <div className="value">{fertilizeTimes}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
