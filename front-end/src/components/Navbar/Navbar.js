import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/job-board">Job Board</Link></li>
        <li><Link to="/cover-letter">Cover Letter Generator</Link></li>
        <li><Link to="/companies">Companies</Link></li>
        <li><Link to="/login">Log In</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
