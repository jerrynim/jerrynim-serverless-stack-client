import React from "react";
import { Route } from "react-router-dom";

interface IProps {
  path: string;
  exact: boolean;
  component: React.FunctionComponent<any>;
  props: {
    isAuthenticated: boolean;
    userHasAuthenticated: (authenticated: boolean) => void;
  };
}

const AppliedRoute: React.FC<IProps> = ({
  component: C,
  props: cProps,
  ...rest
}) => {
  return <Route {...rest} render={(props) => <C {...cProps} />} />;
};

export default AppliedRoute;
