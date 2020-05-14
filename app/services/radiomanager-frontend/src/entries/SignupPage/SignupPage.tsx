import React, { ChangeEvent, useCallback, useState } from "react"
import getText from "~/utils/getText"
import styles from "./SignupPage.scss"
import { useSignup } from "./use/useSignup"

export const SignupPage: React.FC<{}> = ({}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [handleSignupClick, errors, busy] = useSignup(email, password)

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }, [])

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }, [])

  return (
    <div className={styles.root}>
      <form className={styles.form} noValidate onSubmit={handleSignupClick}>
        <h1 className={styles.title}>Signup</h1>
        <div className={styles["general-error-message"]}>{errors.root}</div>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor={"email"}>
            {getText("Email")}
          </label>
          <input
            className={styles["text-field"]}
            disabled={busy}
            value={email}
            onChange={handleEmailChange}
            required
            name="email"
            type="email"
            autoFocus
          />
          <div className={styles["error-message"]}>{errors.email}</div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor={"password"}>
            {getText("Password")}
          </label>
          <input
            className={styles["text-field"]}
            disabled={busy}
            value={password}
            onChange={handlePasswordChange}
            required
            id="password"
            name="password"
            type="password"
          />
          <div className={styles["error-message"]}>{errors.password}</div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <button className={styles.button} disabled={busy} type={"submit"}>
            Signup
          </button>
        </fieldset>
      </form>
    </div>
  )
}
