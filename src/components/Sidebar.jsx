import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "./CSS/Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  // ...
  const [isDailyLogsOpen, setIsDailyLogsOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isProductionOpen, setIsProductionOpen] = useState(false);
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);

  const toggleDailyLogs = () => {
    setIsDailyLogsOpen(!isDailyLogsOpen);
  };

  const toggleSchedule = () => {
    setIsScheduleOpen(!isScheduleOpen);
  };

  const toggleProduction = () => {
    setIsProductionOpen(!isProductionOpen);
  };

  const toggleRejection = () => {
    setIsRejectionOpen(!isRejectionOpen);
  };

  const toggleDispatch = () => {
    setIsDispatchOpen(!isDispatchOpen);
  };

  const dispatches = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatches(LogOut());
    dispatches(reset());
    navigate("/")
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul className="space-y-1 ml-7">
          <li className="mt-5">
            <NavLink className="nav-link" to="/dashboard">
              <i className="fi fi-rr-apps"></i>
              Dashboard
            </NavLink>
          </li>
          <li className="mt-5">
            <NavLink className="nav-link" href="#" onClick={toggleDailyLogs}>
              <i class="fi fi-rs-chart-pie-alt"></i>
              Daily Logs
              <FontAwesomeIcon
                icon={isDailyLogsOpen ? faChevronUp : faChevronDown}
                className="text-black"
              />
            </NavLink>
            {isDailyLogsOpen && (
              <ul className="sub-menu">
                {/* Schedule */}
                <li className="mt-5 ml-6">
                  <NavLink
                    className="nav-link"
                    href="#"
                    onClick={toggleSchedule}
                  >
                    Schedule
                    <FontAwesomeIcon
                      icon={isScheduleOpen ? faChevronUp : faChevronDown}
                      className="text-black"
                    />
                  </NavLink>
                  {isScheduleOpen && (
                    <ul className="sub-menu">
                      <li className="ml-5 mt-5 list-disc">
                        <NavLink to={"/schedule-plan"}>Schedule Plan</NavLink>
                      </li>
                      <li className="ml-5 mt-5 list-disc">
                        <NavLink to={"/view-schedule"}>View Schedule</NavLink>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Production */}
                <li className="mt-5 ml-6">
                  <NavLink
                    className="nav-link"
                    to={""}
                    onClick={toggleProduction}
                  >
                    Production
                    <FontAwesomeIcon
                      icon={isProductionOpen ? faChevronUp : faChevronDown}
                      className="text-black"
                    />
                  </NavLink>
                  {isProductionOpen && (
                    <ul className="sub-menu">
                      <li className="ml-6 mt-5 list-disc">
                        <NavLink to={"/production"}>Production</NavLink>
                      </li>
                      <li className="ml-6 mt-5 list-disc">
                        <NavLink to={"/heats"}>Heats</NavLink>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Rejection */}
                <li className="mt-5 ml-6">
                  <NavLink
                    className="nav-link"
                    href="#"
                    onClick={toggleRejection}
                  >
                    Rejection
                    <FontAwesomeIcon
                      icon={isRejectionOpen ? faChevronUp : faChevronDown}
                      className="text-black"
                    />
                  </NavLink>
                  {isRejectionOpen && (
                    <ul className="sub-menu">
                      <li className="ml-6 mt-5 list-disc">
                        <NavLink to={"/rejection1"}>Rejection1</NavLink>
                      </li>
                      <li className="ml-6 mt-5 list-disc">
                        <NavLink to={"/rejection2"}>Rejection2</NavLink>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Dispatch */}
                <li className="mt-5 ml-6">
                  <NavLink
                    className="nav-link"
                    to={""}
                    onClick={toggleDispatch}
                  >
                    Dispatch
                    <FontAwesomeIcon
                      icon={isDispatchOpen ? faChevronUp : faChevronDown}
                      className="text-black"
                    />
                  </NavLink>
                  {isDispatchOpen && (
                    <ul className="sub-menu">
                      <li className="ml-6 mt-5 list-disc">
                        <NavLink to={"/dispatch"}>Dispatch</NavLink>
                      </li>
                      <li className="ml-6 mt-5 list-disc">
                        <NavLink to={"/rejection3"}>Rejection 3</NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
          <li className="mt-5">
            <NavLink className="nav-link" to={"/add-customer"}>
              <i class="fi fi-rs-chart-pie-alt"></i>
              Add Customer
            </NavLink>
          </li>
          <li className="mt-5">
            <NavLink className="nav-link" to={"/add-product"}>
              <i class="fi fi-rs-chart-pie-alt"></i>
              Add Product
            </NavLink>
          </li>
          <li className="mt-5">
            <NavLink className="nav-link" to={"/settings"}>
              <i class="fi fi-rr-settings"></i>
              Settings
            </NavLink>
          </li>

          <li className="mt-5">
            <NavLink className="nav-link">
            <i class="fi fi-rr-sign-out-alt"></i>
              <button onClick={logout}>Logout</button>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
