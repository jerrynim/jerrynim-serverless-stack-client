import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./containers/AppliedRoute";

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
    {/* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
