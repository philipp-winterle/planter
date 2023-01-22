import React from "react";
import Header from "./header";

import "../../styles/index.scss";

const Layout = ({ children }) => {
  return (
    <section className="container-fluid p-5">
      <Header />

      <main>{children}</main>
    </section>
  );
};

export default Layout;
