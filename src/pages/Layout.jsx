import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
      <div className="columns mt-6">
        <div className="columns is-2 " style={{backgroundColor: "#FBFBFB"}}>
          <Sidebar />
        </div>
        <div className="column has-background-white">
          <main>{children}</main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
