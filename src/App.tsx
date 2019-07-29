import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
import useReactRouter from "use-react-router";

const App: React.SFC = () => {
  const { history } = useReactRouter();

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isAuthenticating, setAuthenticating] = useState(true);
  const userHasAuthenticated = (authenticated: boolean) => {
    setAuthenticated(authenticated);
  };
  useEffect(() => {
    const LoginCheck = async () => {
      await Auth.currentSession();
    };
    try {
      LoginCheck();
      setAuthenticated(true);
      history.push("/");
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    setAuthenticating(false);
  }, [setAuthenticating, history]);

  const handleLogout = async () => {
    await Auth.signOut();

    setAuthenticated(false);
    history.push("/login");
  };

  const childProps = {
    isAuthenticated,
    userHasAuthenticated
  };
  return !isAuthenticating ? (
    <div className="App container">
      <Navbar collapseOnSelect>
        <Navbar>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
        </Navbar>
        <Navbar.Collapse>
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
        </Navbar.Collapse>
      </Navbar>
      <Routes childProps={childProps} />
    </div>
  ) : (
    <div />
  );
};

export default App;
