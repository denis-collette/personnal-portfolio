import React from "react";
import logo from '/src/projects/didlycthulhudoo/assets/logo.png';

export default function Header({ onHomeClick, onCreateClick, on404Click }) {
  const handleNavClick = (e, callback) => {
    e.preventDefault();
    callback();
  };

  return (
    <div className="container">
      <header>
        <a href="#" onClick={(e) => handleNavClick(e, onHomeClick)}>
          <img src={logo.src} alt="Cthulhu logo" />
          <h1>Didlycthulhudoo</h1>
        </a>
        <nav>
          <ul>
            <li><a href="#" onClick={(e) => handleNavClick(e, onHomeClick)}>Home</a></li>
            <li><a href="#" onClick={(e) => handleNavClick(e, onCreateClick)}>Create Event</a></li>
            <li><a href="#" onClick={(e) => handleNavClick(e, on404Click)} title="Don't go there...">???</a></li>
          </ul>
        </nav>
      </header>
    </div>
  );
}