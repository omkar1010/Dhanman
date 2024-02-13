import React from 'react'
import {NavLink, useNavigate} from "react-router-dom";
import Logo from "../Logo.svg"
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Navbar = () => {
  const dispatches = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatches(LogOut());
    dispatches(reset());
    navigate("/")
  };

  return (
    <>
    <div>
        <nav className="navbar is-fixed-top has-shadow" style={{backgroundColor: "#FBFBFB"}} role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <NavLink to="" className="navbar-item" >
              <img src={Logo} width="200" height="28" alt='Dhanman Precicast'/>
            </NavLink>
        
            <a href='!#' role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
        
          <div id="navbarBasicExample" className="navbar-menu">
        
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  
                  <button onClick={logout} className="button is-light">
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
    </div>
    </>
  )
}

export default Navbar