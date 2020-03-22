import * as PropTypes from "prop-types";
import * as React from "react";

const AudioPlayerProvider: React.FC = ({ children }) => <>{children}</>;

AudioPlayerProvider.propTypes = {
  children: PropTypes.node,
};

export default AudioPlayerProvider;
