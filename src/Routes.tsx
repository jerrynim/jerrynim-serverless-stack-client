import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./containers/AppliedRoute";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";

interface IProps {
  childProps: {
    isAuthenticated: boolean;
    userHasAuthenticated: (authenticated: boolean) => void;
  };
}

const Routes: React.FC<IProps> = ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute
      path="/notes/new"
      exact
      component={NewNote}
      props={childProps}
    />
    <AppliedRoute
      path="/notes/:id"
      exact
      component={Notes}
      props={childProps}
    />

    {/* Finally, catch all unmatched routes */}
    <Route exact component={NotFound} />
  </Switch>
);

export default Routes;
