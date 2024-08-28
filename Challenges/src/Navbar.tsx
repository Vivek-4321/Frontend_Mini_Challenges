import React from "react";
import "./Navbar.css";
import githubLink from "./assets/github.webp";
import "./index.css";


function Navbar() {
  return (
    <nav className="navbar__container">
      <div className="navbar__title">
        <h2>Mini Challenges</h2>
      </div>
      <div className="navbar__github__logo">
        <img src={githubLink} />
      </div>
    </nav>
  );
}

export default Navbar;
