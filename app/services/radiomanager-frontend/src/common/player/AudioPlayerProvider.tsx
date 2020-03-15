import * as React from "react";
import * as PropTypes from "prop-types";

const AudioPlayerProvider: React.FC = ({ children }) => <>{children}</>;

AudioPlayerProvider.propTypes = {
  children: PropTypes.node,
};

export default AudioPlayerProvider;
