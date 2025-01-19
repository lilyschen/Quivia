import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Nav = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img className="logo" src="/yada-logo.png" alt="Yada logo" />
        </Link>
      </div>
      {isAuthenticated && (
        <div className="nav-links">
          <Link to="/study-sets" className="nav-link">
            My Sets
          </Link>
          <div className="logout-container">
            <LogoutButton />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
