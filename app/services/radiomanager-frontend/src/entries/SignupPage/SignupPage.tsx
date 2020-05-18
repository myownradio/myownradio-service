import cn from "classnames"
import React, { ChangeEvent, useCallback, useState } from "react"
import { Redirect } from "react-router-dom"
import RouterLink from "~/components/RouterLink"
import { config } from "~/config"
import { AuthenticationState, useAuthenticationModel } from "~/modules/Authentication"
import getText from "~/utils/getText"
import { useResource } from "~/utils/suspense2"
import styles from "./SignupPage.scss"
import { useSignup } from "./use/useSignup"

export const SignupPage: React.FC<{}> = ({}) => {
  const authenticationModel = useAuthenticationModel()
  const authenticationState = useResource(authenticationModel.authenticationState)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [handleSignupClick, errors, busy] = useSignup(email, password)

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }, [])

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }, [])

  if (authenticationState === AuthenticationState.AUTHENTICATED) {
    return <Redirect to={config.routes.myChannels} />
  }

  return (
    <div className={styles.root}>
      <form className={styles.form} noValidate onSubmit={handleSignupClick}>
        <h1>Signup</h1>
        <div className={styles["top-alert"]}>{errors.root}</div>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor={"email"}>
            {getText("Email")}
          </label>
          <input
            className={cn(styles["text-field"], errors.email && styles.invalid)}
            disabled={busy}
            value={email}
            onChange={handleEmailChange}
            required
            name="email"
            type="email"
            autoFocus
          />
          <div className={styles["inline-alert"]}>{errors.email}</div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor={"password"}>
            {getText("Password")}
          </label>
          <input
            className={cn(styles["text-field"], errors.password && styles.invalid)}
            disabled={busy}
            value={password}
            onChange={handlePasswordChange}
            required
            id="password"
            name="password"
            type="password"
          />
          <div className={styles["inline-alert"]}>{errors.password}</div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <div className={styles["inline-hint"]}>
            {getText("Already registered?")} <RouterLink href={config.routes.login}>{getText("Login")}</RouterLink>
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <button className={styles["submit-button"]} disabled={busy} type={"submit"}>
            Signup
          </button>
        </fieldset>
      </form>
    </div>
  )
}
