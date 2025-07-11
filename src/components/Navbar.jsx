import React from 'react'

const Navbar = () => {
    return (
      <nav className="navbar">
        <span> &lt; </span>
        Pass 
        <span className='op'>OP/&gt;</span>
        <ul className="nav-list">
          <li className="nav-item">
            <a href="/" className="nav-link">Home</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contact</a>
          </li>
        </ul>
      </nav>
    );
  }
  
  export default Navbar;
  


