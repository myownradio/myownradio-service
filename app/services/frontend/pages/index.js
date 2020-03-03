import { useEffect } from "react";
import Router from "next/router";

const IndexPage = () => {
  useEffect(() => {
    Router.push("/login");
  }, []);

  return null;
};

export default IndexPage;
