import React, { ChangeEvent, useCallback, useState } from "react"
import getText from "~/utils/getText"
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
    <form className={styles.form} noValidate onSubmit={handleLoginClick}>
      <h1>Signup</h1>
      <fieldset>
        <label htmlFor={"email"}>{getText("Email")}</label>
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
        <label htmlFor={"password"}>{getText("Password")}</label>
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
  )
}
