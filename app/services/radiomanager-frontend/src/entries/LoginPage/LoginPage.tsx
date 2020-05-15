import cn from "classnames"
import React, { ChangeEvent, useCallback, useState } from "react"
import RouterLink from "~/components/RouterLink"
import { config } from "~/config"
import getText from "~/utils/getText"
import styles from "./LoginPage.scss"
import { useLogin } from "./use/useLogin"

export const LoginPage: React.FC<{}> = ({}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [handleLoginClick, errors, busy] = useLogin(email, password)

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }, [])

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }, [])

  return (
    <div className={styles.root}>
      <form className={styles.form} noValidate onSubmit={handleLoginClick} autoComplete="off">
        <h1>Login</h1>
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
            {getText("Don't have an account yet?")}{" "}
            <RouterLink href={config.routes.signup}>{getText("Sign Up")}</RouterLink>
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <button className={styles["submit-button"]} disabled={busy} type={"submit"}>
            {getText("Sign In")}
          </button>
        </fieldset>
      </form>
    </div>
  )
}
