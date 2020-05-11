import React, { ChangeEvent, useCallback, useState } from "react"
import getText from "~/utils/getText"
import styles from "./LoginPage.scss"
import { useLogin } from "./use/useLogin"

export const LoginPage: React.FC<{}> = ({}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [handleLoginClick, error, busy] = useLogin(email, password)

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }, [])

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }, [])

  return (
    <form className={styles.form} noValidate onSubmit={handleLoginClick}>
      <h1>Login</h1>
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
          Login
        </button>
        {error && <span>{error}</span>}
      </fieldset>
    </form>
  )
}
