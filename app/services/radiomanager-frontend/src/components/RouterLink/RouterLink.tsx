import { Link, LinkProps } from "@material-ui/core";
import * as PropTypes from "prop-types";
import * as React from "react";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";

interface RouterLinkProps extends Omit<LinkProps, "onClick"> {
  href: string;
}

const RouterLink: React.FC<RouterLinkProps> = ({ href, ...otherProps }) => {
  const history = useHistory();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      history.push(href);
      e.preventDefault();
    },
    [href, history],
  );

  return <Link {...otherProps} href={href} onClick={handleClick} />;
};

RouterLink.propTypes = {
  href: PropTypes.string.isRequired,
};

export default RouterLink;
