import React, { ChangeEvent, useCallback, useState } from "react"
import BlueLayout from "~/layouts/BlueLayout"
import gettext from "~/utils/gettext"
import styles from "./SignupPage.scss"
import { useSignup } from "./use/useSignup"

export const SignupPage: React.FC<{}> = ({}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [handleLoginClick, error, busy] = useSignup(email, password)

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }, [])

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }, [])

  return (
    <BlueLayout>
      <form className={styles.form} noValidate onSubmit={handleLoginClick}>
        <h1>Signup</h1>
        <fieldset>
          <label htmlFor={"email"}>{gettext("Email")}</label>
          <input
            disabled={busy}
            value={email}
            onChange={handleEmailChange}
            required
            name="email"
            autoComplete="email"
            type="email"
            autoFocus
          />
        </fieldset>
        <fieldset>
          <label htmlFor={"password"}>{gettext("Password")}</label>
          <input
            disabled={busy}
            value={password}
            onChange={handlePasswordChange}
            required
            id="password"
            name="password"
            autoComplete="password"
            type="password"
          />
        </fieldset>
        <fieldset>
          <button disabled={busy} type={"submit"}>
            Signup
          </button>
          {error && <span>{error}</span>}
        </fieldset>
      </form>
    </BlueLayout>
  )
}
