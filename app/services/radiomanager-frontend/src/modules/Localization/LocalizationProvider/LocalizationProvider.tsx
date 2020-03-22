import * as PropTypes from "prop-types";
import * as React from "react";
import { IntlProvider } from "react-intl";

import messagesEn from "~/locales/english";

const LocalizationProvider: React.FC = ({ children }) => {
  return (
    <IntlProvider locale="en" messages={messagesEn}>
      {children}
    </IntlProvider>
  );
};

LocalizationProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

LocalizationProvider.defaultProps = {
  children: null,
};

export default LocalizationProvider;
