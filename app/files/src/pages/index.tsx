import * as bootstrap from "bootstrap";
import React from "react";
import Layout from "../components/layout/layout";
import Plants from "../components/plants/plants";
import UsersComponent from "../components/users/users";
import { SocketProvider } from "../hooks/SocketProvider";
import { UserSelectProvider } from "../hooks/UserSelectProvider";

const SHOW_USERS = process.env.GATSBY_PLANTER_SHOW_USERS === "true" ?? true;

const IndexPage = (): any => {
  return (
    <Layout>
      <SocketProvider>
        <UserSelectProvider isActive={SHOW_USERS === true}>
          <div className="container-fluid">
            <div className="row pt-1">
              <div className="plants-row g-col col">
                <Plants></Plants>
              </div>
              {SHOW_USERS === true && (
                <div className="user-stats col g-col d-none d-xl-flex">
                  <UsersComponent></UsersComponent>
                </div>
              )}
            </div>
          </div>
        </UserSelectProvider>
      </SocketProvider>
    </Layout>
  );
};

export default IndexPage;
