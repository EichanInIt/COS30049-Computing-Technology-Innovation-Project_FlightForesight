// src/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

function CustomNavbar() {
  return (
    <Navbar bg="light" expand="lg" className="custom-navbar px-4">
      <Navbar.Brand href="#home" className="navbar-brand">
        FlightForesight
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Nav.Link href="#home" className="nav-link">
            Home
          </Nav.Link>
          <Nav.Link href="#about" className="nav-link">
            About
          </Nav.Link>
          <Nav.Link href="https://github.com/EichanInIt/COS30049-Computing-Technology-Innovation-Project_FlightForesight" target="_blank" rel="noopener noreferrer" className="nav-link">
            Github
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
