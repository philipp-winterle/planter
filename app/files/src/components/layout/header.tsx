import { OneItem } from "@directus/sdk";
import React, { useEffect, useState } from "react";
import logo from "../../images/logo.png";
import DataClient from "../../lib/directusClient";

interface SiteMetaData {
  project_name: string;
}

const dataClient = new DataClient();

const Header = () => {
  const [title, setTitle] = useState("Planter");

  const getSiteData = async () => {
    const siteMetadata: OneItem<SiteMetaData> = await dataClient.read("directus_settings", {
      fields: ["project_name"],
    });

    setTitle(siteMetadata.project_name);
  };

  useEffect(() => {
    getSiteData();
  }, []);

  return (
    <header className="planter-header">
      <div className="logo">
        <img src={logo} width="100%" height="100%"></img>
      </div>
      <div className="title">{title}</div>
    </header>
  );
};

export default Header;
