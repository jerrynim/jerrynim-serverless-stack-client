import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";

const App: React.FC = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const userHasAuthenticated = (authenticated: boolean) => {
    setAuthenticated(authenticated);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  const childProps = {
    isAuthenticated,
    userHasAuthenticated
  };
  return (
    <div className="App container">
      <Navbar collapseOnSelect>
        <Navbar>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
        </Navbar>
        <Navbar.Collapse>
          <Nav>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes childProps={childProps} />
      {isAuthenticated ? (
        <NavItem onClick={handleLogout}>Logout</NavItem>
      ) : (
        <>
          <Link to="/signup">
            <NavItem>Signup</NavItem>
          </Link>
          <Link to="/login">
            <NavItem>Login</NavItem>
          </Link>
        </>
      )}
    </div>
  );
};

export default App;
