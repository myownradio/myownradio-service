import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useDependencies } from "~/bootstrap/dependencies";
import { config } from "~/config";

const LogoutPage: React.FC = () => {
  const history = useHistory();
  const { sessionService } = useDependencies();

  useEffect(() => {
    sessionService.clearTokens();
    history.push(config.routes.login);
  }, [history, sessionService]);
  return null;
};

export default LogoutPage;
