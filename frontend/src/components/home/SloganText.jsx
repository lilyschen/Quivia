import React from "react";

const SloganText = ({ isAuthenticated, user, loginWithRedirect, handleNavigate }) => (
  <div className="text-box">
    <p className="slogan-text">Turn Notes into Fun: Create and Learn Together!</p>
    {!isAuthenticated ? (
      <button className="get-started-btn" onClick={loginWithRedirect}>
        Get Started
      </button>
    ) : (
      <>
        <p className="subtitle">Glad you could join us {user.name}!</p>
        <button className="upload-btn" onClick={handleNavigate}>
          Begin Studying
        </button>
      </>
    )}
  </div>
);

export default SloganText;
