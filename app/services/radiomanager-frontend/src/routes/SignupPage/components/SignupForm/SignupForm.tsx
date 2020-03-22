import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import * as PropTypes from "prop-types";
import { useCallback } from "react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import Copyright from "~/components/Copyright";
import ErrorBox from "~/components/ErrorBox";
import RouterLink from "~/components/RouterLink";
import { IErrorMessage } from "~/components/use/useErrorMessage";
import { config } from "~/config";
import { useStyles } from "./styles";

type ISignupFormProps = {
  email: string;
  password: string;
  errorMessage: IErrorMessage;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSignupClicked: () => void;
};

const SignupForm: React.FC<ISignupFormProps> = ({
  email,
  password,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSignupClicked,
}) => {
  const classes = useStyles();

  const handleEmailChange = useCallback(
    event => {
      onEmailChange(event.target.value);
    },
    [onEmailChange],
  );

  const handlePasswordChange = useCallback(
    event => {
      onPasswordChange(event.target.value);
    },
    [onPasswordChange],
  );

  const handleSignupClick = useCallback(
    event => {
      event.preventDefault();
      onSignupClicked();
    },
    [onSignupClicked],
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          <FormattedMessage id="ui_signup_form_signup_title" />
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSignupClick}>
          <ErrorBox errorMessage={errorMessage} />
          <TextField
            value={email}
            onChange={handleEmailChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={<FormattedMessage id="ui_common_email_address" />}
            name="email"
            autoComplete="email"
            type="email"
            autoFocus
          />
          <TextField
            value={password}
            onChange={handlePasswordChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={<FormattedMessage id="ui_common_password" />}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            <FormattedMessage id="ui_signup_form_signup_button_title" />
          </Button>
          <Grid container>
            <Grid item>
              <RouterLink href={config.routes.login} variant="body2">
                <FormattedMessage id="ui_signup_form_login_link_title" />
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

SignupForm.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  errorMessage: PropTypes.any,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onSignupClicked: PropTypes.func.isRequired,
};

export default SignupForm;
