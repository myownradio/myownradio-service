import * as React from "react";
import * as PropTypes from "prop-types";

const AudioPlayer: React.FC = ({ children }) => <>{children}</>;

AudioPlayer.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AudioPlayer;
