import "../App.css";
import React from 'react'
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
        <h1>University Paper Generator</h1>
        <ul>
        <li><Link to="/"className="Home">Home</Link></li>
        <li><Link to="/preview-paper">Preview Paper</Link></li>
        <li><Link to="/saved-papers">Saved Papers</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar