import * as React from "react";
import * as PropTypes from "prop-types";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import ErrorBox from "~/components/ErrorBox";
import Copyright from "~/components/Copyright";
import RouterLink from "~/components/RouterLink";
import { useStyles } from "./styles";
import { config } from "~/config";

type ILoginFormProps = {
  email: string;
  password: string;
  errorMessage: null | string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onLoginClicked: () => void;
};

const LoginForm: React.FC<ILoginFormProps> = ({
  email,
  password,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onLoginClicked,
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

  const handleSignInClick = useCallback(
    event => {
      event.preventDefault();
      onLoginClicked();
    },
    [onLoginClicked],
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          <FormattedMessage id="ui_login_form_login_title" />
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSignInClick}>
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
            <FormattedMessage id="ui_login_form_login_button_title" />
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                <FormattedMessage id="ui_login_form_forgot_link_title" />
              </Link>
            </Grid>
            <Grid item>
              <RouterLink href={config.routes.signup} variant="body2">
                <FormattedMessage id="ui_login_form_signup_link_title" />
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

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onLoginClicked: PropTypes.func.isRequired,
};

export default LoginForm;
