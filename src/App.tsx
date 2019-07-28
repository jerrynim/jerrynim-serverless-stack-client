import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";

class App extends Component {
  render() {
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
        <Routes />
      </div>
    );
  }
}

export default App;
